"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MobileLayout from "@/components/layout/MobileLayout";
import BottomNav from "@/components/layout/BottomNav";
import ChatPreviewCard from "@/components/ui/ChatPreviewCard";
import { useAppStore } from "@/store/useAppStore";
import { useWsEvent } from "@/lib/ws";
import {
  EV,
  type MessageDTO,
  type NewGroupMessageEvent,
  type NewMessageEvent,
  type GroupRenamedEvent,
  type GroupDissolvedEvent,
} from "@/lib/wsTypes";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export default function ChatsPage() {
  const router = useRouter();
  const location = useAppStore((s) => s.location);
  const locationName = useAppStore((s) => s.locationName);
  const sessionToken = useAppStore((s) => s.sessionToken);
  const blockedIds = useAppStore((s) => s.blockedIds);

  const [chats, setChats] = useState<MessageDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Blocked users disappear from the chat list: drop their DM thread. (Group
  // chats stay — a block is person-to-person, not group-wide.) blockedIds is
  // persisted, so the thread stays gone after a refresh too.
  const visibleChats = chats.filter(
    (c) => !(c.type === "dm" && blockedIds.includes(c.id))
  );

  // Pull the persisted chat list (DMs + groups the user has talked in).
  useEffect(() => {
    if (!sessionToken) {
      setLoading(false);
      return;
    }
    const fetchChats = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/chats`, {
          headers: { Authorization: `Bearer ${sessionToken}` },
        });
        if (!res.ok) return;
        const data: { chats: MessageDTO[] } = await res.json();
        setChats(data.chats ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [sessionToken]);

  // Bump the matching conversation's preview when a fresh message arrives.
  useWsEvent<NewMessageEvent>(EV.NEW_MESSAGE, (data) => {
    if (data.isMine) return;
    setChats((prev) =>
      prev.map((c) =>
        c.type === "dm" && c.id === data.senderId
          ? { ...c, lastMessage: data.message, timestamp: data.timestamp, unread: true }
          : c
      )
    );
  });

  useWsEvent<NewGroupMessageEvent>(EV.NEW_GROUP_MESSAGE, (data) => {
    if (data.isMine) return;
    setChats((prev) =>
      prev.map((c) =>
        c.type === "group" && c.id === data.groupId
          ? { ...c, lastMessage: data.message, timestamp: data.timestamp, unread: true }
          : c
      )
    );
  });

  // Live: a group was renamed → update its name in the list.
  useWsEvent<GroupRenamedEvent>(EV.GROUP_RENAMED, (data) => {
    setChats((prev) =>
      prev.map((c) =>
        c.type === "group" && c.id === data.groupId
          ? { ...c, name: data.name }
          : c
      )
    );
  });

  // Live: a group dissolved → remove it from the list.
  useWsEvent<GroupDissolvedEvent>(EV.GROUP_DISSOLVED, (data) => {
    setChats((prev) =>
      prev.filter((c) => !(c.type === "group" && c.id === data.groupId))
    );
  });

  const handleChatClick = (chat: MessageDTO) => {
    if (chat.type === "dm") {
      router.push(`/${location}/chat/${chat.id}`);
    } else {
      router.push(`/${location}/group/${chat.id}`);
    }
  };

  return (
    <MobileLayout showGlow={false}>
      {/* ── Background orbs ── */}
      <div className="chats-orbs" aria-hidden="true">
        <div className="chats-orbs__blue" />
      </div>

      {/* ── Header ── */}
      <header className="chats-header">
        <h1 className="chats-header__title">Chat</h1>
        <div className="chats-header__location glass">
          <span>📍 {locationName}</span>
        </div>
      </header>

      {/* ── Section label ── */}
      <p className="chats-section-label">PESAN AKTIF</p>

      {/* ── Chat list ── */}
      <div className="chats-list hide-scrollbar">
        {loading ? (
          <div className="chats-empty">
            <p className="chats-empty__text">Memuat...</p>
          </div>
        ) : visibleChats.length > 0 ? (
          visibleChats.map((chat) => (
            <ChatPreviewCard
              key={`${chat.type}-${chat.id}`}
              emoji={chat.emoji}
              avatarGradient={chat.avatarGradient}
              name={chat.name}
              lastMessage={chat.lastMessage}
              timestamp={chat.timestamp}
              unread={chat.unread}
              subtitle={chat.subtitle}
              onClick={() => handleChatClick(chat)}
            />
          ))
        ) : (
          <div className="chats-empty">
            <p className="chats-empty__emoji">💬</p>
            <p className="chats-empty__text">Belum ada percakapan</p>
          </div>
        )}
      </div>

      {/* ── Bottom Nav ── */}
      <BottomNav />

      {/* ── Spacer ── */}
      <div className="chats-spacer" />

      <style jsx>{`
        /* Background orbs */
        .chats-orbs {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .chats-orbs__blue {
          position: absolute;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(56, 100, 255, 0.35) 0%,
            transparent 70%
          );
          top: -80px;
          right: -60px;
        }

        /* Header */
        .chats-header {
          position: relative;
          z-index: 1;
          padding: 24px 22px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chats-header__title {
          font-size: 24px;
          font-weight: 800;
          color: white;
        }

        .chats-header__location {
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
        }

        /* Section label */
        .chats-section-label {
          position: relative;
          z-index: 1;
          padding: 0 22px 10px;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        /* Chat list */
        .chats-list {
          position: relative;
          z-index: 1;
          flex: 1;
          padding: 0 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
        }

        /* Empty state */
        .chats-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 40px 20px;
        }

        .chats-empty__emoji {
          font-size: 40px;
        }

        .chats-empty__text {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.45);
        }

        /* Spacer */
        .chats-spacer {
          height: 64px;
          flex-shrink: 0;
        }
      `}</style>
    </MobileLayout>
  );
}
