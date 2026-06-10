"use client";

import React from "react";
import ToggleSwitch from "@/components/admin/ToggleSwitch";

interface LocationInfoCardProps {
  name: string;
  address: string;
  partnerId: string;
  joinedDate: string;
  capacity: string;
  timezone: string;
  isActive: boolean;
  onToggleActive: (active: boolean) => void;
  // When true, the check-in toggle is locked (demo) so a visitor can't disable
  // the venue and break the demo for everyone.
  locked?: boolean;
}

export default function LocationInfoCard({
  name,
  address,
  partnerId,
  joinedDate,
  capacity,
  timezone,
  isActive,
  onToggleActive,
  locked = false,
}: LocationInfoCardProps) {
  const infoItems = [
    { label: "Partner ID", value: partnerId },
    { label: "Bergabung", value: joinedDate },
    { label: "Kapasitas", value: capacity },
    { label: "Zona Waktu", value: timezone },
  ];

  return (
    <div className="flex flex-col gap-4 bg-white/[0.035] backdrop-blur-[20px] border border-white/[0.06] rounded-xl p-6">
      {/* Title */}
      <h2 className="text-lg font-bold text-white">{name}</h2>
      <p className="text-[13px] text-admin-text-muted -mt-2">📍 {address}</p>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-2">
        {infoItems.map((item, i) => (
          <div key={i} className="flex flex-col gap-1 py-3 px-3.5 rounded-[10px] bg-white/[0.03]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-admin-text-muted">
              {item.label}
            </span>
            <span className="text-sm font-semibold text-admin-text-body">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Status Row */}
      <div className="flex items-center gap-4 pt-2 border-t border-white/[0.08]">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            isActive
              ? "bg-admin-success/[0.12] text-admin-success border border-admin-success/25"
              : "bg-admin-danger/[0.12] text-admin-danger border border-admin-danger/25"
          }`}
        >
          {isActive ? "Aktif" : "Nonaktif"}
        </span>
        {locked ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-admin-text-muted">
            🔒 Dikunci di mode demo
          </span>
        ) : (
          <ToggleSwitch
            checked={isActive}
            onChange={onToggleActive}
            activeLabel="Lokasi aktif untuk check-in"
            inactiveLabel="Lokasi tidak menerima check-in"
          />
        )}
      </div>
    </div>
  );
}
