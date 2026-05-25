"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

export default function LocationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locationSlug = params.location as string;

  const name = useAppStore((s) => s.name);

  const [isValidLocation, setIsValidLocation] = useState<boolean | null>(null);

  const isIdentityPage = pathname === `/${locationSlug}/identity`;
  const isRootLocationPage = pathname === `/${locationSlug}`;
  const isAdminPage = pathname.startsWith(`/${locationSlug}/admin`);
  const isAuthorized = !!name || isIdentityPage || isRootLocationPage || isAdminPage;

  useEffect(() => {
    const FALLBACK_LOCATIONS = ["koktong", "kopiloka", "kopi-braga"];

    const checkLocation = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/locations/${locationSlug}`
        );

        if (!response.ok) {
          setIsValidLocation(false);
          return;
        }

        const data = await response.json();
        console.log(data);

        setIsValidLocation(data.isActive);
      } catch {
        // Backend not reachable — fallback to hardcoded valid locations
        console.warn("[LocationLayout] Backend unreachable, using fallback validation");
        setIsValidLocation(FALLBACK_LOCATIONS.includes(locationSlug));
      }
    };

    if (locationSlug) {
      checkLocation();
    }
  }, [locationSlug]);

  useEffect(() => {
    if (isValidLocation === null) return; // still loading

    // 1. invalid location
    if (!isValidLocation) {
      router.replace("/");
      return;
    }

    // 2. Validasi Flow (Mencegah potong kompas)
    if (!isAuthorized) {
      router.replace(`/${locationSlug}/identity`);
      return;
    }
  }, [isValidLocation, isAuthorized, locationSlug, router]);

  // Jangan render anak komponen sampai pengecekan selesai (mencegah kedipan UI)
  if (!isValidLocation || (!isAuthorized && !isAdminPage)) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#111953" }}>
        <div className="spinner" style={{ width: "36px", height: "36px", border: "3px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
