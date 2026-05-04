"use client";

import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  icon: string;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  icon,
  title,
  description,
  confirmLabel,
  cancelLabel = "Batal",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="confirm-backdrop" onClick={onCancel} />

      {/* Modal */}
      <div className="confirm-modal">
        <div className="confirm-modal__icon">{icon}</div>
        <h2 className="confirm-modal__title">{title}</h2>
        <p className="confirm-modal__desc">{description}</p>

        <div className="confirm-modal__actions">
          <button
            type="button"
            className="confirm-modal__btn confirm-modal__btn--cancel"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`confirm-modal__btn confirm-modal__btn--confirm ${
              variant === "danger" ? "confirm-modal__btn--danger" : ""
            }`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style jsx>{`
        .confirm-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 100;
          animation: fadeIn 0.2s ease;
        }

        .confirm-modal {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 390px;
          background: var(--bg-card);
          border-top: 1px solid var(--glass-border);
          border-radius: 24px 24px 0 0;
          padding: 28px 24px 36px;
          z-index: 101;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          animation: slideUp 0.25s ease;
        }

        .confirm-modal__icon {
          font-size: 40px;
          margin-bottom: 4px;
        }

        .confirm-modal__title {
          font-size: 18px;
          font-weight: 800;
          color: white;
          text-align: center;
        }

        .confirm-modal__desc {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.55);
          text-align: center;
          line-height: 1.6;
          max-width: 280px;
        }

        .confirm-modal__actions {
          display: flex;
          gap: 10px;
          width: 100%;
          margin-top: 12px;
        }

        .confirm-modal__btn {
          flex: 1;
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

        .confirm-modal__btn:active {
          transform: scale(0.97);
        }

        .confirm-modal__btn--cancel {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .confirm-modal__btn--confirm {
          background: var(--gradient-brand);
          color: white;
          box-shadow: 0 4px 18px rgba(56, 100, 255, 0.35);
        }

        .confirm-modal__btn--danger {
          background: linear-gradient(135deg, #dc2626, #ef4444);
          box-shadow: 0 4px 18px rgba(239, 68, 68, 0.35);
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
