"use client";

import React, { useState, useEffect } from "react";

interface ForceLogoutModalProps {
  isOpen: boolean;
  userName: string;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

const REASONS = [
  "Perilaku tidak pantas",
  "Spam / flooding chat",
  "Pelanggaran aturan lokasi",
  "Lainnya",
];

export default function ForceLogoutModal({
  isOpen,
  userName,
  onConfirm,
  onClose,
}: ForceLogoutModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState("");

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setSelected(null);
      setCustomReason("");
    }
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isLainnya = selected === "Lainnya";
  const canConfirm = selected !== null && (!isLainnya || customReason.trim().length > 0);
  const finalReason = isLainnya ? customReason.trim() : selected || "";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        data-screen-label="Force Logout Modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal__title">Force Logout User</h2>
        <p className="modal__subtitle">
          Kamu akan mengeluarkan <strong>{userName}</strong> dari lokasi ini.
        </p>

        {/* Warning */}
        <div className="modal__warning">
          ⚠ Session user akan dihentikan dan seluruh chat history akan dihapus.
        </div>

        {/* Reason Selection */}
        <p className="modal__section-label">Pilih alasan</p>
        <div className="modal__reasons">
          {REASONS.map((reason) => (
            <button
              key={reason}
              type="button"
              className={`modal__reason ${selected === reason ? "modal__reason--selected" : ""}`}
              onClick={() => setSelected(reason)}
            >
              <span className={`modal__radio ${selected === reason ? "modal__radio--active" : ""}`} />
              {reason}
            </button>
          ))}
        </div>

        {/* Custom Reason Textarea */}
        {isLainnya && (
          <textarea
            className="modal__textarea"
            rows={3}
            placeholder="Tulis alasan..."
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            autoFocus
          />
        )}

        {/* Actions */}
        <div className="modal__actions">
          <button
            type="button"
            className="admin-btn admin-btn-ghost"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-danger-solid"
            disabled={!canConfirm}
            onClick={() => canConfirm && onConfirm(finalReason)}
          >
            Force Logout
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(8, 12, 24, 0.75);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadein 0.2s ease;
        }

        .modal {
          width: 100%;
          max-width: 520px;
          background: rgba(15, 20, 40, 0.95);
          border: 1px solid var(--admin-card-border, rgba(255,255,255,0.08));
          border-radius: 18px;
          padding: 32px;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
          animation: pop 0.25s ease;
        }

        .modal__title {
          font-size: 18px;
          font-weight: 700;
          color: var(--admin-text, #fff);
          margin-bottom: 6px;
        }

        .modal__subtitle {
          font-size: 14px;
          color: var(--admin-text-body, #CBD5E1);
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .modal__warning {
          padding: 12px 16px;
          border-radius: 10px;
          background: rgba(251, 191, 36, 0.07);
          border: 1px solid rgba(251, 191, 36, 0.25);
          color: var(--admin-warning, #FBBF24);
          font-size: 13px;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .modal__section-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--admin-text-muted, #94A3B8);
          margin-bottom: 10px;
        }

        .modal__reasons {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .modal__reason {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--admin-text-body, #CBD5E1);
          font-family: inherit;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }

        .modal__reason:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .modal__reason--selected {
          border-color: rgba(79, 110, 255, 0.3);
          background: rgba(79, 110, 255, 0.06);
        }

        .modal__radio {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.2);
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .modal__radio--active {
          border-color: var(--admin-accent, #7aa8ff);
          background: var(--admin-accent, #7aa8ff);
          box-shadow: inset 0 0 0 3px rgba(15, 20, 40, 0.95);
        }

        .modal__textarea {
          width: 100%;
          padding: 10px 14px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--admin-text, #fff);
          font-family: inherit;
          font-size: 13px;
          resize: vertical;
          outline: none;
          margin-bottom: 16px;
          transition: border-color 0.15s;
        }

        .modal__textarea::placeholder {
          color: var(--admin-text-muted, #94A3B8);
        }

        .modal__textarea:focus {
          border-color: var(--admin-accent, #7aa8ff);
        }

        .modal__actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        @keyframes fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pop {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
