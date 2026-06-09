// ═══════════════════════════════════════════
// NetSpace — shared geofence config + helpers
//
// One source of truth for the venue geofence, used by:
//   • the entry gate (app/[location]/page.tsx) — you must be inside to enter,
//   • the live logout hook (useGeofenceLogout) — you're logged out if you leave.
// ═══════════════════════════════════════════

export interface GeofenceTarget {
  lat: number;
  lng: number;
  radius: number; // meters
}

// Why a session is ending: the user walked out of the radius, or (test mode
// only) they wouldn't share location so we can't confirm they're in range.
export type GeofenceExitReason = "outside" | "no-location";

// ── Testing geofence ───────────────────────────────────────────────────────
// Both modes enforce against the VENUE's coordinates + radius from the DB — the
// fixed point that represents the café, so only people physically within the
// radius can be in (or get in). GEOFENCE_TEST_MODE makes enforcement stricter
// and small-radius-friendly for testing:
//   • the accuracy guard is skipped — a 10 m radius can't survive subtracting a
//     typical 10–30 m GPS accuracy, so we compare raw distance instead,
//   • it's fail-CLOSED: refusing/disabling location also blocks you (you can't
//     enter without sharing location).
// Set to false for production (accuracy-aware + fail-open: a GPS glitch never
// kicks or blocks a real visitor). Requires the browser's location permission.
export const GEOFENCE_TEST_MODE = true;

// Test-mode fail-closed grace: if we can't get ANY location fix within this long
// (permission prompt ignored, location services off, no signal…), treat it as
// "can't confirm" → blocked.
export const NO_FIX_TIMEOUT_MS = 12_000;

// ── Manual coordinate override (edit this yourself) ─────────────────────────
// Force the geofence center + radius for EVERY location, ignoring the database.
// Change lat/lng/radius below, save, and reload the app — no SQL, no restart.
// Tip: to grab your current spot, allow location once and run in the browser
// console:  navigator.geolocation.getCurrentPosition(p=>console.log(p.coords.latitude, p.coords.longitude))
//
// Set GEOFENCE_OVERRIDE to null to instead use each venue's real DB coordinates.
export const GEOFENCE_OVERRIDE: GeofenceTarget | null = {
  lat: -6.201287,
  lng: 106.782267,
  radius: 40, // meters
};

// Resolve the geofence target for a venue: the manual override if set, else the
// venue's DB coordinates (or null when the venue has no geofence configured).
export function resolveGeofenceTarget(venue: {
  latitude?: number;
  longitude?: number;
  geofenceRadius?: number;
}): GeofenceTarget | null {
  if (GEOFENCE_OVERRIDE) return GEOFENCE_OVERRIDE;

  const hasGeo =
    typeof venue.latitude === "number" &&
    typeof venue.longitude === "number" &&
    (venue.latitude !== 0 || venue.longitude !== 0);
  if (!hasGeo) return null;

  const radius =
    typeof venue.geofenceRadius === "number" && venue.geofenceRadius > 0
      ? venue.geofenceRadius
      : 100;

  return {
    lat: venue.latitude as number,
    lng: venue.longitude as number,
    radius,
  };
}

// Great-circle distance between two lat/lng points, in meters (Haversine).
export function distanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6_371_000; // Earth radius (m)
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Whether a reading counts as "inside" the geofence (allowed in / stays in).
//   • test mode: raw distance within the radius,
//   • production: inside unless even the optimistic edge of the accuracy circle
//     is beyond the radius (so a fuzzy fix doesn't falsely exclude someone).
export function isInsideGeofence(
  distM: number,
  accuracyM: number,
  radiusM: number
): boolean {
  return GEOFENCE_TEST_MODE ? distM <= radiusM : distM - accuracyM <= radiusM;
}
