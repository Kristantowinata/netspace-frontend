"use client";

import React from "react";

interface InterestRankListProps {
  items: { emoji: string; label: string; percentage: number }[];
  title: string;
}

export default function InterestRankList({ items, title }: InterestRankListProps) {
  return (
    <div className="bg-white/[0.035] backdrop-blur-[20px] border border-white/[0.06] rounded-xl p-6">
      <h3 className="text-sm font-bold text-white mb-5">{title}</h3>
      <div className="flex flex-col gap-4">
        {items.map((item, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] font-semibold text-admin-text-body">
                {item.emoji} {item.label}
              </span>
              <span className="text-[13px] font-bold text-admin-accent">{item.percentage}%</span>
            </div>
            <div className="h-1.5 rounded-[3px] bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-[3px] bg-[linear-gradient(90deg,#4F6EFF,#7aa8ff)] transition-[width] duration-[600ms] ease-out"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
