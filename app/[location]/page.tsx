"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MobileLayout from "@/components/layout/MobileLayout";
import { useAppStore } from "@/store/useAppStore";

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const locationSlug = params.location as string;
  const setLocation = useAppStore((s) => s.setLocation);

  useEffect(() => {
    if (locationSlug) {
      setLocation(locationSlug);
      router.push(`/${locationSlug}/identity`);
    }
  }, [locationSlug, setLocation, router]);

  return (
    <MobileLayout showGlow={false}>
      <div className="join-orbs" aria-hidden="true">
        <div className="join-orbs__blue" />
        <div className="join-orbs__purple" />
      </div>

      <main className="join-content">
        <div className="spinner" />
        <p className="loading-text">Menyiapkan sesi Anda...</p>
      </main>

      <style jsx>{`
        .join-orbs {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .join-orbs__blue {
          position: absolute;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(56, 100, 255, 0.45) 0%,
            transparent 70%
          );
          top: -100px;
          left: -80px;
        }

        .join-orbs__purple {
          position: absolute;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(130, 70, 255, 0.35) 0%,
            transparent 70%
          );
          bottom: 40px;
          right: -60px;
        }

        .join-content {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 28px;
          gap: 16px;
        }

        .spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-text {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
          margin-top: 8px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </MobileLayout>
  );
}
