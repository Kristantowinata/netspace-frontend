"use client";

import React from "react";

interface GroupChatHeaderProps {
  groupName: string;
  groupEmoji: string;
  memberCount: number;
  onBack: () => void;
  onRename?: () => void;
}

export default function GroupChatHeader({
  groupName,
  groupEmoji,
  memberCount,
  onBack,
  onRename,
}: GroupChatHeaderProps) {
  return (
    <div className="gc-header glass-strong">
      <div className="gc-header__inner">
        {/* Back */}
        <button
          type="button"
          className="gc-header__back"
          onClick={onBack}
          aria-label="Go back"
        >
          ←
        </button>

        {/* Avatar */}
        <div className="gc-header__avatar-wrap">
          <div className="gc-header__avatar">{groupEmoji}</div>
          <div className="gc-header__online" />
        </div>

        {/* Info — tap the name to rename the group */}
        <button
          type="button"
          className="gc-header__info"
          onClick={onRename}
          disabled={!onRename}
          aria-label="Ganti nama grup"
        >
          <p className="gc-header__name">
            {groupName}
            {onRename && <span className="gc-header__edit">✎</span>}
          </p>
          <p className="gc-header__subtitle">
            Group Session · {memberCount} anggota
          </p>
        </button>
      </div>

      <style jsx>{`
        .gc-header {
          padding: 14px 18px 12px;
          position: relative;
          z-index: 2;
        }

        .gc-header__inner {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gc-header__back {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 20px;
          padding: 0 4px;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .gc-header__avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .gc-header__avatar {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          background: linear-gradient(135deg, #3864ff, #6438ff);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .gc-header__online {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid var(--bg-primary);
        }

        .gc-header__info {
          flex: 1;
          min-width: 0;
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          text-align: left;
          font-family: inherit;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .gc-header__info:disabled {
          cursor: default;
        }

        .gc-header__name {
          font-size: 15px;
          font-weight: 800;
          color: white;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .gc-header__edit {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
        }

        .gc-header__subtitle {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 1px;
        }
      `}</style>
    </div>
  );
}
