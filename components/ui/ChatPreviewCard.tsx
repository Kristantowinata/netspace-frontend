"use client";

import React from "react";

interface ChatPreviewCardProps {
  emoji: string;
  avatarGradient: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  subtitle?: string;
  onClick: () => void;
}

export default function ChatPreviewCard({
  emoji,
  avatarGradient,
  name,
  lastMessage,
  timestamp,
  unread,
  subtitle,
  onClick,
}: ChatPreviewCardProps) {
  return (
    <div
      className={`chat-preview ${unread ? "chat-preview--unread" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick();
      }}
    >
      {/* Avatar */}
      <div className="chat-preview__avatar" style={{ background: avatarGradient }}>
        {emoji}
        {unread && <div className="chat-preview__dot" />}
      </div>

      {/* Body */}
      <div className="chat-preview__body">
        <div className="chat-preview__top">
          <span className="chat-preview__name">{name}</span>
          <span className="chat-preview__time">{timestamp}</span>
        </div>
        {subtitle && <p className="chat-preview__subtitle">{subtitle}</p>}
        <p className="chat-preview__msg">{lastMessage}</p>
      </div>

      <style jsx>{`
        .chat-preview {
          background: rgba(255, 255, 255, 0.055);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .chat-preview:active {
          transform: scale(0.98);
        }

        .chat-preview--unread {
          background: rgba(56, 100, 255, 0.1);
          border-color: rgba(56, 100, 255, 0.2);
        }

        .chat-preview__avatar {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          position: relative;
        }

        .chat-preview__dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          background: #3864ff;
          border-radius: 50%;
          border: 2px solid var(--bg-primary);
        }

        .chat-preview__body {
          flex: 1;
          min-width: 0;
        }

        .chat-preview__top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 2px;
        }

        .chat-preview__name {
          font-size: 15px;
          font-weight: 700;
          color: white;
        }

        .chat-preview__time {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
          flex-shrink: 0;
          margin-left: 8px;
        }

        .chat-preview__subtitle {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.35);
          margin-bottom: 2px;
        }

        .chat-preview__msg {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
}
