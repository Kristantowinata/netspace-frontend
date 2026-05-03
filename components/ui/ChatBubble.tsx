"use client";

import React from "react";

interface ChatBubbleProps {
  message: string;
  timestamp: string;
  variant: "mine" | "other";
  senderName?: string;
  senderEmoji?: string;
  showAvatar?: boolean;
  readReceipt?: boolean;
}

export default function ChatBubble({
  message,
  timestamp,
  variant,
  senderName,
  senderEmoji,
  showAvatar = true,
  readReceipt,
}: ChatBubbleProps) {
  const isMine = variant === "mine";

  return (
    <div className={`chat-bubble chat-bubble--${variant}`}>
      {/* Avatar — only for "other" when showAvatar is true */}
      {!isMine && showAvatar && (
        <div className="chat-bubble__avatar">{senderEmoji}</div>
      )}

      {/* Content */}
      <div className="chat-bubble__content">
        {/* Sender name */}
        <span className="chat-bubble__name">
          {isMine ? "You" : senderName}
        </span>

        {/* Bubble */}
        <div className={`chat-bubble__body chat-bubble__body--${variant}`}>
          <p className="chat-bubble__text">{message}</p>
        </div>

        {/* Timestamp + read receipt */}
        <span className="chat-bubble__time">
          {timestamp}
          {isMine && readReceipt && (
            <span className="chat-bubble__read">✓✓</span>
          )}
        </span>
      </div>

      <style jsx>{`
        .chat-bubble {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }

        .chat-bubble--mine {
          flex-direction: row-reverse;
        }

        .chat-bubble__avatar {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: linear-gradient(
            135deg,
            rgba(56, 100, 255, 0.4),
            rgba(100, 60, 255, 0.4)
          );
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .chat-bubble__content {
          display: flex;
          flex-direction: column;
          gap: 3px;
          max-width: 72%;
        }

        .chat-bubble--mine .chat-bubble__content {
          align-items: flex-end;
        }

        .chat-bubble__name {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 600;
          padding-left: 4px;
        }

        .chat-bubble--mine .chat-bubble__name {
          padding-left: 0;
          padding-right: 4px;
        }

        .chat-bubble__body {
          padding: 10px 14px;
        }

        .chat-bubble__body--other {
          background: rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px 18px 18px 4px;
        }

        .chat-bubble__body--mine {
          background: linear-gradient(
            135deg,
            rgba(56, 100, 255, 0.55),
            rgba(100, 60, 255, 0.45)
          );
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(100, 140, 255, 0.4);
          border-radius: 18px 18px 4px 18px;
        }

        .chat-bubble__text {
          font-size: 14px;
          color: white;
          line-height: 1.5;
        }

        .chat-bubble__time {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.3);
          padding-left: 4px;
        }

        .chat-bubble--mine .chat-bubble__time {
          padding-left: 0;
          padding-right: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .chat-bubble__read {
          color: rgba(56, 180, 255, 0.7);
          font-size: 10px;
        }
      `}</style>
    </div>
  );
}
