"use client";

import React from "react";

interface MetricCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaType: "up" | "down" | "live";
}

export default function MetricCard({ label, value, delta, deltaType }: MetricCardProps) {
  const deltaColor = deltaType === "down" ? "text-admin-danger" : "text-admin-success";

  return (
    <div className="flex flex-col gap-1.5 py-5 px-[22px] bg-white/5 backdrop-blur-[20px] border border-white/[0.08] rounded-xl">
      <span className="text-xs font-medium text-admin-text-muted">{label}</span>
      <span className="text-[28px] font-extrabold text-white tracking-tight">{value}</span>
      {delta && (
        <span className={`inline-flex items-center gap-[5px] text-xs font-semibold ${deltaColor}`}>
          {deltaType === "live" && (
            <span className="w-[7px] h-[7px] rounded-full bg-admin-success shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-admin-pulse" />
          )}
          {delta}
        </span>
      )}
    </div>
  );
}
