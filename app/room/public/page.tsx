"use client";

import React, { useState, useEffect, useRef } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import BottomNav from "@/components/layout/BottomNav";
import ChatHeader from "@/components/ui/ChatHeader";
import ChatBubble from "@/components/ui/ChatBubble";
import ChatInput from "@/components/ui/ChatInput";
import TypingIndicator from "@/components/ui/TypingIndicator";
import { useAppStore } from "@/store/useAppStore";

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

/* ──────────────────────────────────────────
   Mock data — will be replaced by WebSocket
   ────────────────────────────────────────── */

const KRISTANTO_MSG: ChatMessage = {
  id: "2",
  senderId: "2",
  senderName: "Kristanto",
  senderEmoji: "🧑‍💻",
  message: "Lagi ngopi nih broo..",
  timestamp: "09:33",
  isMine: false,
};

/* ──────────────────────────────────────────
   Component
   ────────────────────────────────────────── */

export default function PublicChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      senderId: "1",
      senderName: "Ken O",
      senderEmoji: "👩‍🎨",
      message: "Halo semua.. lagi pada ngapain nih di cafe?",
      timestamp: "09:32",
      isMine: false,
    },
  ]);
  const [showTyping, setShowTyping] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const msgIdCounter = useRef(10);
  const locationName = useAppStore((s) => s.locationName);

  // Online count: mock users + self
  const onlineCount = 4;

  // Typing simulation: Kristanto types for 3.5s then message appears
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTyping(false);
      setMessages((prev) => [...prev, KRISTANTO_MSG]);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom on new messages
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
      senderId: "me",
      senderName: "You",
      senderEmoji: "",
      message: text,
      timestamp,
      isMine: true,
    };

    setMessages((prev) => [...prev, userMsg]);
  };

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
        onMembersClick={() => {
          /* TODO: open members drawer */
        }}
      />

      {/* ── Messages ── */}
      <div className="public-chat-messages hide-scrollbar">
        {/* Date chip */}
        <div className="public-chat-date">
          <div className="public-chat-date__chip glass">
            <span className="public-chat-date__text">Hari ini</span>
          </div>
        </div>

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
        {showTyping && (
          <TypingIndicator
            senderName="Kristanto"
            senderEmoji="🧑‍💻"
          />
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <ChatInput onSend={handleSend} />

      {/* ── Bottom Nav ── */}
      <BottomNav />

      {/* ── Spacer ── */}
      <div className="public-chat-spacer" />

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

        /* Spacer for bottom nav */
        .public-chat-spacer {
          height: 64px;
          flex-shrink: 0;
        }
      `}</style>
    </MobileLayout>
  );
}
