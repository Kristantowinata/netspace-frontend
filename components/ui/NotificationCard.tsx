"use client";

import React from "react";

interface NotificationCardProps {
  emoji: string;
  avatarGradient: string;
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
}

export default function NotificationCard({
  emoji,
  avatarGradient,
  title,
  description,
  timestamp,
  unread,
  onPrimaryAction,
  onSecondaryAction,
  primaryLabel,
  secondaryLabel,
}: NotificationCardProps) {
  const hasActions = !!primaryLabel && !!secondaryLabel;

  return (
    <div className={`notif-card ${unread ? "notif-card--unread" : ""}`}>
      <div className="notif-card__row">
        {/* Avatar */}
        <div className="notif-card__avatar" style={{ background: avatarGradient }}>
          {emoji}
          {unread && <div className="notif-card__dot" />}
        </div>

        {/* Body */}
        <div className="notif-card__body">
          <div className="notif-card__top">
            <span className="notif-card__title">{title}</span>
            <span className="notif-card__time">{timestamp}</span>
          </div>
          <p className="notif-card__desc">{description}</p>
        </div>
      </div>

      {/* Action buttons */}
      {hasActions && (
        <div className="notif-card__actions">
          <button
            type="button"
            className="notif-card__btn notif-card__btn--primary"
            onClick={onPrimaryAction}
          >
            {primaryLabel}
          </button>
          <button
            type="button"
            className="notif-card__btn notif-card__btn--secondary"
            onClick={onSecondaryAction}
          >
            {secondaryLabel}
          </button>
        </div>
      )}

      <style jsx>{`
        .notif-card {
          background: rgba(255, 255, 255, 0.055);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 0;
          transition: background 0.15s ease;
        }

        .notif-card--unread {
          background: rgba(56, 100, 255, 0.15);
          border-color: rgba(56, 100, 255, 0.25);
        }

        .notif-card__row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .notif-card__avatar {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          position: relative;
        }

        .notif-card__dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          background: #3864ff;
          border-radius: 50%;
          border: 2px solid var(--bg-primary);
        }

        .notif-card__body {
          flex: 1;
          min-width: 0;
        }

        .notif-card__top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 3px;
        }

        .notif-card__title {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
        }

        .notif-card__time {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          flex-shrink: 0;
          margin-left: 8px;
        }

        .notif-card__desc {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.55);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .notif-card__actions {
          display: flex;
          gap: 10px;
          margin-top: 12px;
        }

        .notif-card__btn {
          border: none;
          border-radius: 20px;
          padding: 7px 20px;
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition: opacity 0.15s ease;
        }

        .notif-card__btn:active {
          opacity: 0.7;
        }

        .notif-card__btn--primary {
          background: #3864ff;
          color: #fff;
        }

        .notif-card__btn--secondary {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </div>
  );
}
