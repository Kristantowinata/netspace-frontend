"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import MobileLayout from "@/components/layout/MobileLayout";
import BottomNav from "@/components/layout/BottomNav";
import GroupChatHeader from "@/components/ui/GroupChatHeader";
import GroupMembersBar from "@/components/ui/GroupMembersBar";
import ChatBubble from "@/components/ui/ChatBubble";
import ChatInput from "@/components/ui/ChatInput";
import ConfirmModal from "@/components/ui/ConfirmModal";
import InviteModal from "@/components/ui/InviteModal";

/* ──────────────────────────────────────────
   Types
   ────────────────────────────────────────── */

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderEmoji: string;
  message: string;
  timestamp: string;
  isMine: boolean;
}

interface GroupMember {
  id: string;
  name: string;
  emoji: string;
  isHost: boolean;
}

/* ──────────────────────────────────────────
   Mock data — will be replaced by WebSocket
   ────────────────────────────────────────── */

const MOCK_MEMBERS: GroupMember[] = [
  { id: "me", name: "You", emoji: "🧑‍💻", isHost: true },
  { id: "4", name: "Tanti", emoji: "👩", isHost: false },
  { id: "3", name: "Steven", emoji: "👩‍🚀", isHost: false },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    senderId: "3",
    senderName: "Steven",
    senderEmoji: "👩‍🚀",
    message: "Wah enak banget kopinya disini",
    timestamp: "09:40",
    isMine: false,
  },
  {
    id: "2",
    senderId: "4",
    senderName: "Tanti",
    senderEmoji: "👩",
    message: "Iyaa nihh.. mereka pake kopi dari mana yahh..",
    timestamp: "09:41",
    isMine: false,
  },
  {
    id: "3",
    senderId: "me",
    senderName: "You",
    senderEmoji: "🧑‍💻",
    message: "Haha iya lagi, jadi penasaran nih",
    timestamp: "09:42",
    isMine: true,
  },
];

/* ──────────────────────────────────────────
   Component
   ────────────────────────────────────────── */

export default function GroupSessionPage() {
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const msgIdCounter = useRef(10);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle user sending a message
  // TODO: Replace with WebSocket emit when backend is ready
  const handleSend = (text: string) => {
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const newId = String(msgIdCounter.current++);

    const userMsg: ChatMessage = {
      id: newId,
      senderId: "me",
      senderName: "You",
      senderEmoji: "🧑‍💻",
      message: text,
      timestamp,
      isMine: true,
    };

    setMessages((prev) => [...prev, userMsg]);
  };

  return (
    <MobileLayout showGlow={false}>
      {/* ── Background orbs ── */}
      <div className="gs-orbs" aria-hidden="true">
        <div className="gs-orbs__blue" />
        <div className="gs-orbs__purple" />
      </div>

      {/* ── Header ── */}
      <GroupChatHeader
        groupName="Kopi Gacor"
        groupEmoji="☕"
        memberCount={MOCK_MEMBERS.length}
        onBack={() => router.back()}
      />

      {/* ── Members ── */}
      <GroupMembersBar
        members={MOCK_MEMBERS}
        onInvite={() => setShowInviteModal(true)}
        onLeave={() => setShowLeaveModal(true)}
      />

      {/* ── Messages ── */}
      <div className="gs-messages hide-scrollbar">
        {/* Section label */}
        <p className="gs-section-label">CHAT GRUP</p>

        {/* Message bubbles — with avatars in group chat */}
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg.message}
            timestamp={msg.timestamp}
            variant={msg.isMine ? "mine" : "other"}
            senderName={msg.senderName}
            senderEmoji={msg.senderEmoji}
            showAvatar={true}
          />
        ))}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <ChatInput
        onSend={handleSend}
        placeholder="Tulis pesan ke grup..."
      />

      {/* ── Bottom Nav ── */}
      <BottomNav />

      {/* ── Spacer ── */}
      <div className="gs-spacer" />

      {/* ── Leave Group Modal ── */}
      <ConfirmModal
        isOpen={showLeaveModal}
        icon="🚪"
        title="Keluar dari grup?"
        description="Kamu akan keluar dari group session ini. Pesan yang sudah dikirim tetap terlihat oleh anggota lain."
        confirmLabel="Keluar"
        variant="danger"
        onConfirm={() => {
          setShowLeaveModal(false);
          router.back();
        }}
        onCancel={() => setShowLeaveModal(false)}
      />

      {/* ── Invite Modal ── */}
      <InviteModal
        isOpen={showInviteModal}
        availableUsers={[
          { id: "1", name: "Ken O", emoji: "👩‍🎨" },
          { id: "2", name: "Kristanto", emoji: "🧑‍💻" },
        ]}
        onInvite={(ids) => {
          // TODO: Send invite via WebSocket
          console.log("Invited:", ids);
        }}
        onClose={() => setShowInviteModal(false)}
      />

      <style jsx>{`
        /* Background orbs */
        .gs-orbs {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .gs-orbs__blue {
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

        .gs-orbs__purple {
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
        .gs-messages {
          position: relative;
          z-index: 1;
          flex: 1;
          padding: 0 14px 8px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
        }

        .gs-section-label {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.5px;
          padding: 6px 4px 2px;
        }

        /* Spacer for bottom nav */
        .gs-spacer {
          height: 64px;
          flex-shrink: 0;
        }
      `}</style>
    </MobileLayout>
  );
}
