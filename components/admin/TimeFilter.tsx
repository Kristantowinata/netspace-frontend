"use client";

import React from "react";

interface TimeFilterProps {
  options: string[];
  active: string;
  onChange: (value: string) => void;
}

export default function TimeFilter({ options, active, onChange }: TimeFilterProps) {
  return (
    <div className="time-filter" role="tablist">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          role="tab"
          aria-selected={opt === active}
          className={`time-filter__btn ${opt === active ? "time-filter__btn--active" : ""}`}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}

      <style jsx>{`
        .time-filter {
          display: inline-flex;
          gap: 2px;
          padding: 4px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
        }

        .time-filter__btn {
          padding: 7px 18px;
          border-radius: 8px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid transparent;
          background: transparent;
          color: var(--admin-text-muted, #94A3B8);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .time-filter__btn:hover:not(.time-filter__btn--active) {
          color: var(--admin-text-body, #CBD5E1);
        }

        .time-filter__btn--active {
          background: rgba(79, 110, 255, 0.15);
          color: var(--admin-accent, #7aa8ff);
          border-color: rgba(79, 110, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
