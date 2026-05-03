"use client";

import React from "react";
import InterestChip from "./InterestChip";

interface Interest {
  emoji: string;
  label: string;
}

interface UserCardProps {
  name: string;
  emoji: string;
  interests: Interest[];
  onChat: () => void;
  onTap: () => void;
}

export default function UserCard({
  name,
  emoji,
  interests,
  onChat,
  onTap,
}: UserCardProps) {
  return (
    <div
      className="user-card glass-strong"
      onClick={onTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onTap();
      }}
    >
      {/* Avatar */}
      <div className="user-card__avatar">{emoji}</div>

      {/* Info */}
      <div className="user-card__info">
        <p className="user-card__name">{name}</p>
        <div className="user-card__chips">
          {interests.slice(0, 3).map((interest) => (
            <InterestChip
              key={interest.label}
              emoji={interest.emoji}
              label={interest.label}
            />
          ))}
        </div>
      </div>

      {/* Chat button */}
      <button
        type="button"
        className="user-card__chat-btn"
        onClick={(e) => {
          e.stopPropagation();
          onChat();
        }}
      >
        Chat
      </button>

      <style jsx>{`
        .user-card {
          border-radius: 18px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .user-card:active {
          transform: scale(0.98);
        }

        .user-card__avatar {
          width: 50px;
          height: 50px;
          border-radius: 16px;
          background: linear-gradient(
            135deg,
            rgba(56, 100, 255, 0.35),
            rgba(100, 60, 255, 0.35)
          );
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          flex-shrink: 0;
        }

        .user-card__info {
          flex: 1;
          min-width: 0;
        }

        .user-card__name {
          font-size: 15px;
          font-weight: 700;
          color: white;
        }

        .user-card__chips {
          display: flex;
          gap: 6px;
          margin-top: 5px;
          flex-wrap: wrap;
        }

        .user-card__chat-btn {
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

        .user-card__chat-btn:active {
          transform: scale(0.95);
        }

        .user-card__chat-btn:hover {
          box-shadow: 0 4px 18px rgba(56, 100, 255, 0.55);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
