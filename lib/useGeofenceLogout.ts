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
import { DEMO_MODE, DEMO_GEOFENCE_RADIUS_M } from "@/lib/demo";

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
    const requiredStreak = DEMO_MODE ? 2 : OUTSIDE_STREAK;

    // Where the geofence is measured from:
    //   • demo  → the visitor's OWN first GPS fix (self-anchor) + generous radius,
    //   • else  → the venue's fixed coordinates + radius.
    let centerLat: number | null = DEMO_MODE ? null : target.lat;
    let centerLng: number | null = DEMO_MODE ? null : target.lng;
    const radius = DEMO_MODE ? DEMO_GEOFENCE_RADIUS_M : target.radius;

    // Only test mode is fail-CLOSED (any inability to confirm location ends the
    // session). Demo and production fail OPEN — a GPS glitch never kicks anyone.
    const strict = GEOFENCE_TEST_MODE && !DEMO_MODE;

    const failClosed = (why: string) => {
      if (fired) return;
      fired = true;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (noFixTimer !== null) clearTimeout(noFixTimer);
      console.info(`[geofence] ${why} → ending session (fail-closed)`);
      onExitRef.current("no-location");
    };

    if (!("geolocation" in navigator)) {
      if (strict) failClosed("geolocation not supported");
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

      // Demo self-anchor: the first fix becomes the center we measure from.
      if (centerLat === null || centerLng === null) {
        centerLat = latitude;
        centerLng = longitude;
        return;
      }

      const dist = distanceMeters(latitude, longitude, centerLat, centerLng);
      // Demo uses raw distance vs a generous radius; test/prod use the shared
      // accuracy-aware rule.
      const confidentlyOutside = DEMO_MODE
        ? dist > radius
        : !isInsideGeofence(dist, accuracy, radius);

      console.info(
        `[geofence] dist ${Math.round(dist)} m / radius ${radius} m → ${
          confidentlyOutside ? "OUTSIDE" : "inside"
        }`
      );

      if (confidentlyOutside) {
        outsideStreak += 1;
        if (outsideStreak >= requiredStreak) {
          fired = true;
          if (watchId !== null) navigator.geolocation.clearWatch(watchId);
          onExitRef.current("outside");
        }
      } else {
        outsideStreak = 0; // back inside (or unsure) — reset the streak
      }
    };

    const onError = (err: GeolocationPositionError) => {
      if (strict) {
        failClosed(`location error: ${err.message}`);
        return;
      }
      // Demo / production fail OPEN.
      console.warn("[geofence] location unavailable, not enforcing:", err.message);
      outsideStreak = 0;
    };

    watchId = navigator.geolocation.watchPosition(onPosition, onError, {
      enableHighAccuracy: true,
      maximumAge: 15_000,
      timeout: 27_000,
    });

    // Backstop (test mode only): if no fix ever arrives, fail closed.
    if (strict) {
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
