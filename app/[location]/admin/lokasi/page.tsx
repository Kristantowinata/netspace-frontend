"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import LocationInfoCard from "@/components/admin/LocationInfoCard";
import QRCodeCard from "@/components/admin/QRCodeCard";
import { getLocationInfo } from "@/services/adminMockData";
import type { LocationData } from "@/services/adminMockData";
import { getLocationDetail, toggleLocationStatus } from "@/services/adminApi";

export default function LokasiPage() {
  const params = useParams();
  const location = params.location as string;
  const locInfo = getLocationInfo(location);

  const [data, setData] = useState<LocationData | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // The QR encodes the public entry URL for this café: <app-url>/<slug>.
  // NEXT_PUBLIC_APP_URL is the canonical domain in production; in dev we fall
  // back to the current origin so the QR points at wherever the app is served.
  const [appOrigin, setAppOrigin] = useState(
    process.env.NEXT_PUBLIC_APP_URL ?? ""
  );
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_APP_URL && typeof window !== "undefined") {
      setAppOrigin(window.location.origin);
    }
  }, []);
  const qrUrl = appOrigin ? `${appOrigin}/${location}` : "";

  const fetchDetail = useCallback(() => {
    setLoading(true);
    setError(null);
    getLocationDetail(location)
      .then((d) => {
        setData(d);
        setIsActive(d.isActive);
      })
      .catch((err) => {
        console.error(err);
        setError(
          "Gagal memuat detail lokasi. Silakan periksa koneksi server Anda."
        );
      })
      .finally(() => setLoading(false));
  }, [location]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleToggle = async (active: boolean) => {
    const prev = isActive;
    setIsActive(active); // optimistic update
    try {
      await toggleLocationStatus(location, active);
    } catch (err) {
      console.error(err);
      setIsActive(prev); // rollback on failure
    }
  };

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-white mb-1 tracking-tight">Lokasi &amp; QR</h1>
          <p className="text-[13px] text-admin-text-muted leading-normal">
            Kelola informasi dan QR code check-in untuk <strong>{data?.name ?? locInfo.name}</strong>.
          </p>
        </div>

        {error ? (
          <div className="bg-white/[0.035] backdrop-blur-[20px] border border-white/[0.06] rounded-xl py-14 px-6 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center text-admin-danger text-lg font-bold">
              ⚠️
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Gagal Memuat Data</p>
              <p className="text-xs text-admin-text-muted mt-1 max-w-[320px]">{error}</p>
            </div>
            <button
              type="button"
              className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg font-[inherit] text-xs font-semibold cursor-pointer transition-all duration-200 outline-none bg-admin-primary/10 text-admin-accent border border-admin-primary/35 hover:bg-admin-primary/20 hover:border-admin-primary/50"
              onClick={fetchDetail}
            >
              Coba Lagi
            </button>
          </div>
        ) : loading || !data ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-7 h-7 rounded-full border-[3px] border-admin-primary/30 border-t-admin-primary animate-admin-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 max-[1100px]:grid-cols-1">
            <LocationInfoCard
              name={data.name}
              address={data.address}
              partnerId={data.partnerId}
              joinedDate={data.joinedDate}
              capacity={data.capacity}
              timezone={data.timezone}
              isActive={isActive}
              onToggleActive={handleToggle}
            />
            <QRCodeCard
              url={qrUrl}
              token={data.qrToken}
              label={data.qrLabel}
              fileName={location}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
