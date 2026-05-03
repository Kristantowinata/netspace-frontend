"use client";

import React from "react";

interface TypingIndicatorProps {
  senderName: string;
  senderEmoji: string;
}

export default function TypingIndicator({
  senderName,
  senderEmoji,
}: TypingIndicatorProps) {
  return (
    <div className="typing">
      {/* Avatar */}
      <div className="typing__avatar">{senderEmoji}</div>

      {/* Content */}
      <div className="typing__content">
        <span className="typing__name">{senderName}</span>
        <div className="typing__bubble">
          <span className="typing__dot typing__dot--1" />
          <span className="typing__dot typing__dot--2" />
          <span className="typing__dot typing__dot--3" />
        </div>
      </div>

      <style jsx>{`
        .typing {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }

        .typing__avatar {
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

        .typing__content {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .typing__name {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 600;
          padding-left: 4px;
        }

        .typing__bubble {
          background: rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px 18px 18px 4px;
          padding: 12px 18px;
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .typing__dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.45);
          animation: typingBounce 1.4s infinite ease-in-out;
        }

        .typing__dot--1 {
          animation-delay: 0s;
        }

        .typing__dot--2 {
          animation-delay: 0.2s;
        }

        .typing__dot--3 {
          animation-delay: 0.4s;
        }

        @keyframes typingBounce {
          0%,
          60%,
          100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-5px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
