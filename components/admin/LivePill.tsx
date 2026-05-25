"use client";

import React from "react";

interface LivePillProps {
  count: number;
  label?: string;
}

export default function LivePill({ count, label = "users online" }: LivePillProps) {
  return (
    <span className="live-pill">
      <span className="live-pill__dot" />
      {count} {label}

      <style jsx>{`
        .live-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          background: rgba(52, 211, 153, 0.1);
          color: var(--admin-success, #34D399);
          border: 1px solid rgba(52, 211, 153, 0.2);
        }

        .live-pill__dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--admin-success, #34D399);
          box-shadow: 0 0 8px rgba(52, 211, 153, 0.6);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(52, 211, 153, 0.6); }
          50% { opacity: 0.5; box-shadow: 0 0 4px rgba(52, 211, 153, 0.3); }
        }
      `}</style>
    </span>
  );
}
