"use client";

import React from "react";

interface InterestTagProps {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function InterestTag({
  emoji,
  label,
  selected,
  onClick,
}: InterestTagProps) {
  const baseStyle: React.CSSProperties = {
    padding: "9px 16px",
    borderRadius: "50px",
    fontSize: "13px",
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "all 0.25s ease",
    WebkitTapHighlightColor: "transparent",
  };

  const stateStyle: React.CSSProperties = selected
    ? {
        background:
          "linear-gradient(135deg, rgba(56, 100, 255, 0.6), rgba(100, 60, 255, 0.5))",
        border: "1px solid rgba(100, 140, 255, 0.55)",
        color: "white",
        fontWeight: 700,
        boxShadow: "0 2px 14px rgba(56, 100, 255, 0.35)",
      }
    : {
        background: "rgba(255, 255, 255, 0.08)",
        border: "1px solid rgba(255, 255, 255, 0.13)",
        color: "rgba(255, 255, 255, 0.65)",
        fontWeight: 500,
        boxShadow: "none",
      };

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ ...baseStyle, ...stateStyle }}
    >
      {emoji} {label}
    </button>
  );
}
