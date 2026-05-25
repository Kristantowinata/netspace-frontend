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
    <div className="relative max-w-[280px] w-full max-[900px]:max-w-full">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] pointer-events-none">🔍</span>
      <input
        type="text"
        className="w-full py-2.5 pr-3.5 pl-9 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white font-[inherit] text-[13px] outline-none transition-[border-color,background] duration-150 placeholder:text-admin-text-muted focus:border-admin-accent focus:bg-white/[0.06]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
