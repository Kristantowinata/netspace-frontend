"use client";

import React from "react";

interface InterestChipProps {
  emoji: string;
  label: string;
}

export default function InterestChip({ emoji, label }: InterestChipProps) {
  const style: React.CSSProperties = {
    fontSize: "11px",
    padding: "3px 9px",
    borderRadius: "50px",
    background: "rgba(56, 100, 255, 0.25)",
    border: "1px solid rgba(100, 140, 255, 0.35)",
    color: "#a8c4ff",
    fontWeight: 600,
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  };

  return (
    <span style={style}>
      {emoji} {label}
    </span>
  );
}
