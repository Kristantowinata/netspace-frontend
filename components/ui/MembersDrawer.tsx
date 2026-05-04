"use client";

import React from "react";

interface MemberItem {
  id: string;
  name: string;
  emoji: string;
  isOnline?: boolean;
}

interface MembersDrawerProps {
  isOpen: boolean;
  members: MemberItem[];
  locationName: string;
  onClose: () => void;
}

export default function MembersDrawer({
  isOpen,
  members,
  locationName,
  onClose,
}: MembersDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="md-backdrop" onClick={onClose} />

      {/* Drawer */}
      <div className="md-drawer">
        {/* Handle */}
        <div className="md-handle" />

        {/* Header */}
        <div className="md-header">
          <h2 className="md-header__title">Siapa di sini?</h2>
          <p className="md-header__sub">📍 {locationName} · {members.length} orang</p>
        </div>

        {/* Members list */}
        <div className="md-list hide-scrollbar">
          {members.map((m) => (
            <div key={m.id} className="md-member">
              <div className="md-member__avatar-wrap">
                <div className="md-member__avatar">{m.emoji}</div>
                {m.isOnline !== false && <div className="md-member__online" />}
              </div>
              <div className="md-member__info">
                <p className="md-member__name">{m.name}</p>
                <p className="md-member__status">
                  {m.isOnline !== false ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Close button */}
        <button type="button" className="md-close" onClick={onClose}>
          Tutup
        </button>
      </div>

      <style jsx>{`
        .md-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 100;
          animation: fadeIn 0.2s ease;
        }

        .md-drawer {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 390px;
          max-height: 70vh;
          background: var(--bg-card);
          border-top: 1px solid var(--glass-border);
          border-radius: 24px 24px 0 0;
          padding: 12px 20px 28px;
          z-index: 101;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.25s ease;
        }

        .md-handle {
          width: 40px;
          height: 4px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.2);
          margin: 0 auto 16px;
        }

        .md-header {
          margin-bottom: 16px;
        }

        .md-header__title {
          font-size: 18px;
          font-weight: 800;
          color: white;
        }

        .md-header__sub {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 4px;
          font-weight: 500;
        }

        .md-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          overflow-y: auto;
          padding-bottom: 8px;
        }

        .md-member {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .md-member__avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .md-member__avatar {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: linear-gradient(
            135deg,
            rgba(56, 100, 255, 0.4),
            rgba(100, 60, 255, 0.35)
          );
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .md-member__online {
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid var(--bg-card);
        }

        .md-member__info {
          flex: 1;
        }

        .md-member__name {
          font-size: 14px;
          font-weight: 700;
          color: white;
        }

        .md-member__status {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.45);
          margin-top: 2px;
        }

        .md-close {
          width: 100%;
          padding: 13px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          margin-top: 12px;
          -webkit-tap-highlight-color: transparent;
          transition: background 0.15s ease;
        }

        .md-close:active {
          background: rgba(255, 255, 255, 0.15);
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
