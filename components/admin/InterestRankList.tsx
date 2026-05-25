"use client";

import React from "react";

interface InterestRankListProps {
  items: { emoji: string; label: string; percentage: number }[];
  title: string;
}

export default function InterestRankList({ items, title }: InterestRankListProps) {
  return (
    <div className="interest-rank admin-card">
      <h3 className="interest-rank__title">{title}</h3>
      <div className="interest-rank__list">
        {items.map((item, i) => (
          <div key={i} className="interest-rank__item">
            <div className="interest-rank__row">
              <span className="interest-rank__label">
                {item.emoji} {item.label}
              </span>
              <span className="interest-rank__pct">{item.percentage}%</span>
            </div>
            <div className="interest-rank__track">
              <div
                className="interest-rank__fill"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .interest-rank__title {
          font-size: 14px;
          font-weight: 700;
          color: var(--admin-text, #fff);
          margin-bottom: 20px;
        }

        .interest-rank__list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .interest-rank__row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .interest-rank__label {
          font-size: 13px;
          font-weight: 600;
          color: var(--admin-text-body, #CBD5E1);
        }

        .interest-rank__pct {
          font-size: 13px;
          font-weight: 700;
          color: var(--admin-accent, #7aa8ff);
        }

        .interest-rank__track {
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.06);
          overflow: hidden;
        }

        .interest-rank__fill {
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, #4F6EFF, #7aa8ff);
          transition: width 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
