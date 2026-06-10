// ═══════════════════════════════════════════
// NetSpace — Public demo switch
//
// When DEMO_MODE is true, the app runs in a visitor-friendly "demo" mode so
// anyone can try it without being at the real café:
//
//   • Location gate — self-anchors on the VISITOR's own position (generous
//     radius, fails OPEN). Everyone gets in, anywhere, while the GPS
//     "you must be at the venue" UX stays visible. Walk far enough away and you
//     still get logged out — so the location feature is demonstrable.
//   • Admin login — shows the demo credentials on the sign-in screen.
//   • Admin "location active" toggle — locked, so a tester can't disable
//     check-in and break the demo for everyone.
//
// Set DEMO_MODE = false for a real café deployment: strict per-venue geofence
// (lib/geofence.ts), hidden credentials, and a working location toggle.
// ═══════════════════════════════════════════

export const DEMO_MODE = true;

// Radius (meters) for the demo self-anchor geofence — generous enough that
// testers aren't kicked while exploring, small enough to demo "walk away → out".
export const DEMO_GEOFENCE_RADIUS_M = 150;
