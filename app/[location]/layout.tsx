"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { wsClient, useWsEvent } from "@/lib/ws";
import { EV, type NewPublicMessageEvent } from "@/lib/wsTypes";
import { useIdleLogout } from "@/lib/useIdleLogout";
import { useGeofenceLogout, type GeofenceTarget } from "@/lib/useGeofenceLogout";
import { resolveGeofenceTarget } from "@/lib/geofence";
import MessageToast from "@/components/ui/MessageToast";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

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
  const sessionToken = useAppStore((s) => s.sessionToken);
  const reset = useAppStore((s) => s.reset);
  const setUnreadNotif = useAppStore((s) => s.setUnreadNotif);
  const bumpUnreadPublic = useAppStore((s) => s.bumpUnreadPublic);
  const blockedIds = useAppStore((s) => s.blockedIds);

  const [isValidLocation, setIsValidLocation] = useState<boolean | null>(null);
  const [sessionEnding, setSessionEnding] = useState(false);
  const [endMessage, setEndMessage] = useState("");
  const [geofence, setGeofence] = useState<GeofenceTarget | null>(null);

  const isIdentityPage = pathname === `/${locationSlug}/identity`;
  const isRootLocationPage = pathname === `/${locationSlug}`;
  const isAdminPage = pathname.startsWith(`/${locationSlug}/admin`);
  const isAuthorized = !!name || isIdentityPage || isRootLocationPage || isAdminPage;

  // Open a single, persistent WebSocket for the whole authenticated user
  // session. Kept alive across room/chat/profile navigation so the backend
  // sees the user as "online"; torn down on logout (profile page) or tab close.
  useEffect(() => {
    if (!sessionToken || !locationSlug || isAdminPage) return;
    wsClient.connect(sessionToken, locationSlug);
  }, [sessionToken, locationSlug, isAdminPage]);

  // Surface notifications app-wide: any incoming notification (e.g. a group
  // invite) raises an unread dot on the Profile tab, so the recipient notices
  // even when they're not sitting on that page. The Profile page clears it.
  useWsEvent(EV.NEW_NOTIFICATION, () => {
    setUnreadNotif(true);
  });

  // Public-room messages don't raise a notification per message (that'd be
  // spammy for a broadcast room). Instead, when one arrives while the user is
  // NOT in the public room, bump an unread count surfaced as a badge on the
  // Public Room card. Their own messages and blocked senders don't count.
  useWsEvent<NewPublicMessageEvent>(EV.NEW_PUBLIC_MESSAGE, (data) => {
    if (data.isMine || blockedIds.includes(data.senderId)) return;
    if (pathname === `/${locationSlug}/room/public`) return;
    bumpUnreadPublic();
  });

  // Seed the badge on load (and whenever the session changes) so unread
  // notifications that arrived earlier — including before this tab was opened —
  // still show up. Best-effort; failures just leave the badge unset.
  useEffect(() => {
    if (!sessionToken || isAdminPage) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/notifications`, {
          headers: { Authorization: `Bearer ${sessionToken}` },
        });
        if (!res.ok) return;
        const data: { notifications?: { unread: boolean }[] } =
          await res.json();
        if (!cancelled && (data.notifications ?? []).some((n) => n.unread)) {
          setUnreadNotif(true);
        }
      } catch {
        /* badge is best-effort */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionToken, isAdminPage, setUnreadNotif]);

  // Shared session-teardown used by every auto-logout path: tell the backend
  // (purge + mark inactive), drop the socket, clear local state, go to entry.
  const endSession = useCallback(
    async (message: string) => {
      setEndMessage(message);
      setSessionEnding(true);
      try {
        if (sessionToken) {
          await fetch(`${API_BASE}/api/sessions/logout`, {
            headers: { Authorization: `Bearer ${sessionToken}` },
          });
        }
      } catch (err) {
        console.error(err);
      }
      wsClient.disconnect();
      reset();
      router.replace("/");
    },
    [sessionToken, reset, router]
  );

  // Presence-based session #1: 30 minutes with no interaction ends it.
  useIdleLogout(!!sessionToken && !isAdminPage, () =>
    endSession(
      "Kamu logout otomatis karena tidak aktif. Scan QR lagi untuk masuk kembali."
    )
  );

  // Presence-based session #2: leaving the venue's geofence ends it. Enforced
  // continuously from the moment they're past the entry gate (identity onward),
  // NOT just after check-in — so turning location off or walking out kicks them
  // even mid check-in, and opening /identity directly can't skip the gate. The
  // root page runs its own one-shot gate, so it's excluded here.
  useGeofenceLogout(
    !isAdminPage && !isRootLocationPage,
    geofence,
    (reason) =>
    endSession(
      reason === "no-location"
        ? "Akses lokasi dimatikan atau ditolak. Aktifkan izin lokasi lalu scan QR lagi untuk masuk."
        : "Kamu keluar dari area lokasi, jadi sesimu berakhir. Scan QR lagi saat kembali."
    )
  );

  // Admin kicked this session. Tear down like any other auto-logout — crucially
  // this stops the WS auto-reconnect, so the user can't silently pop back online
  // (and reappear on the next refresh) with their still-cached token.
  useWsEvent<{ reason?: string }>(EV.FORCE_LOGOUT, (data) =>
    endSession(
      data?.reason
        ? `${data.reason} Scan QR lagi untuk masuk kembali.`
        : "Kamu dikeluarkan dari sesi oleh admin. Scan QR lagi untuk masuk kembali."
    )
  );

  useEffect(() => {
    const FALLBACK_LOCATIONS = ["koktong", "kopiloka", "kopi-braga"];

    const checkLocation = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/locations/${locationSlug}`
        );

        if (!response.ok) {
          setIsValidLocation(false);
          return;
        }

        const data = await response.json();

        setIsValidLocation(data.isActive);

        // Arm the geofence from the manual override (lib/geofence.ts) or the
        // venue's DB coordinates; null when this venue has no geofence.
        const target = resolveGeofenceTarget(data);
        if (target) {
          setGeofence(target);
        } else {
          setGeofence(null);
        }
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
    if (isValidLocation === null || sessionEnding) return; // still loading / ending

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
  }, [isValidLocation, isAuthorized, locationSlug, router, sessionEnding]);

  // Session ended automatically (idle timeout or left the geofence) — show a
  // brief notice while we tear the session down and navigate away.
  if (sessionEnding) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          height: "100vh",
          padding: "0 32px",
          textAlign: "center",
          backgroundColor: "#111953",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: "32px" }}>👋</div>
        <p style={{ fontSize: "16px", fontWeight: 700 }}>Sesi berakhir</p>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
          {endMessage}
        </p>
      </div>
    );
  }

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

  return (
    <>
      {/* App-wide incoming-DM toast. Not on admin pages, and only once a
          session exists so it can route into chats. */}
      {!isAdminPage && !!sessionToken && <MessageToast />}
      {children}
    </>
  );
}
