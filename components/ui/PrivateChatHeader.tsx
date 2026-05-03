"use client";

import React from "react";

interface PrivateChatHeaderProps {
  userName: string;
  userEmoji: string;
  interests: string;
  isOnline: boolean;
  onBack: () => void;
  onCreateGroup: () => void;
  onBlock: () => void;
}

export default function PrivateChatHeader({
  userName,
  userEmoji,
  interests,
  isOnline,
  onBack,
  onCreateGroup,
  onBlock,
}: PrivateChatHeaderProps) {
  return (
    <div className="pc-header glass-strong">
      <div className="pc-header__inner">
        {/* Back */}
        <button
          type="button"
          className="pc-header__back"
          onClick={onBack}
          aria-label="Go back"
        >
          ←
        </button>

        {/* Avatar */}
        <div className="pc-header__avatar-wrap">
          <div className="pc-header__avatar">{userEmoji}</div>
          {isOnline && <div className="pc-header__online" />}
        </div>

        {/* Info */}
        <div className="pc-header__info">
          <p className="pc-header__name">{userName}</p>
          <div className="pc-header__meta">
            {isOnline && <span className="pc-header__dot" />}
            <p className="pc-header__subtitle">
              {isOnline ? "Online" : "Offline"} · {interests}
            </p>
          </div>
        </div>

        {/* Actions */}
        <button
          type="button"
          className="pc-header__action"
          onClick={onCreateGroup}
          aria-label="Create group"
        >
          +
        </button>
        <button
          type="button"
          className="pc-header__action"
          onClick={onBlock}
          aria-label="Block user"
        >
          ⛔
        </button>
      </div>

      <style jsx>{`
        .pc-header {
          padding: 14px 18px 12px;
          position: relative;
          z-index: 2;
        }

        .pc-header__inner {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pc-header__back {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 20px;
          padding: 0 4px;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .pc-header__avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .pc-header__avatar {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          background: linear-gradient(
            135deg,
            rgba(0, 180, 255, 0.5),
            rgba(56, 100, 255, 0.5)
          );
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .pc-header__online {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid var(--bg-primary);
        }

        .pc-header__info {
          flex: 1;
          min-width: 0;
        }

        .pc-header__name {
          font-size: 15px;
          font-weight: 800;
          color: white;
        }

        .pc-header__meta {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 1px;
        }

        .pc-header__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          flex-shrink: 0;
        }

        .pc-header__subtitle {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pc-header__action {
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

        .pc-header__action:active {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </div>
  );
}
