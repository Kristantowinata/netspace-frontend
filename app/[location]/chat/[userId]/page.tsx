"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import MobileLayout from "@/components/layout/MobileLayout";
import BottomNav from "@/components/layout/BottomNav";
import PrivateChatHeader from "@/components/ui/PrivateChatHeader";
import ChatBubble from "@/components/ui/ChatBubble";
import ChatInput from "@/components/ui/ChatInput";
import TypingIndicator from "@/components/ui/TypingIndicator";
import ConfirmModal from "@/components/ui/ConfirmModal";

/* ──────────────────────────────────────────
   Types
   ────────────────────────────────────────── */

interface ChatMessage {
  id: string;
  message: string;
  timestamp: string;
  isMine: boolean;
}

interface UserProfile {
  name: string;
  emoji: string;
  interests: string;
}

/* ──────────────────────────────────────────
   Mock user lookup — matches Room Landing
   ────────────────────────────────────────── */

const USERS: Record<string, UserProfile> = {
  "ken-o": { name: "Ken O", emoji: "👩‍🎨", interests: "☕ Kopi, 📚 Buku" },
  "kristanto": { name: "Kristanto", emoji: "🧑‍💻", interests: "💻 Tech, 🎮 Gaming" },
  "steven": { name: "Steven", emoji: "👩‍🚀", interests: "🎵 Musik" },
};

/* ──────────────────────────────────────────
   Component
   ────────────────────────────────────────── */

export default function PrivateChatPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const user = USERS[userId] ?? { name: userId, emoji: "👤", interests: "" };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      message: "Halo broo.. boleh kenalan?",
      timestamp: "09:35",
      isMine: false,
    },
  ]);
  // TODO: Replace with WebSocket-driven typing state when backend is ready
  const showTyping = false;
  const [showBlockModal, setShowBlockModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const msgIdCounter = useRef(10);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showTyping]);

  // Handle user sending a message
  // TODO: Replace with WebSocket emit when backend is ready
  const handleSend = (text: string) => {
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const newId = String(msgIdCounter.current++);

    const userMsg: ChatMessage = {
      id: newId,
      message: text,
      timestamp,
      isMine: true,
    };

    setMessages((prev) => [...prev, userMsg]);
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
        userName={user.name}
        userEmoji={user.emoji}
        interests={user.interests}
        isOnline={true}
        onBack={() => router.back()}
        onCreateGroup={() => {/* TODO: group creation */}}
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
            senderName={msg.isMine ? "You" : user.name}
            senderEmoji={user.emoji}
            showAvatar={false}
            readReceipt={msg.isMine}
          />
        ))}

        {/* Typing indicator */}
        {showTyping && (
          <TypingIndicator senderName={user.name} senderEmoji={user.emoji} />
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <ChatInput onSend={handleSend} />

      {/* ── Bottom Nav ── */}
      <BottomNav />

      {/* ── Spacer ── */}
      <div className="dm-spacer" />

      {/* ── Block User Modal ── */}
      <ConfirmModal
        isOpen={showBlockModal}
        icon="⛔"
        title={`Block ${user.name}?`}
        description="Kamu tidak akan bisa menerima pesan dari orang ini lagi selama sesi berlangsung."
        confirmLabel="Block"
        variant="danger"
        onConfirm={() => {
          setShowBlockModal(false);
          router.back();
        }}
        onCancel={() => setShowBlockModal(false)}
      />

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
      `}</style>
    </MobileLayout>
  );
}
