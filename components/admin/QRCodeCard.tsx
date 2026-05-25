"use client";

import React from "react";

interface QRCodeCardProps {
  token: string;
  label: string;
  onDownload?: () => void;
}

export default function QRCodeCard({ token, label, onDownload }: QRCodeCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 bg-white/[0.035] backdrop-blur-[20px] border border-white/[0.06] rounded-xl p-6">
      {/* QR Code Frame */}
      <div className="w-[240px] h-[240px] bg-white rounded-xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          aria-label="QR placeholder"
        >
          {/* Finder patterns (top-left, top-right, bottom-left) */}
          <rect x="10" y="10" width="50" height="50" rx="4" fill="#222" />
          <rect x="16" y="16" width="38" height="38" rx="2" fill="#fff" />
          <rect x="24" y="24" width="22" height="22" rx="2" fill="#222" />

          <rect x="140" y="10" width="50" height="50" rx="4" fill="#222" />
          <rect x="146" y="16" width="38" height="38" rx="2" fill="#fff" />
          <rect x="154" y="24" width="22" height="22" rx="2" fill="#222" />

          <rect x="10" y="140" width="50" height="50" rx="4" fill="#222" />
          <rect x="16" y="146" width="38" height="38" rx="2" fill="#fff" />
          <rect x="24" y="154" width="22" height="22" rx="2" fill="#222" />

          {/* Data modules (decorative) */}
          {[70, 80, 90, 100, 110, 120].map((x) =>
            [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170].map((y) => (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="8"
                height="8"
                rx="1"
                fill={(x + y) % 30 < 15 ? "#222" : "transparent"}
              />
            ))
          )}
          {[10, 20, 30, 40, 50].map((x) =>
            [70, 80, 90, 100, 110, 120].map((y) => (
              <rect
                key={`b-${x}-${y}`}
                x={x}
                y={y}
                width="8"
                height="8"
                rx="1"
                fill={(x * y) % 20 < 10 ? "#222" : "transparent"}
              />
            ))
          )}
          {[140, 150, 160, 170].map((x) =>
            [70, 80, 90, 100, 110, 120].map((y) => (
              <rect
                key={`c-${x}-${y}`}
                x={x}
                y={y}
                width="8"
                height="8"
                rx="1"
                fill={(x + y) % 25 < 12 ? "#222" : "transparent"}
              />
            ))
          )}
          {[70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170].map((x) =>
            [150, 160, 170].map((y) => (
              <rect
                key={`d-${x}-${y}`}
                x={x}
                y={y}
                width="8"
                height="8"
                rx="1"
                fill={(x * 3 + y) % 20 < 10 ? "#222" : "transparent"}
              />
            ))
          )}
        </svg>
      </div>

      {/* Label */}
      <p className="text-sm font-semibold text-white text-center">{label}</p>

      {/* Token */}
      <p className="text-[13px] text-admin-text-muted">
        Token: <code className="font-mono text-admin-accent bg-admin-accent/10 px-2 py-[3px] rounded text-[13px]">{token}</code>
      </p>

      {/* Download Button */}
      <button
        type="button"
        className="inline-flex items-center justify-center gap-1.5 w-full mt-1 px-5 py-2.5 rounded-lg font-[inherit] text-[13px] font-semibold cursor-pointer transition-all duration-200 outline-none bg-transparent text-admin-text-body border border-white/[0.12] hover:border-white/25 hover:text-white hover:-translate-y-px active:translate-y-0"
        onClick={onDownload}
      >
        ⬇ Download QR
      </button>
    </div>
  );
}
