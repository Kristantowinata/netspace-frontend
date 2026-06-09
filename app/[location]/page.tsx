"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MobileLayout from "@/components/layout/MobileLayout";
import { useAppStore } from "@/store/useAppStore";
import {
  GEOFENCE_TEST_MODE,
  distanceMeters,
  isInsideGeofence,
  resolveGeofenceTarget,
} from "@/lib/geofence";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

// checking → asking for/awaiting location
// denied   → permission refused / unavailable (test mode blocks here)
// outside  → got a fix, but beyond the venue radius
// inside   → at the venue → moving on to identity
// invalid  → location slug not found
type GateState = "checking" | "denied" | "outside" | "inside" | "invalid";

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const locationSlug = params.location as string;
  const setLocation = useAppStore((s) => s.setLocation);

  const [state, setState] = useState<GateState>("checking");
  const [venueName, setVenueName] = useState("");
  const didInit = useRef(false);

  // Entry gate: confirm the visitor is physically at the venue BEFORE letting
  // them into the identity/check-in flow. Asks for location immediately, then:
  //   • inside the radius  → continue to identity,
  //   • outside            → blocked,
  //   • denied/unavailable → blocked (test mode) / allowed (production fail-open).
  const runGate = useCallback(async () => {
    setState("checking");

    let venue: {
      name?: string;
      isActive?: boolean;
      latitude?: number;
      longitude?: number;
      geofenceRadius?: number;
    };
    try {
      const res = await fetch(`${API_BASE}/api/locations/${locationSlug}`);
      if (!res.ok) {
        setState("invalid");
        return;
      }
      venue = await res.json();
    } catch {
      setState("invalid");
      return;
    }

    if (venue.isActive === false) {
      setState("invalid");
      return;
    }
    setVenueName(venue.name ?? "");

    const proceed = () => {
      setState("inside");
      router.push(`/${locationSlug}/identity`);
    };

    // Center + radius from the manual override (lib/geofence.ts) or the venue's
    // DB coordinates. null → this venue has no geofence, so let them in.
    const target = resolveGeofenceTarget(venue);
    if (!target) {
      proceed();
      return;
    }

    if (!("geolocation" in navigator)) {
      if (GEOFENCE_TEST_MODE) setState("denied");
      else proceed();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const dist = distanceMeters(
          pos.coords.latitude,
          pos.coords.longitude,
          target.lat,
          target.lng
        );
        console.info(
          `[gate] dist ${Math.round(dist)} m / radius ${target.radius} m · accuracy ±${Math.round(
            pos.coords.accuracy
          )} m → ${
            isInsideGeofence(dist, pos.coords.accuracy, target.radius)
              ? "INSIDE"
              : "OUTSIDE"
          }`
        );
        if (isInsideGeofence(dist, pos.coords.accuracy, target.radius)) proceed();
        else setState("outside");
      },
      (err) => {
        console.info(`[gate] location error: ${err.message}`);
        // Test mode is fail-closed: can't confirm you're here → blocked.
        if (GEOFENCE_TEST_MODE) setState("denied");
        else proceed();
      },
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 0 }
    );
  }, [locationSlug, router]);

  useEffect(() => {
    if (!locationSlug || didInit.current) return;
    didInit.current = true;
    setLocation(locationSlug);
    runGate();
  }, [locationSlug, setLocation, runGate]);

  const blocked = state === "denied" || state === "outside";

  return (
    <MobileLayout showGlow={false}>
      <div className="join-orbs" aria-hidden="true">
        <div className="join-orbs__blue" />
        <div className="join-orbs__purple" />
      </div>

      <main className="join-content">
        {state === "checking" && (
          <>
            <div className="spinner" />
            <p className="join-title">Memeriksa lokasi…</p>
            <p className="join-sub">
              Izinkan akses lokasi untuk melanjutkan.
            </p>
          </>
        )}

        {state === "inside" && (
          <>
            <div className="spinner" />
            <p className="join-title">Menyiapkan sesi…</p>
          </>
        )}

        {state === "invalid" && (
          <>
            <div className="join-icon">⚠️</div>
            <p className="join-title">Lokasi tidak ditemukan</p>
            <p className="join-sub">
              QR Code ini tidak valid atau lokasi sedang nonaktif.
            </p>
          </>
        )}

        {blocked && (
          <>
            <div className="join-icon">📍</div>
            <p className="join-title">
              {state === "denied"
                ? "Aktifkan Lokasi"
                : "Kamu di Luar Lokasi"}
            </p>
            <p className="join-sub">
              {state === "denied"
                ? "Aplikasi ini hanya bisa dipakai di lokasi. Nyalakan izin lokasi di browser, lalu coba lagi."
                : `Kamu harus berada di ${
                    venueName || "lokasi"
                  } untuk masuk. Dekati lokasinya, lalu coba lagi.`}
            </p>
            <button type="button" className="join-retry" onClick={runGate}>
              Coba Lagi
            </button>
          </>
        )}
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
          padding: 40px 32px;
          gap: 12px;
          text-align: center;
        }

        .spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 6px;
        }

        .join-icon {
          font-size: 44px;
          margin-bottom: 4px;
        }

        .join-title {
          font-size: 18px;
          font-weight: 800;
          color: #fff;
        }

        .join-sub {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
          max-width: 300px;
        }

        .join-retry {
          margin-top: 14px;
          padding: 12px 28px;
          border-radius: 14px;
          background: linear-gradient(135deg, #3864ff, #6438ff);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          font-family: inherit;
          border: none;
          box-shadow: 0 4px 18px rgba(56, 100, 255, 0.4);
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.15s ease;
        }

        .join-retry:active {
          transform: scale(0.96);
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
