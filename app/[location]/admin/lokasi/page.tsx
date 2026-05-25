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
      <div>
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-white mb-1 tracking-tight">Lokasi &amp; QR</h1>
          <p className="text-[13px] text-admin-text-muted leading-normal">
            Kelola informasi dan QR code check-in untuk <strong>{locInfo.name}</strong>.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-6 max-[1100px]:grid-cols-1">
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
    </AdminLayout>
  );
}
