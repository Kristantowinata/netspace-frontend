"use client";

import React from "react";

interface LivePillProps {
  count: number;
  label?: string;
}

export default function LivePill({ count, label = "users online" }: LivePillProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3.5 py-[5px] rounded-full text-xs font-semibold bg-admin-success/10 text-admin-success border border-admin-success/20">
      <span className="w-[7px] h-[7px] rounded-full bg-admin-success shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-admin-pulse-shadow" />
      {count} {label}
    </span>
  );
}
