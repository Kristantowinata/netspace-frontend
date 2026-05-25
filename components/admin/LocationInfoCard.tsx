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
}: LocationInfoCardProps) {
  const infoItems = [
    { label: "Partner ID", value: partnerId },
    { label: "Bergabung", value: joinedDate },
    { label: "Kapasitas", value: capacity },
    { label: "Zona Waktu", value: timezone },
  ];

  return (
    <div className="loc-card admin-card">
      {/* Title */}
      <h2 className="loc-card__name">{name}</h2>
      <p className="loc-card__address">📍 {address}</p>

      {/* Info Grid */}
      <div className="loc-card__grid">
        {infoItems.map((item, i) => (
          <div key={i} className="loc-card__info">
            <span className="loc-card__info-label">{item.label}</span>
            <span className="loc-card__info-value">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Status Row */}
      <div className="loc-card__status">
        <span className={isActive ? "admin-badge admin-badge-active" : "admin-badge admin-badge-inactive"}>
          {isActive ? "Aktif" : "Nonaktif"}
        </span>
        <ToggleSwitch
          checked={isActive}
          onChange={onToggleActive}
          activeLabel="Lokasi aktif untuk check-in"
          inactiveLabel="Lokasi tidak menerima check-in"
        />
      </div>

      <style jsx>{`
        .loc-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .loc-card__name {
          font-size: 18px;
          font-weight: 700;
          color: var(--admin-text, #fff);
        }

        .loc-card__address {
          font-size: 13px;
          color: var(--admin-text-muted, #94A3B8);
          margin-top: -8px;
        }

        .loc-card__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .loc-card__info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 12px 14px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
        }

        .loc-card__info-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--admin-text-muted, #94A3B8);
        }

        .loc-card__info-value {
          font-size: 14px;
          font-weight: 600;
          color: var(--admin-text-body, #CBD5E1);
        }

        .loc-card__status {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-top: 8px;
          border-top: 1px solid var(--admin-card-border, rgba(255,255,255,0.08));
        }
      `}</style>
    </div>
  );
}
