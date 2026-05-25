"use client";

import React from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Cari...",
}: SearchInputProps) {
  return (
    <div className="search-input">
      <span className="search-input__icon">🔍</span>
      <input
        type="text"
        className="search-input__field"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <style jsx>{`
        .search-input {
          position: relative;
          max-width: 280px;
          width: 100%;
        }

        .search-input__icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 13px;
          pointer-events: none;
        }

        .search-input__field {
          width: 100%;
          padding: 10px 14px 10px 36px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--admin-text, #fff);
          font-family: inherit;
          font-size: 13px;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
        }

        .search-input__field::placeholder {
          color: var(--admin-text-muted, #94A3B8);
        }

        .search-input__field:focus {
          border-color: var(--admin-accent, #7aa8ff);
          background: rgba(255, 255, 255, 0.06);
        }

        @media (max-width: 900px) {
          .search-input {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
