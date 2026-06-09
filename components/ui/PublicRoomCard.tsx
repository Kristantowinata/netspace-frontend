"use client";

import React from "react";

interface PublicRoomCardProps {
  onJoin: () => void;
  // Number of public-room messages that arrived while the user wasn't in the
  // room. 0 hides the badge.
  unreadCount?: number;
}

export default function PublicRoomCard({
  onJoin,
  unreadCount = 0,
}: PublicRoomCardProps) {
  const hasUnread = unreadCount > 0;
  const badgeLabel = unreadCount > 9 ? "9+" : String(unreadCount);

  return (
    <div className="public-room-card">
      {/* Icon */}
      <div className="public-room-card__icon">
        💬
        {hasUnread && (
          <span className="public-room-card__badge" aria-label={`${unreadCount} pesan baru`}>
            {badgeLabel}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="public-room-card__info">
        <p className="public-room-card__title">Public Room</p>
        <p
          className={`public-room-card__subtitle ${
            hasUnread ? "public-room-card__subtitle--unread" : ""
          }`}
        >
          {hasUnread
            ? `${unreadCount} pesan baru`
            : "Chat dengan semua orang di sini"}
        </p>
      </div>

      {/* Join button */}
      <button
        type="button"
        className="public-room-card__btn"
        onClick={onJoin}
      >
        Gabung
      </button>

      <style jsx>{`
        .public-room-card {
          background: var(--glass-bg-strong);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(100, 200, 255, 0.25);
          border-radius: 18px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .public-room-card__icon {
          width: 50px;
          height: 50px;
          border-radius: 16px;
          background: linear-gradient(
            135deg,
            rgba(0, 180, 255, 0.3),
            rgba(56, 100, 255, 0.3)
          );
          border: 1px solid rgba(100, 200, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          flex-shrink: 0;
          position: relative;
        }

        .public-room-card__badge {
          position: absolute;
          top: -5px;
          right: -5px;
          min-width: 20px;
          height: 20px;
          padding: 0 5px;
          border-radius: 10px;
          background: #ff3b5c;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          line-height: 20px;
          text-align: center;
          border: 2px solid var(--bg-primary, #111953);
          box-shadow: 0 2px 8px rgba(255, 59, 92, 0.5);
        }

        .public-room-card__info {
          flex: 1;
          min-width: 0;
        }

        .public-room-card__title {
          font-size: 15px;
          font-weight: 700;
          color: white;
        }

        .public-room-card__subtitle {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 2px;
        }

        .public-room-card__subtitle--unread {
          color: #6ac8ff;
          font-weight: 700;
        }

        .public-room-card__btn {
          padding: 9px 16px;
          border-radius: 12px;
          background: linear-gradient(135deg, #3864ff, #6438ff);
          color: white;
          font-size: 13px;
          font-weight: 700;
          border: none;
          box-shadow: 0 2px 12px rgba(56, 100, 255, 0.4);
          cursor: pointer;
          font-family: inherit;
          flex-shrink: 0;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .public-room-card__btn:active {
          transform: scale(0.95);
        }

        .public-room-card__btn:hover {
          box-shadow: 0 4px 18px rgba(56, 100, 255, 0.55);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
