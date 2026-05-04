"use client";

import React from "react";
import { useRouter } from "next/navigation";
import MobileLayout from "@/components/layout/MobileLayout";
import BottomNav from "@/components/layout/BottomNav";
import ChatPreviewCard from "@/components/ui/ChatPreviewCard";
import { useAppStore } from "@/store/useAppStore";

/* ──────────────────────────────────────────
   Mock data — will be replaced by WebSocket
   ────────────────────────────────────────── */

interface ChatPreview {
  id: string;
  type: "dm" | "group";
  name: string;
  emoji: string;
  avatarGradient: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  subtitle?: string;
}

const MOCK_CHATS: ChatPreview[] = [
  {
    id: "ken-o",
    type: "dm",
    name: "Ken O",
    emoji: "👩‍🎨",
    avatarGradient: "linear-gradient(135deg, rgba(56, 100, 255, 0.5), rgba(100, 60, 255, 0.4))",
    lastMessage: "Halo broo.. boleh kenalan?",
    timestamp: "09:35",
    unread: true,
  },
  {
    id: "kopi-gang",
    type: "group",
    name: "Kopi Gacor",
    emoji: "☕",
    avatarGradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    lastMessage: "Haha iya lagi, jadi penasaran nih",
    timestamp: "09:42",
    unread: false,
    subtitle: "Group Session · 3 anggota",
  },
];

/* ──────────────────────────────────────────
   Component
   ────────────────────────────────────────── */

export default function ChatsPage() {
  const router = useRouter();
  const { location, locationName } = useAppStore();

  const handleChatClick = (chat: ChatPreview) => {
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
        {MOCK_CHATS.length > 0 ? (
          MOCK_CHATS.map((chat) => (
            <ChatPreviewCard
              key={chat.id}
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
