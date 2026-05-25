"use client";

import React from "react";

interface StatusBadgeProps {
  label: string;
  variant?: "online" | "live";
}

export default function StatusBadge({ label, variant = "online" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3.5 py-[5px] rounded-full text-xs font-semibold text-admin-success border border-admin-success/20 ${
        variant === "live" ? "bg-admin-success/[0.12]" : "bg-admin-success/10"
      }`}
    >
      <span className="w-[7px] h-[7px] rounded-full bg-admin-success shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-admin-pulse-shadow" />
      {label}
    </span>
  );
}
