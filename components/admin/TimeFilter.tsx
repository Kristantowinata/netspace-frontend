"use client";

import React from "react";

interface TimeFilterProps {
  options: string[];
  active: string;
  onChange: (value: string) => void;
}

export default function TimeFilter({ options, active, onChange }: TimeFilterProps) {
  return (
    <div className="inline-flex gap-0.5 p-1 rounded-[10px] bg-white/[0.03]" role="tablist">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          role="tab"
          aria-selected={opt === active}
          className={`py-[7px] px-[18px] rounded-lg font-[inherit] text-[13px] font-semibold border cursor-pointer transition-all duration-150 ${
            opt === active
              ? "bg-admin-primary/15 text-admin-accent border-admin-primary/30"
              : "bg-transparent text-admin-text-muted border-transparent hover:text-admin-text-body"
          }`}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
