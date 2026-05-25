"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import LocationInfoCard from "@/components/admin/LocationInfoCard";
import QRCodeCard from "@/components/admin/QRCodeCard";
import { MOCK_LOCATION } from "@/services/adminMockData";
import { toggleLocationStatus } from "@/services/adminApi";

export default function LokasiPage() {
  const [isActive, setIsActive] = useState(MOCK_LOCATION.isActive);

  const handleToggle = async (active: boolean) => {
    setIsActive(active);
    await toggleLocationStatus(MOCK_LOCATION.slug, active);
  };

  return (
    <AdminLayout>
      <div className="lokasi">
        {/* Header */}
        <div className="lokasi__header">
          <h1 className="lokasi__title">Lokasi & QR</h1>
          <p className="lokasi__subtitle">
            Kelola lokasi terdaftar dan QR code untuk check-in.
          </p>
        </div>

        {/* Content Grid */}
        <div className="lokasi__grid">
          <LocationInfoCard
            name={MOCK_LOCATION.name}
            address={MOCK_LOCATION.address}
            partnerId={MOCK_LOCATION.partnerId}
            joinedDate={MOCK_LOCATION.joinedDate}
            capacity={MOCK_LOCATION.capacity}
            timezone={MOCK_LOCATION.timezone}
            isActive={isActive}
            onToggleActive={handleToggle}
          />
          <QRCodeCard
            token={MOCK_LOCATION.qrToken}
            label={MOCK_LOCATION.qrLabel}
          />
        </div>
      </div>

      <style jsx>{`
        .lokasi__header {
          margin-bottom: 24px;
        }

        .lokasi__title {
          font-size: 22px;
          font-weight: 800;
          color: var(--admin-text, #fff);
          margin-bottom: 4px;
        }

        .lokasi__subtitle {
          font-size: 13px;
          color: var(--admin-text-muted, #94A3B8);
        }

        .lokasi__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        @media (max-width: 1100px) {
          .lokasi__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
