"use client";

import React from "react";

interface InputProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
  inputMode?: "text" | "numeric";
  maxLength?: number;
  helperText?: string;
}

export default function Input({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  inputMode,
  maxLength,
  helperText,
}: InputProps) {
  return (
    <div className="input-field">
      <label htmlFor={id} className="input-field__label">
        {label}
      </label>

      <input
        id={id}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete="off"
        className="input-field__input glass-strong"
      />

      {helperText && (
        <p className="input-field__helper">{helperText}</p>
      )}

      <style jsx>{`
        .input-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-field__label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .input-field__input {
          width: 100%;
          border-radius: 16px;
          padding: 15px 16px;
          font-size: 16px;
          font-weight: 500;
          color: var(--text-primary);
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s ease;
        }

        .input-field__input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .input-field__input:focus {
          border-color: var(--accent-primary);
        }

        .input-field__helper {
          font-size: 11px;
          color: var(--text-secondary);
          opacity: 0.7;
        }

        /* Remove number input spinners */
        .input-field__input[type="number"]::-webkit-inner-spin-button,
        .input-field__input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .input-field__input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
