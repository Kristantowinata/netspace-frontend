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
    <div
      className="fixed inset-0 z-[100] bg-[rgba(8,12,24,0.75)] backdrop-blur-[6px] flex items-center justify-center p-6 animate-admin-fadein"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[520px] bg-[rgba(15,20,40,0.95)] border border-white/[0.08] rounded-[18px] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)] animate-admin-pop"
        role="dialog"
        aria-modal="true"
        data-screen-label="Force Logout Modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-white mb-1.5">Force Logout User</h2>
        <p className="text-sm text-admin-text-body mb-4 leading-normal">
          Kamu akan mengeluarkan <strong>{userName}</strong> dari lokasi ini.
        </p>

        {/* Warning */}
        <div className="py-3 px-4 rounded-[10px] bg-amber-400/[0.07] border border-amber-400/25 text-admin-warning text-[13px] leading-normal mb-5">
          ⚠ Session user akan dihentikan dan seluruh chat history akan dihapus.
        </div>

        {/* Reason Selection */}
        <p className="text-xs font-semibold uppercase tracking-[0.05em] text-admin-text-muted mb-2.5">Pilih alasan</p>
        <div className="flex flex-col gap-1.5 mb-4">
          {REASONS.map((reason) => (
            <button
              key={reason}
              type="button"
              className={`flex items-center gap-3 py-3 px-4 rounded-[10px] font-[inherit] text-sm text-admin-text-body cursor-pointer transition-all duration-150 text-left ${
                selected === reason
                  ? "border border-admin-primary/30 bg-admin-primary/[0.06]"
                  : "border border-white/[0.08] bg-white/[0.03] hover:bg-white/5"
              }`}
              onClick={() => setSelected(reason)}
            >
              <span
                className={`w-4 h-4 rounded-full shrink-0 transition-all duration-150 ${
                  selected === reason
                    ? "border-2 border-admin-accent bg-admin-accent shadow-[inset_0_0_0_3px_rgba(15,20,40,0.95)]"
                    : "border-2 border-white/20"
                }`}
              />
              {reason}
            </button>
          ))}
        </div>

        {/* Custom Reason Textarea */}
        {isLainnya && (
          <textarea
            className="w-full py-2.5 px-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-white font-[inherit] text-[13px] resize-y outline-none mb-4 transition-[border-color] duration-150 placeholder:text-admin-text-muted focus:border-admin-accent"
            rows={3}
            placeholder="Tulis alasan..."
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            autoFocus
          />
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg font-[inherit] text-[13px] font-semibold cursor-pointer transition-all duration-200 outline-none bg-transparent text-admin-text-body border border-white/15 hover:bg-white/5 hover:-translate-y-px active:translate-y-0"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg font-[inherit] text-[13px] font-semibold cursor-pointer transition-all duration-200 outline-none border-none bg-[linear-gradient(135deg,#ef4444,#b91c1c)] text-white shadow-[0_6px_18px_rgba(239,68,68,0.3)] hover:shadow-[0_8px_24px_rgba(239,68,68,0.45)] hover:-translate-y-px active:translate-y-0 disabled:bg-none disabled:bg-[#7a2929] disabled:text-white/50 disabled:border disabled:border-red-400/25 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
            disabled={!canConfirm}
            onClick={() => canConfirm && onConfirm(finalReason)}
          >
            Force Logout
          </button>
        </div>
      </div>
    </div>
  );
}
