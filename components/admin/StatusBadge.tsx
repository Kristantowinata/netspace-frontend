"use client";

import React from "react";

interface StatusBadgeProps {
  label: string;
  variant?: "online" | "live";
}

export default function StatusBadge({ label, variant = "online" }: StatusBadgeProps) {
  return (
    <span className="status-badge">
      <span className="status-badge__dot" />
      {label}

      <style jsx>{`
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          background: ${variant === "live"
            ? "rgba(52, 211, 153, 0.12)"
            : "rgba(52, 211, 153, 0.1)"};
          color: var(--admin-success, #34D399);
          border: 1px solid rgba(52, 211, 153, 0.2);
        }

        .status-badge__dot {
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
