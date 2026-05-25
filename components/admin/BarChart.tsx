"use client";

import React from "react";

interface BarChartProps {
  data: { label: string; value: number }[];
  title: string;
}

export default function BarChart({ data, title }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-white/[0.035] backdrop-blur-[20px] border border-white/[0.06] rounded-xl p-6">
      <h3 className="text-sm font-bold text-white mb-5">{title}</h3>
      <div className="flex items-end gap-2 h-[180px]">
        {data.map((item, i) => {
          const height = (item.value / max) * 100;
          const isPeak = item.value === max;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <span className="text-[11px] font-bold text-admin-text-body">{item.value}</span>
              <div
                className={`w-full max-w-9 rounded-t-md rounded-b-[2px] animate-admin-grow-up ${
                  isPeak
                    ? "bg-[linear-gradient(180deg,rgba(79,110,255,0.9),rgba(43,63,168,0.7))] shadow-[0_0_16px_rgba(79,110,255,0.4)]"
                    : "bg-[linear-gradient(180deg,rgba(79,110,255,0.7),rgba(43,63,168,0.5))]"
                }`}
                style={{ height: `${height}%`, animationDelay: `${i * 60}ms` }}
              />
              <span className="text-[11px] text-admin-text-muted whitespace-nowrap">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
