"use client";

import React from "react";

interface ChatHeaderProps {
  onlineCount: number;
  locationName: string;
  onMembersClick: () => void;
}

export default function ChatHeader({
  onlineCount,
  locationName,
  onMembersClick,
}: ChatHeaderProps) {
  return (
    <div className="chat-header glass-strong">
      <div className="chat-header__inner">
        {/* Icon */}
        <div className="chat-header__icon-wrapper">
          <div className="chat-header__icon">💬</div>
          <div className="chat-header__online-dot" />
        </div>

        {/* Info */}
        <div className="chat-header__info">
          <p className="chat-header__title">Public Room</p>
          <div className="chat-header__meta">
            <span className="chat-header__dot" />
            <p className="chat-header__subtitle">
              {onlineCount} orang online · {locationName}
            </p>
          </div>
        </div>

        {/* Members button */}
        <button
          type="button"
          className="chat-header__members"
          onClick={onMembersClick}
          aria-label="View members"
        >
          👥
        </button>
      </div>

      <style jsx>{`
        .chat-header {
          padding: 14px 18px 12px;
          position: relative;
          z-index: 2;
        }

        .chat-header__inner {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-header__icon-wrapper {
          position: relative;
          flex-shrink: 0;
        }

        .chat-header__icon {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          background: linear-gradient(135deg, #3864ff, #6438ff);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .chat-header__online-dot {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid var(--bg-primary);
        }

        .chat-header__info {
          flex: 1;
          min-width: 0;
        }

        .chat-header__title {
          font-size: 15px;
          font-weight: 800;
          color: white;
        }

        .chat-header__meta {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 1px;
        }

        .chat-header__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          flex-shrink: 0;
        }

        .chat-header__subtitle {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chat-header__members {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          cursor: pointer;
          flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
          transition: background 0.15s ease;
        }

        .chat-header__members:active {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </div>
  );
}
