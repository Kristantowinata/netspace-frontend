"use client";

import React from "react";

interface GenderSelectorProps {
  value: string | null;
  onChange: (gender: string) => void;
}

const OPTIONS = [
  { key: "male", label: "Laki – Laki" },
  { key: "female", label: "Perempuan" },
];

export default function GenderSelector({
  value,
  onChange,
}: GenderSelectorProps) {
  return (
    <div className="gender-selector">
      <span className="gender-selector__label">Jenis Kelamin</span>

      <div className="gender-selector__options">
        {OPTIONS.map((opt) => {
          const isActive = value === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onChange(opt.key)}
              className="gender-selector__btn"
              style={
                isActive
                  ? {
                      background: "linear-gradient(135deg, #4338ca, #6366f1, #5082FF)",
                      color: "var(--text-primary)",
                      borderColor: "transparent",
                      boxShadow: "0 4px 20px rgba(80, 130, 255, 0.3)",
                    }
                  : undefined
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .gender-selector {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .gender-selector__label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .gender-selector__options {
          display: flex;
          gap: 10px;
        }

        .gender-selector__btn {
          flex: 1;
          padding: 14px 16px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.25s ease;
          -webkit-tap-highlight-color: transparent;
          background: var(--glass-bg);
          color: var(--text-secondary);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }
      `}</style>
    </div>
  );
}
