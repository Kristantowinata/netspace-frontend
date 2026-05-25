"use client";

import React from "react";
import StatusBadge from "@/components/admin/StatusBadge";

interface AdminTopbarProps {
  locationName: string;
  locationAvatar: string;
}

export default function AdminTopbar({ locationName, locationAvatar }: AdminTopbarProps) {
  const today = new Date();
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const dateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-8 h-[60px] bg-[rgba(8,12,24,0.5)] backdrop-blur-[24px] border-b border-white/[0.04]">
      <div className="flex items-center gap-4">
        <StatusBadge label="System Online" />
        <span className="text-xs text-admin-text-muted pl-4 border-l border-white/[0.08]">{dateStr}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end gap-px">
          <span className="text-[13px] font-bold text-white">{locationName}</span>
          <span className="text-[11px] text-admin-text-muted">Partner · Pro Plan</span>
        </div>
        <div className="w-9 h-9 rounded-[10px] bg-[linear-gradient(135deg,rgba(79,110,255,0.2),rgba(122,80,255,0.15))] border border-admin-primary/20 flex items-center justify-center text-lg">
          {locationAvatar}
        </div>
      </div>
    </header>
  );
}
