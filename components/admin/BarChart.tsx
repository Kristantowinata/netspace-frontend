"use client";

import React from "react";

interface BarChartProps {
  data: { label: string; value: number }[];
  title: string;
}

export default function BarChart({ data, title }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="bar-chart admin-card">
      <h3 className="bar-chart__title">{title}</h3>
      <div className="bar-chart__container">
        {data.map((item, i) => {
          const height = (item.value / max) * 100;
          const isPeak = item.value === max;
          return (
            <div key={i} className="bar-chart__col">
              <span className="bar-chart__val">{item.value}</span>
              <div
                className={`bar-chart__bar ${isPeak ? "bar-chart__bar--peak" : ""}`}
                style={{ height: `${height}%`, animationDelay: `${i * 60}ms` }}
              />
              <span className="bar-chart__label">{item.label}</span>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .bar-chart__title {
          font-size: 14px;
          font-weight: 700;
          color: var(--admin-text, #fff);
          margin-bottom: 20px;
        }

        .bar-chart__container {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          height: 180px;
        }

        .bar-chart__col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          height: 100%;
          justify-content: flex-end;
        }

        .bar-chart__val {
          font-size: 11px;
          font-weight: 700;
          color: var(--admin-text-body, #CBD5E1);
        }

        .bar-chart__bar {
          width: 100%;
          max-width: 36px;
          border-radius: 6px 6px 2px 2px;
          background: linear-gradient(180deg, rgba(79, 110, 255, 0.7), rgba(43, 63, 168, 0.5));
          transform-origin: bottom;
          animation: growUp 0.5s ease-out forwards;
          transform: scaleY(0);
        }

        .bar-chart__bar--peak {
          background: linear-gradient(180deg, rgba(79, 110, 255, 0.9), rgba(43, 63, 168, 0.7));
          box-shadow: 0 0 16px rgba(79, 110, 255, 0.4);
        }

        .bar-chart__label {
          font-size: 11px;
          color: var(--admin-text-muted, #94A3B8);
          white-space: nowrap;
        }

        @keyframes growUp {
          to {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
}
