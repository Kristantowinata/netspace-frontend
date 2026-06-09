"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import BottomNav from "@/components/layout/BottomNav";
import ChatHeader from "@/components/ui/ChatHeader";
import ChatBubble from "@/components/ui/ChatBubble";
import ChatInput from "@/components/ui/ChatInput";
import TypingIndicator from "@/components/ui/TypingIndicator";
import MembersDrawer from "@/components/ui/MembersDrawer";
import { useAppStore } from "@/store/useAppStore";
import { wsClient, useWsEvent } from "@/lib/ws";
import {
  EV,
  type NewPublicMessageEvent,
  type PublicUserTypingEvent,
  type UserJoinedEvent,
  type UserLeftEvent,
} from "@/lib/wsTypes";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderEmoji: string;
  message: string;
  timestamp: string;
  isMine: boolean;
}

interface Member {
  id: string;
  name: string;
  emoji: string;
}

interface UsersResponse {
  users: { id: string; name: string; emoji: string }[];
  onlineCount: number;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export default function PublicChatPage() {
  const location = useAppStore((s) => s.location);
  const locationName = useAppStore((s) => s.locationName);
  const sessionToken = useAppStore((s) => s.sessionToken);
  const myId = useAppStore((s) => s.userId);
  const myName = useAppStore((s) => s.name);
  const blockedIds = useAppStore((s) => s.blockedIds);
  const clearUnreadPublic = useAppStore((s) => s.clearUnreadPublic);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [typingUsers, setTypingUsers] = useState<PublicUserTypingEvent[]>([]);
  const [showMembers, setShowMembers] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const stopTypingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  // Seed the member list + online count from the REST snapshot, then add self.
  useEffect(() => {
    if (!location) return;
    const fetchMembers = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/locations/${location}/users`, {
          headers: sessionToken
            ? { Authorization: `Bearer ${sessionToken}` }
            : undefined,
        });
        if (!res.ok) return;
        const data: UsersResponse = await res.json();
        const others: Member[] = data.users.map((u) => ({
          id: u.id,
          name: u.name,
          emoji: u.emoji,
        }));
        const self: Member = { id: myId || "me", name: myName || "You", emoji: "🧑" };
        setMembers([self, ...others.filter((m) => m.id !== myId)]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMembers();
  }, [location, sessionToken, myId, myName]);

  // Load the recent shared timeline so the room has context on open instead of
  // starting blank. Blocked users' lines are filtered out client-side. Being
  // here means these are read — clear the unread badge.
  useEffect(() => {
    if (!location) return;
    clearUnreadPublic();
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/locations/${location}/public-messages`,
          {
            headers: sessionToken
              ? { Authorization: `Bearer ${sessionToken}` }
              : undefined,
          }
        );
        if (!res.ok) return;
        const data: { messages: (ChatMessage & { senderName: string })[] } =
          await res.json();
        const history = (data.messages ?? [])
          .filter((m) => m.isMine || !blockedIds.includes(m.senderId))
          .map((m) => ({
            id: m.id,
            senderId: m.senderId,
            senderName: m.isMine ? "You" : m.senderName,
            senderEmoji: m.senderEmoji,
            message: m.message,
            timestamp: m.timestamp,
            isMine: m.isMine,
          }));
        // Merge under any live messages that may have already arrived, de-duped
        // by id so a message can't appear twice.
        setMessages((prev) => {
          const seen = new Set(prev.map((p) => p.id));
          const merged = [...history.filter((h) => !seen.has(h.id)), ...prev];
          return merged;
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
    // Only re-seed when the location changes, not on every blockedIds tweak.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, sessionToken]);

  // ── Incoming events ──

  useWsEvent<NewPublicMessageEvent>(EV.NEW_PUBLIC_MESSAGE, (data) => {
    if (!data.isMine && blockedIds.includes(data.senderId)) return;
    setMessages((prev) => {
      // Ignore duplicates (e.g. a message already present from history).
      if (prev.some((m) => m.id === data.id)) return prev;
      return [
        ...prev,
        {
          id: data.id,
          senderId: data.senderId,
          senderName: data.isMine ? "You" : data.senderName,
          senderEmoji: data.senderEmoji,
          message: data.message,
          timestamp: data.timestamp,
          isMine: data.isMine,
        },
      ];
    });
    // A message from someone means they stopped typing.
    setTypingUsers((prev) => prev.filter((t) => t.userId !== data.senderId));
  });

  useWsEvent<PublicUserTypingEvent>(EV.PUBLIC_USER_TYPING, (data) => {
    if (blockedIds.includes(data.userId)) return;
    setTypingUsers((prev) => {
      const without = prev.filter((t) => t.userId !== data.userId);
      return [...without, data];
    });
    // Safety auto-clear in case a stop event is missed.
    clearTimeout(typingTimers.current[data.userId]);
    typingTimers.current[data.userId] = setTimeout(() => {
      setTypingUsers((prev) => prev.filter((t) => t.userId !== data.userId));
    }, 4000);
  });

  useWsEvent<PublicUserTypingEvent>(EV.PUBLIC_USER_STOPPED_TYPING, (data) => {
    setTypingUsers((prev) => prev.filter((t) => t.userId !== data.userId));
    clearTimeout(typingTimers.current[data.userId]);
  });

  useWsEvent<UserJoinedEvent>(EV.USER_JOINED, (data) => {
    const u = data.user;
    // Ignore self and blocked users — a blocked person shouldn't rejoin the
    // member list just because they reconnected.
    if (u.id === myId || blockedIds.includes(u.id)) return;
    setMembers((prev) =>
      prev.some((m) => m.id === u.id)
        ? prev
        : [...prev, { id: u.id, name: u.name, emoji: u.emoji }]
    );
  });

  useWsEvent<UserLeftEvent>(EV.USER_LEFT, (data) => {
    setMembers((prev) => prev.filter((m) => m.id !== data.userId));
    setTypingUsers((prev) => prev.filter((t) => t.userId !== data.userId));
  });

  // Auto-scroll to bottom on new messages / typing.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  // ── Outgoing ──

  const handleSend = (text: string) => {
    wsClient.send("send_public_message", {
      locationSlug: location,
      message: text,
    });
    // Stop typing once a message is sent.
    if (isTypingRef.current) {
      isTypingRef.current = false;
      wsClient.send("public_typing_stop", { locationSlug: location });
    }
    if (stopTypingTimer.current) clearTimeout(stopTypingTimer.current);
  };

  const handleTyping = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      wsClient.send("public_typing_start", { locationSlug: location });
    }
    if (stopTypingTimer.current) clearTimeout(stopTypingTimer.current);
    stopTypingTimer.current = setTimeout(() => {
      isTypingRef.current = false;
      wsClient.send("public_typing_stop", { locationSlug: location });
    }, 2000);
  }, [location]);

  // Hide blocked users from the member list + the online count. blockedIds is
  // persisted, so the filter also holds after a refresh re-seeds from REST.
  const visibleMembers = members.filter((m) => !blockedIds.includes(m.id));
  const onlineCount = visibleMembers.length;
  const typing = typingUsers[typingUsers.length - 1];

  return (
    <MobileLayout showGlow={false}>
      {/* ── Background orbs ── */}
      <div className="public-chat-orbs" aria-hidden="true">
        <div className="public-chat-orbs__blue" />
        <div className="public-chat-orbs__purple" />
      </div>

      {/* ── Header ── */}
      <ChatHeader
        onlineCount={onlineCount}
        locationName={locationName}
        onMembersClick={() => setShowMembers(true)}
      />

      {/* ── Messages ── */}
      <div className="public-chat-messages hide-scrollbar">
        {/* Date chip */}
        <div className="public-chat-date">
          <div className="public-chat-date__chip glass">
            <span className="public-chat-date__text">Hari ini</span>
          </div>
        </div>

        {messages.length === 0 && (
          <div className="public-chat-empty">
            <p className="public-chat-empty__text">
              Belum ada pesan. Sapa yang lain duluan 👋
            </p>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg.message}
            timestamp={msg.timestamp}
            variant={msg.isMine ? "mine" : "other"}
            senderName={msg.senderName}
            senderEmoji={msg.senderEmoji}
          />
        ))}

