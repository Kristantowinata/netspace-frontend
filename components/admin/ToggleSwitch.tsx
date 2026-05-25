"use client";

import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  activeLabel?: string;
  inactiveLabel?: string;
}

export default function ToggleSwitch({
  checked,
  onChange,
  activeLabel = "Aktif",
  inactiveLabel = "Nonaktif",
}: ToggleSwitchProps) {
  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className={`relative w-11 h-6 rounded-full shrink-0 transition-all duration-200 ${
          checked
            ? "bg-admin-primary/40 border border-admin-primary/50"
            : "bg-transparent border border-white/15"
        }`}
      >
        <span
          className={`absolute top-[2px] w-[18px] h-[18px] rounded-full transition-all duration-200 ${
            checked
              ? "left-[22px] bg-admin-accent shadow-[0_0_10px_rgba(122,168,255,0.5)]"
              : "left-[3px] bg-admin-text-muted"
          }`}
        />
      </span>
      <span className="text-[13px] text-admin-text-body">
        {checked ? activeLabel : inactiveLabel}
      </span>
    </label>
  );
}
