"use client";

import React, { useState } from "react";

interface InviteUser {
  id: string;
  name: string;
  emoji: string;
}

interface InviteModalProps {
  isOpen: boolean;
  availableUsers: InviteUser[];
  onInvite: (userIds: string[]) => void;
  onClose: () => void;
}

export default function InviteModal({
  isOpen,
  availableUsers,
  onInvite,
  onClose,
}: InviteModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSend = () => {
    onInvite(Array.from(selected));
    setSelected(new Set());
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="inv-backdrop" onClick={onClose} />

      {/* Modal */}
      <div className="inv-modal">
        {/* Handle */}
        <div className="inv-handle" />

        <h2 className="inv-title">Undang ke Group</h2>
        <p className="inv-sub">Pilih orang yang ingin kamu undang</p>

        {/* User list */}
        <div className="inv-list hide-scrollbar">
          {availableUsers.length > 0 ? (
            availableUsers.map((u) => {
              const isSelected = selected.has(u.id);
              return (
                <button
                  key={u.id}
                  type="button"
                  className={`inv-user ${isSelected ? "inv-user--selected" : ""}`}
                  onClick={() => toggle(u.id)}
                >
                  <div className="inv-user__avatar">{u.emoji}</div>
                  <span className="inv-user__name">{u.name}</span>
                  <div className={`inv-user__check ${isSelected ? "inv-user__check--on" : ""}`}>
                    {isSelected && "✓"}
                  </div>
                </button>
              );
            })
          ) : (
            <p className="inv-empty">Tidak ada orang lain di lokasi ini</p>
          )}
        </div>

        {/* Actions */}
        <div className="inv-actions">
          <button
            type="button"
            className="inv-btn inv-btn--send"
            disabled={selected.size === 0}
            onClick={handleSend}
          >
            Undang {selected.size > 0 ? `(${selected.size})` : ""}
          </button>
          <button type="button" className="inv-btn inv-btn--cancel" onClick={onClose}>
            Batal
          </button>
        </div>
      </div>

      <style jsx>{`
        .inv-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 100;
          animation: fadeIn 0.2s ease;
        }

        .inv-modal {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 390px;
          max-height: 75vh;
          background: var(--bg-card);
          border-top: 1px solid var(--glass-border);
          border-radius: 24px 24px 0 0;
          padding: 12px 20px 32px;
          z-index: 101;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.25s ease;
        }

        .inv-handle {
          width: 40px;
          height: 4px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.2);
          margin: 0 auto 16px;
        }

        .inv-title {
          font-size: 18px;
          font-weight: 800;
          color: white;
        }

        .inv-sub {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 4px;
          margin-bottom: 14px;
        }

        .inv-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          overflow-y: auto;
          padding-bottom: 8px;
        }

        .inv-user {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.15s ease, background 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .inv-user--selected {
          background: rgba(56, 100, 255, 0.15);
          border-color: rgba(56, 100, 255, 0.4);
        }

        .inv-user__avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
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
          flex-shrink: 0;
        }

        .inv-user__name {
          flex: 1;
          font-size: 14px;
          font-weight: 700;
          color: white;
          text-align: left;
        }

        .inv-user__check {
          width: 24px;
          height: 24px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.08);
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: white;
          font-weight: 700;
          flex-shrink: 0;
          transition: background 0.15s ease, border-color 0.15s ease;
        }

        .inv-user__check--on {
          background: #3864ff;
          border-color: #5082ff;
        }

        .inv-empty {
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          font-size: 13px;
          padding: 24px;
        }

        .inv-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 12px;
        }

        .inv-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          border: none;
          transition: transform 0.15s ease, opacity 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .inv-btn:active {
          transform: scale(0.97);
        }

        .inv-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .inv-btn--send {
          background: var(--gradient-brand);
          color: white;
          box-shadow: 0 4px 18px rgba(56, 100, 255, 0.35);
        }

        .inv-btn--cancel {
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
