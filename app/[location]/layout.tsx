"use client";

import React, { useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

// Daftar lokasi yang valid. Jika nama tempat tidak ada di sini, akses ditolak.
const VALID_LOCATIONS = ["koktong", "kopiloka", "kopi-braga"];

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
  
  const isValidLocation = VALID_LOCATIONS.includes(locationSlug);
  
  const isIdentityPage = pathname === `/${locationSlug}/identity`;
  const isRootLocationPage = pathname === `/${locationSlug}`;
  const isAuthorized = name || isIdentityPage || isRootLocationPage;

  useEffect(() => {
    // 1. Validasi Lokasi (Mencegah /random/identity)
    if (!isValidLocation) {
      router.replace("/"); // Lempar ke halaman "Akses Tidak Valid"
      return;
    }

    // 2. Validasi Flow (Mencegah potong kompas)
    if (!isAuthorized) {
      router.replace(`/${locationSlug}/identity`);
      return;
    }
  }, [isValidLocation, isAuthorized, locationSlug, router]);

  // Jangan render anak komponen sampai pengecekan selesai (mencegah kedipan UI)
  if (!isValidLocation || !isAuthorized) {
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
