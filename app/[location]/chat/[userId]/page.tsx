"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import MobileLayout from "@/components/layout/MobileLayout";
import BottomNav from "@/components/layout/BottomNav";
import PrivateChatHeader from "@/components/ui/PrivateChatHeader";
import ChatBubble from "@/components/ui/ChatBubble";
import ChatInput from "@/components/ui/ChatInput";
import TypingIndicator from "@/components/ui/TypingIndicator";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useAppStore } from "@/store/useAppStore";
import { wsClient, useWsEvent } from "@/lib/ws";
import {
  EV,
  type NewMessageEvent,
  type UserTypingEvent,
  type GroupCreatedEvent,
  type MessagesReadEvent,
} from "@/lib/wsTypes";

interface ChatMessage {
  id: string;
  message: string;
  timestamp: string;
  isMine: boolean;
  // Read receipt for my own messages: true once the partner has opened the
  // chat and read them (blue ✓✓). Undefined/false until then (grey ✓✓).
  isRead?: boolean;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export default function PrivateChatPage() {
  const params = useParams();
  const router = useRouter();
  const recipientId = params.userId as string;
  const location = useAppStore((s) => s.location);
  const sessionToken = useAppStore((s) => s.sessionToken);
  const setGroup = useAppStore((s) => s.setGroup);
  const blockUser = useAppStore((s) => s.blockUser);
  const blockedIds = useAppStore((s) => s.blockedIds);

  const [partner, setPartner] = useState<{
    name: string;
    emoji: string;
    occupation: string;
    interests: string;
    isOnline: boolean;
  }>({
    name: "Pengguna",
    emoji: "👤",
    occupation: "",
    interests: "",
    isOnline: false,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockedToast, setBlockedToast] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stopTypingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingClearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  // Load the partner's profile + the persisted DM history so reopening the
  // chat shows past messages instead of an empty thread.
  useEffect(() => {
    if (!recipientId) return;
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/chats/${recipientId}/messages`,
          {
            headers: sessionToken
              ? { Authorization: `Bearer ${sessionToken}` }
              : undefined,
          }
        );
        if (!res.ok) return;
        const data: {
          user: {
            name: string;
            emoji: string;
            occupation: string;
            interests: string;
            isOnline: boolean;
          };
          messages: ChatMessage[];
        } = await res.json();
        setPartner({
          name: data.user.name,
          emoji: data.user.emoji,
          occupation: data.user.occupation,
          interests: data.user.interests,
          isOnline: data.user.isOnline,
        });
        setMessages(data.messages ?? []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, [recipientId, sessionToken]);

  // Opening this chat means we've read whatever the partner sent us — tell the
  // server so their bubbles turn blue. Queued if the socket isn't open yet.
  const markPartnerRead = useCallback(() => {
    if (!recipientId) return;
    wsClient.send("mark_read", { senderId: recipientId });
  }, [recipientId]);

  useEffect(() => {
    markPartnerRead();
  }, [markPartnerRead]);

  // ── Incoming ──

  useWsEvent<NewMessageEvent>(EV.NEW_MESSAGE, (data) => {
    // Only messages for this conversation, and never from blocked users.
    if (!data.isMine && data.senderId !== recipientId) return;
    if (!data.isMine && blockedIds.includes(data.senderId)) return;
    setMessages((prev) => [
      ...prev,
      {
        id: data.id,
        message: data.message,
        timestamp: data.timestamp,
        isMine: data.isMine,
        // My own just-sent message starts unread (grey ✓✓); it flips to blue
        // when the partner reads it (messages_read below).
        isRead: data.isMine ? false : undefined,
      },
    ]);
    if (!data.isMine) {
      setPartnerTyping(false);
      // We're looking at the chat, so this incoming message is read on arrival.
      markPartnerRead();
    }
  });

  // The partner opened our chat and read our messages — flip our bubbles blue.
  useWsEvent<MessagesReadEvent>(EV.MESSAGES_READ, (data) => {
    if (data.readerId !== recipientId) return;
    setMessages((prev) =>
      prev.map((m) => (m.isMine ? { ...m, isRead: true } : m))
    );
  });

  useWsEvent<UserTypingEvent>(EV.USER_TYPING, (data) => {
    if (data.userId !== recipientId) return;
    setPartnerTyping(true);
    if (typingClearTimer.current) clearTimeout(typingClearTimer.current);
    typingClearTimer.current = setTimeout(() => setPartnerTyping(false), 4000);
  });

  useWsEvent<UserTypingEvent>(EV.USER_STOPPED_TYPING, (data) => {
    if (data.userId !== recipientId) return;
    setPartnerTyping(false);
    if (typingClearTimer.current) clearTimeout(typingClearTimer.current);
  });

  // Created a group with this user → remember it (we host it) and jump in.
  useWsEvent<GroupCreatedEvent>(EV.GROUP_CREATED, (data) => {
    setGroup(data.groupId, { name: data.name, iAmHost: true });
    router.push(`/${location}/group/${data.groupId}`);
  });

  // Auto-scroll on new messages / typing.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, partnerTyping]);

  // ── Outgoing ──

  const handleSend = (text: string) => {
    wsClient.send("send_message", { recipientId, message: text });
    if (isTypingRef.current) {
      isTypingRef.current = false;
      wsClient.send("typing_stop", { recipientId });
    }
    if (stopTypingTimer.current) clearTimeout(stopTypingTimer.current);
  };

  const handleTyping = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      wsClient.send("typing_start", { recipientId });
    }
    if (stopTypingTimer.current) clearTimeout(stopTypingTimer.current);
    stopTypingTimer.current = setTimeout(() => {
      isTypingRef.current = false;
      wsClient.send("typing_stop", { recipientId });
    }, 2000);
  }, [recipientId]);

  const handleCreateGroup = () => {
    const groupName = `Grup ${partner.name}`;
    wsClient.send("create_group", {
      name: groupName,
      memberIds: [recipientId],
    });
    // Navigation happens when the server replies with group_created.
  };

  const handleConfirmBlock = () => {
    setShowBlockModal(false);
    // Filter their messages locally (this session) AND tell the server to stop
    // delivering anything from them to us. blockUser persists the id so they
    // stay hidden from every list, even after a refresh.
    blockUser({ id: recipientId, name: partner.name, emoji: partner.emoji });
    wsClient.send("block_user", { userId: recipientId });
    // Show a brief confirmation, then return to the list — where they're now
    // gone — so the action has clear, visible feedback.
    setBlockedToast(true);
    setTimeout(() => router.back(), 1300);
  };

  return (
    <MobileLayout showGlow={false}>
      {/* ── Background orbs ── */}
      <div className="dm-orbs" aria-hidden="true">
        <div className="dm-orbs__cyan" />
        <div className="dm-orbs__blue" />
      </div>

      {/* ── Header ── */}
      <PrivateChatHeader
        userName={partner.name}
        userEmoji={partner.emoji}
        occupation={partner.occupation}
        interests={partner.interests}
        isOnline={partner.isOnline}
        onBack={() => router.back()}
        onCreateGroup={handleCreateGroup}
        onBlock={() => setShowBlockModal(true)}
      />

      {/* ── Messages ── */}
      <div className="dm-messages hide-scrollbar">
        {/* Info chip */}
        <div className="dm-chip-wrap">
          <div className="dm-chip glass">
            <span className="dm-chip__text">
              Chat ini akan dihapus saat kamu logout
            </span>
          </div>
        </div>

        {/* Message bubbles — no avatars in private chat */}
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg.message}
            timestamp={msg.timestamp}
            variant={msg.isMine ? "mine" : "other"}
            senderName={msg.isMine ? "You" : partner.name}
            senderEmoji={partner.emoji}
            showAvatar={false}
            read={msg.isMine ? Boolean(msg.isRead) : undefined}
          />
        ))}

        {/* Typing indicator */}
        {partnerTyping && (
          <TypingIndicator senderName={partner.name} senderEmoji={partner.emoji} />
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <ChatInput onSend={handleSend} onTyping={handleTyping} />

      {/* ── Bottom Nav ── */}
      <BottomNav />

      {/* ── Spacer ── */}
      <div className="dm-spacer" />

      {/* ── Block User Modal ── */}
      <ConfirmModal
        isOpen={showBlockModal}
        icon="🚫"
        title={`Blokir ${partner.name}?`}
        description={`${partner.name} tidak akan bisa mengirim pesan ke kamu lagi, dan langsung hilang dari daftar orang & chat. Mereka tidak akan diberi tahu. Blokir berlaku selama sesi ini.`}
        confirmLabel="Blokir"
        variant="danger"
        onConfirm={handleConfirmBlock}
        onCancel={() => setShowBlockModal(false)}
      />

      {/* ── Block confirmation toast ── */}
      {blockedToast && (
        <div className="block-toast" role="status">
          🚫 {partner.name} diblokir. Mereka tidak bisa menghubungi kamu lagi.
        </div>
      )}

      <style jsx>{`
        /* Background orbs */
        .dm-orbs {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .dm-orbs__cyan {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(0, 180, 255, 0.25) 0%,
            transparent 70%
          );
          top: -40px;
          right: -40px;
        }

        .dm-orbs__blue {
          position: absolute;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(56, 100, 255, 0.2) 0%,
            transparent 70%
          );
          bottom: 120px;
          left: -30px;
        }

        /* Messages area */
        .dm-messages {
          position: relative;
          z-index: 1;
          flex: 1;
          padding: 14px 14px 8px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
        }

        /* Info chip */
        .dm-chip-wrap {
          display: flex;
          justify-content: center;
        }

        .dm-chip {
          padding: 4px 14px;
          border-radius: 50px;
        }

        .dm-chip__text {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.45);
          font-weight: 600;
        }

        /* Spacer for bottom nav */
        .dm-spacer {
          height: 64px;
          flex-shrink: 0;
        }

        /* Block confirmation toast */
        .block-toast {
          position: fixed;
          left: 50%;
          bottom: 90px;
          transform: translateX(-50%);
          z-index: 200;
          max-width: 340px;
          width: calc(100% - 32px);
          text-align: center;
          padding: 12px 16px;
          border-radius: 14px;
          background: rgba(20, 22, 48, 0.92);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.45;
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          animation: blockToastIn 0.2s ease;
        }

        @keyframes blockToastIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </MobileLayout>
  );
}
