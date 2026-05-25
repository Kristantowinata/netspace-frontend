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
    <header className="topbar">
      <div className="topbar__left">
        <StatusBadge label="System Online" />
        <span className="topbar__date">{dateStr}</span>
      </div>

      <div className="topbar__right">
        <div className="topbar__info">
          <span className="topbar__name">{locationName}</span>
          <span className="topbar__role">Partner · Pro Plan</span>
        </div>
        <div className="topbar__avatar">{locationAvatar}</div>
      </div>

      <style jsx>{`
        .topbar {
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          height: 60px;
          background: rgba(8, 12, 24, 0.5);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .topbar__left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .topbar__date {
          font-size: 12px;
          color: var(--admin-text-muted, #94A3B8);
          padding-left: 16px;
          border-left: 1px solid rgba(255, 255, 255, 0.08);
        }

        .topbar__right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .topbar__info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1px;
        }

        .topbar__name {
          font-size: 13px;
          font-weight: 700;
          color: var(--admin-text, #fff);
        }

        .topbar__role {
          font-size: 11px;
          color: var(--admin-text-muted, #94A3B8);
        }

        .topbar__avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(79, 110, 255, 0.2), rgba(122, 80, 255, 0.15));
          border: 1px solid rgba(79, 110, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
      `}</style>
    </header>
  );
}
