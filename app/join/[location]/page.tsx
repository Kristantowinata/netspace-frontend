"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import MobileLayout from "@/components/layout/MobileLayout";
import Button from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const locationSlug = params.location as string;
  const setLocation = useAppStore((s) => s.setLocation);

  // Derive display name from slug
  const locationName = locationSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const handleStart = () => {
    setLocation(locationSlug);
    router.push("/identity");
  };

  return (
    <MobileLayout showGlow={false}>
      {/* ── Background orbs ── */}
      <div className="join-orbs" aria-hidden="true">
        <div className="join-orbs__blue" />
        <div className="join-orbs__purple" />
      </div>

      {/* ── Content ── */}
      <main className="join-content">
        {/* Logo icon */}
        <div className="join-logo">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>

        <h1 className="join-title">Social Hub</h1>

        {/* Location welcome */}
        <div className="join-welcome glass">
          <p className="join-welcome__text">
            Selamat datang di
          </p>
          <p className="join-welcome__location">
            📍 {locationName}
          </p>
        </div>

        <p className="join-description">
          Temukan orang baru di sekitarmu.
          <br />
          Check-in anonim, chat sementara.
        </p>

        {/* CTA */}
        <div className="join-cta">
          <Button onClick={handleStart} fullWidth>
            Mulai Check-in →
          </Button>
        </div>

        <p className="join-footer">
          Chat akan dihapus otomatis saat kamu logout
        </p>
      </main>

      <style jsx>{`
        /* Background orbs */
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

        /* Content */
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
          text-align: center;
        }

        /* Logo */
        .join-logo {
          width: 72px;
          height: 72px;
          border-radius: 24px;
          background: var(--gradient-brand);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(56, 100, 255, 0.45);
          margin-bottom: 8px;
        }

        .join-title {
          font-size: 28px;
          font-weight: 800;
          color: white;
        }

        /* Welcome card */
        .join-welcome {
          padding: 16px 24px;
          border-radius: 18px;
          margin-top: 8px;
        }

        .join-welcome__text {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
        }

        .join-welcome__location {
          font-size: 22px;
          font-weight: 800;
          color: white;
          margin-top: 4px;
        }

        .join-description {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.6;
        }

        /* CTA */
        .join-cta {
          width: 100%;
          margin-top: 12px;
        }

        .join-footer {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.3);
          margin-top: 8px;
        }
      `}</style>
    </MobileLayout>
  );
}
