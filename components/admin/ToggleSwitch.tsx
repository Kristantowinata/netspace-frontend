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
    <label className="toggle-switch">
      <input
        type="checkbox"
        className="toggle-switch__input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={`toggle-switch__track ${checked ? "toggle-switch__track--on" : ""}`}>
        <span className="toggle-switch__knob" />
      </span>
      <span className="toggle-switch__label">
        {checked ? activeLabel : inactiveLabel}
      </span>

      <style jsx>{`
        .toggle-switch {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .toggle-switch__input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-switch__track {
          position: relative;
          width: 44px;
          height: 24px;
          border-radius: 12px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .toggle-switch__track--on {
          background: rgba(79, 110, 255, 0.4);
          border-color: rgba(79, 110, 255, 0.5);
        }

        .toggle-switch__knob {
          position: absolute;
          top: 2px;
          left: 3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--admin-text-muted, #94A3B8);
          transition: all 0.2s ease;
        }

        .toggle-switch__track--on .toggle-switch__knob {
          left: 22px;
          background: var(--admin-accent, #7aa8ff);
          box-shadow: 0 0 10px rgba(122, 168, 255, 0.5);
        }

        .toggle-switch__label {
          font-size: 13px;
          color: var(--admin-text-body, #CBD5E1);
        }
      `}</style>
    </label>
  );
}
