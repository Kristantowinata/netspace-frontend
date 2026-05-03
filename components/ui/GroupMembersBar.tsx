"use client";

import React from "react";

interface GroupMember {
  id: string;
  name: string;
  emoji: string;
  isHost: boolean;
}

interface GroupMembersBarProps {
  members: GroupMember[];
  onInvite: () => void;
  onLeave: () => void;
}

export default function GroupMembersBar({
  members,
  onInvite,
  onLeave,
}: GroupMembersBarProps) {
  return (
    <div className="gmb">
      {/* Label */}
      <p className="gmb__label">ANGGOTA</p>

      {/* Members row */}
      <div className="gmb__row hide-scrollbar">
        <div className="gmb__list">
          {members.map((m) => (
            <div key={m.id} className="gmb__member">
              <div className="gmb__avatar">{m.emoji}</div>
              <span className="gmb__name">{m.name}</span>
              {m.isHost && <span className="gmb__host-badge">Host</span>}
            </div>
          ))}

          {/* Invite button */}
          <div className="gmb__member">
            <button
              type="button"
              className="gmb__invite"
              onClick={onInvite}
              aria-label="Invite member"
            >
              +
            </button>
            <span className="gmb__name gmb__name--muted">Invite</span>
          </div>
        </div>

        {/* Leave button */}
        <button
          type="button"
          className="gmb__leave"
          onClick={onLeave}
        >
          Keluar
        </button>
      </div>

      <style jsx>{`
        .gmb {
          padding: 10px 18px 14px;
          position: relative;
          z-index: 1;
        }

        .gmb__label {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.5px;
          margin-bottom: 10px;
        }

        .gmb__row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          overflow-x: auto;
        }

        .gmb__list {
          display: flex;
          gap: 16px;
          flex: 1;
        }

        .gmb__member {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 52px;
        }

        .gmb__avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            rgba(56, 100, 255, 0.5),
            rgba(100, 60, 255, 0.4)
          );
          border: 2px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .gmb__name {
          font-size: 11px;
          color: white;
          font-weight: 500;
        }

        .gmb__name--muted {
          color: rgba(255, 255, 255, 0.4);
        }

        .gmb__host-badge {
          font-size: 9px;
          font-weight: 700;
          color: white;
          background: #22c55e;
          padding: 1px 8px;
          border-radius: 50px;
        }

        .gmb__invite {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: transparent;
          border: 2px dashed rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.4);
          font-size: 22px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          -webkit-tap-highlight-color: transparent;
          transition: border-color 0.15s ease;
        }

        .gmb__invite:active {
          border-color: rgba(255, 255, 255, 0.4);
        }

        .gmb__leave {
          background: rgba(122, 31, 46, 0.4);
          border: 1px solid rgba(255, 107, 107, 0.3);
          color: #ff6b6b;
          font-size: 13px;
          font-weight: 700;
          font-family: inherit;
          padding: 8px 16px;
          border-radius: 12px;
          cursor: pointer;
          white-space: nowrap;
          align-self: center;
          -webkit-tap-highlight-color: transparent;
          transition: background 0.15s ease;
        }

        .gmb__leave:active {
          background: rgba(122, 31, 46, 0.6);
        }
      `}</style>
    </div>
  );
}
