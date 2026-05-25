"use client";

import React from "react";

interface MetricCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaType: "up" | "down" | "live";
}

export default function MetricCard({ label, value, delta, deltaType }: MetricCardProps) {
  return (
    <div className="metric-card">
      <span className="metric-card__label">{label}</span>
      <span className="metric-card__value">{value}</span>
      {delta && (
        <span className={`metric-card__delta metric-card__delta--${deltaType}`}>
          {deltaType === "live" && <span className="metric-card__dot" />}
          {delta}
        </span>
      )}

      <style jsx>{`
        .metric-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 20px 22px;
          background: var(--admin-card, rgba(255,255,255,0.05));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--admin-card-border, rgba(255,255,255,0.08));
          border-radius: var(--admin-radius, 12px);
        }

        .metric-card__label {
          font-size: 12px;
          font-weight: 500;
          color: var(--admin-text-muted, #94A3B8);
        }

        .metric-card__value {
          font-size: 28px;
          font-weight: 800;
          color: var(--admin-text, #fff);
          letter-spacing: -0.02em;
        }

        .metric-card__delta {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 600;
        }

        .metric-card__delta--up {
          color: var(--admin-success, #34D399);
        }

        .metric-card__delta--down {
          color: var(--admin-danger, #F87171);
        }

        .metric-card__delta--live {
          color: var(--admin-success, #34D399);
        }

        .metric-card__dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--admin-success, #34D399);
          box-shadow: 0 0 8px rgba(52, 211, 153, 0.6);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
