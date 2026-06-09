// ═══════════════════════════════════════════
// NetSpace — GPS geofence auto-logout hook
//
// NetSpace is presence-based: you may only stay "in the room" while you're
// physically at the venue. This hook watches the device's location and ends the
// session once the user is *confidently* outside the venue's geofence.
//
// Safety bias — we only log out when we're sure the user left:
//   • A reading counts as "outside" only when (distance - accuracy) > radius,
//     so a fuzzy GPS fix never triggers a false logout.
//   • We require several consecutive "outside" readings (debounce) before
//     ending the session, so a single bad spike is ignored.
//   • If permission is denied or location is unavailable, we fail OPEN (do not
//     log out) — better than kicking someone over a GPS glitch.
//
// Note: navigator.geolocation needs a secure context (HTTPS), except on
// localhost. In production the app must be served over HTTPS.
// ═══════════════════════════════════════════

import { useEffect, useRef } from "react";
import {
  GEOFENCE_TEST_MODE,
  NO_FIX_TIMEOUT_MS,
  distanceMeters,
  isInsideGeofence,
  type GeofenceTarget,
  type GeofenceExitReason,
} from "@/lib/geofence";

// Re-export so existing imports (e.g. the layout) keep working.
export type { GeofenceTarget, GeofenceExitReason };

// How many consecutive confident-outside fixes before we end the session.
// Production debounces (3) so a single GPS spike can't falsely kick someone.
// Test mode reacts on the first outside reading — a static device (laptop) may
// only report one fix, so waiting for a streak would never trigger.
const OUTSIDE_STREAK = GEOFENCE_TEST_MODE ? 1 : 3;

/**
 * Logs the user out once they're confidently outside the venue geofence.
 *
 * @param enabled Only watch for a real, authenticated session.
 * @param target  Venue center + radius, or null to disable (not configured).
 * @param onExit  Called once when the session must end, with the reason.
 */
export function useGeofenceLogout(
  enabled: boolean,
  target: GeofenceTarget | null,
  onExit: (reason: GeofenceExitReason) => void
): void {
  const onExitRef = useRef(onExit);
  onExitRef.current = onExit;

  useEffect(() => {
    if (!enabled || !target || typeof window === "undefined") return;

    let outsideStreak = 0;
    let fired = false;
    let gotFix = false;
    let watchId: number | null = null;
    let noFixTimer: ReturnType<typeof setTimeout> | null = null;

    // The geofence is measured from the venue's fixed coordinates + radius (the
    // café spot), in both modes.
    const { lat: centerLat, lng: centerLng, radius } = target;

    // Test mode is fail-CLOSED: any inability to confirm the user is inside the
    // radius (permission denied, location off, no signal, prompt ignored) ends
    // the session. Production fails OPEN, so this only runs in test mode.
    const failClosed = (why: string) => {
      if (fired) return;
      fired = true;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (noFixTimer !== null) clearTimeout(noFixTimer);
      console.info(`[geofence] ${why} → ending session (test fail-closed)`);
      onExitRef.current("no-location");
    };

    if (!("geolocation" in navigator)) {
      if (GEOFENCE_TEST_MODE) failClosed("geolocation not supported");
      return;
    }

    const onPosition = (pos: GeolocationPosition) => {
      if (fired) return;
      gotFix = true;
      if (noFixTimer !== null) {
        clearTimeout(noFixTimer);
        noFixTimer = null;
      }
      const { latitude, longitude, accuracy } = pos.coords;

      const dist = distanceMeters(latitude, longitude, centerLat, centerLng);

      // Outside = not inside. Shared with the entry gate so both agree on the
      // boundary (test mode = raw distance; production = accuracy-aware).
      const confidentlyOutside = !isInsideGeofence(dist, accuracy, radius);

      if (GEOFENCE_TEST_MODE) {
        console.info(
          `[geofence] dist ${Math.round(dist)} m / radius ${radius} m · accuracy ±${Math.round(
            accuracy
          )} m · ${confidentlyOutside ? "OUTSIDE" : "inside"} (streak ${
            confidentlyOutside ? outsideStreak + 1 : 0
          }/${OUTSIDE_STREAK})`
        );
      }

      if (confidentlyOutside) {
        outsideStreak += 1;
        if (outsideStreak >= OUTSIDE_STREAK) {
          fired = true;
          if (watchId !== null) navigator.geolocation.clearWatch(watchId);
          onExitRef.current("outside");
        }
      } else {
        outsideStreak = 0; // back inside (or unsure) — reset the streak
      }
    };

    const onError = (err: GeolocationPositionError) => {
      // Test mode: ANY location error (denied, unavailable, timeout) means we
      // can't confirm the user is in range → fail closed. Production fails open
      // so a GPS glitch never kicks a real visitor.
      if (GEOFENCE_TEST_MODE) {
        failClosed(`location error: ${err.message}`);
        return;
      }
      console.warn("[geofence] location unavailable, not enforcing:", err.message);
      outsideStreak = 0;
    };

    watchId = navigator.geolocation.watchPosition(onPosition, onError, {
      enableHighAccuracy: true,
      maximumAge: 15_000,
      timeout: 27_000,
    });

    // Backstop for the case watchPosition never calls back at all — most often a
    // permission prompt left unanswered, or location services disabled with no
    // error surfaced. If no fix arrives in time, fail closed.
    if (GEOFENCE_TEST_MODE) {
      noFixTimer = setTimeout(() => {
        if (!gotFix) failClosed("no location fix in time (permission not granted?)");
      }, NO_FIX_TIMEOUT_MS);
    }

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (noFixTimer !== null) clearTimeout(noFixTimer);
    };
  }, [enabled, target?.lat, target?.lng, target?.radius]);
}
