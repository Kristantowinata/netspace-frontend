"use client";

import React from "react";
import InterestChip from "./InterestChip";

interface Interest {
  emoji: string;
  label: string;
}

interface UserProfileDrawerProps {
  isOpen: boolean;
  name: string;
  emoji: string;
  interests: Interest[];
  isOnline?: boolean;
  onClose: () => void;
  onChat: () => void;
}

export default function UserProfileDrawer({
  isOpen,
  name,
  emoji,
  interests,
  isOnline = true,
  onClose,
  onChat,
}: UserProfileDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="upd-backdrop" onClick={onClose} />

      {/* Drawer */}
      <div className="upd-drawer">
        {/* Handle */}
        <div className="upd-handle" />

        {/* Avatar */}
        <div className="upd-avatar-wrap">
          <div className="upd-avatar">{emoji}</div>
          {isOnline && <div className="upd-online" />}
        </div>

        {/* Name */}
        <h2 className="upd-name">{name}</h2>
        <div className="upd-status">
          <span className="upd-status__dot" />
          <span className="upd-status__text">
            {isOnline ? "Online sekarang" : "Offline"}
          </span>
        </div>

        {/* Interests */}
        {interests.length > 0 && (
          <div className="upd-interests">
            <p className="upd-interests__label">MINAT</p>
            <div className="upd-interests__tags">
              {interests.map((i) => (
                <InterestChip key={i.label} emoji={i.emoji} label={i.label} />
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="upd-actions">
          <button type="button" className="upd-btn upd-btn--chat" onClick={onChat}>
            💬 Mulai Chat
          </button>
          <button type="button" className="upd-btn upd-btn--close" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>

      <style jsx>{`
        .upd-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 100;
          animation: fadeIn 0.2s ease;
        }

        .upd-drawer {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 390px;
          background: var(--bg-card);
          border-top: 1px solid var(--glass-border);
          border-radius: 24px 24px 0 0;
          padding: 12px 24px 36px;
          z-index: 101;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          animation: slideUp 0.25s ease;
        }

        .upd-handle {
          width: 40px;
          height: 4px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.2);
          margin-bottom: 12px;
        }

        .upd-avatar-wrap {
          position: relative;
        }

        .upd-avatar {
          width: 72px;
          height: 72px;
          border-radius: 22px;
          background: linear-gradient(
            135deg,
            rgba(56, 100, 255, 0.45),
            rgba(100, 60, 255, 0.4)
          );
          border: 2px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
        }

        .upd-online {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #22c55e;
          border: 3px solid var(--bg-card);
        }

        .upd-name {
          font-size: 20px;
          font-weight: 800;
          color: white;
          margin-top: 4px;
        }

        .upd-status {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .upd-status__dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
        }

        .upd-status__text {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 500;
        }

        .upd-interests {
          width: 100%;
          margin-top: 8px;
        }

        .upd-interests__label {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .upd-interests__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .upd-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
          margin-top: 12px;
        }

        .upd-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          border: none;
          transition: transform 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .upd-btn:active {
          transform: scale(0.97);
        }

        .upd-btn--chat {
          background: var(--gradient-brand);
          color: white;
          box-shadow: 0 4px 18px rgba(56, 100, 255, 0.35);
        }

        .upd-btn--close {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(100%); }
          to { transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  );
}