        {/* Typing indicator */}
        {typing && (
          <TypingIndicator
            senderName={typing.name}
            senderEmoji={typing.emoji}
          />
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <ChatInput onSend={handleSend} onTyping={handleTyping} />

      {/* ── Bottom Nav ── */}
      <BottomNav />

      {/* ── Spacer ── */}
      <div className="public-chat-spacer" />

      {/* ── Members Drawer ── */}
      <MembersDrawer
        isOpen={showMembers}
        locationName={locationName}
        members={visibleMembers.map((m) => ({
          id: m.id,
          name: m.id === myId ? `${m.name} (kamu)` : m.name,
          emoji: m.emoji,
          isOnline: true,
        }))}
        onClose={() => setShowMembers(false)}
      />

      <style jsx>{`
        /* Background orbs */
        .public-chat-orbs {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .public-chat-orbs__blue {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(56, 100, 255, 0.3) 0%,
            transparent 70%
          );
          top: -50px;
          left: -50px;
        }

        .public-chat-orbs__purple {
          position: absolute;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(100, 60, 255, 0.25) 0%,
            transparent 70%
          );
          bottom: 100px;
          right: -40px;
        }

        /* Messages area */
        .public-chat-messages {
          position: relative;
          z-index: 1;
          flex: 1;
          padding: 14px 14px 8px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
        }

        /* Date chip */
        .public-chat-date {
          display: flex;
          justify-content: center;
        }

        .public-chat-date__chip {
          padding: 4px 14px;
          border-radius: 50px;
        }

        .public-chat-date__text {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.45);
          font-weight: 600;
        }

        .public-chat-empty {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .public-chat-empty__text {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
          text-align: center;
        }

        /* Spacer for bottom nav */
        .public-chat-spacer {
          height: 64px;
          flex-shrink: 0;
        }
      `}</style>
    </MobileLayout>
  );
}
