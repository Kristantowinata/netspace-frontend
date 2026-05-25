"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import LocationInfoCard from "@/components/admin/LocationInfoCard";
import QRCodeCard from "@/components/admin/QRCodeCard";
import { getLocationInfo, MOCK_LOCATION } from "@/services/adminMockData";
import { toggleLocationStatus } from "@/services/adminApi";

export default function LokasiPage() {
  const params = useParams();
  const location = params.location as string;
  const locInfo = getLocationInfo(location);

  const [isActive, setIsActive] = useState(MOCK_LOCATION.isActive);

  const handleToggle = async (active: boolean) => {
    setIsActive(active);
    await toggleLocationStatus(location, active);
  };

  return (
    <AdminLayout>
      <div className="lokasi">
        {/* Header */}
        <div className="lokasi__header">
          <h1 className="lokasi__title">Lokasi & QR</h1>
          <p className="lokasi__subtitle">
            Kelola informasi dan QR code check-in untuk <strong>{locInfo.name}</strong>.
          </p>
        </div>

        {/* Content Grid */}
        <div className="lokasi__grid">
          <LocationInfoCard
            name={locInfo.name}
            address={locInfo.address}
            partnerId={locInfo.partnerId}
            joinedDate={MOCK_LOCATION.joinedDate}
            capacity={MOCK_LOCATION.capacity}
            timezone={MOCK_LOCATION.timezone}
            isActive={isActive}
            onToggleActive={handleToggle}
          />
          <QRCodeCard
            token={MOCK_LOCATION.qrToken}
            label={`Meja 1 · ${locInfo.name}`}
          />
        </div>
      </div>

      <style jsx>{`
        .lokasi__header {
          margin-bottom: 28px;
        }

        .lokasi__title {
          font-size: 24px;
          font-weight: 800;
          color: var(--admin-text, #fff);
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }

        .lokasi__subtitle {
          font-size: 13px;
          color: var(--admin-text-muted, #94A3B8);
          line-height: 1.5;
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
