// ═══════════════════════════════════════════
// NetSpace Admin — API Service Layer
// TODO: Replace mock implementations with real API calls
// Base URL: http://localhost:8080
// ═══════════════════════════════════════════

import {
  MOCK_ADMIN,
  MOCK_METRICS,
  MOCK_HOURLY_CHECKINS,
  MOCK_TOP_INTERESTS,
  MOCK_USERS,
  MOCK_LOCATION,
  type AdminUser,
  type MetricData,
  type HourlyCheckIn,
  type InterestStat,
  type LocationData,
  type AdminProfile,
} from "./adminMockData";

// Simulate network delay
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Auth ──

export async function loginAdmin(
  username: string,
  password: string
): Promise<{ success: boolean; admin?: AdminProfile; error?: string }> {
  // TODO: Replace with real API call
  // const res = await fetch('http://localhost:8080/api/admin/login', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ username, password }),
  // });

  await delay(800);

  // Mock: accept any password for demo
  if (username === "kopiloka.sudirman") {
    return { success: true, admin: MOCK_ADMIN };
  }

  return { success: false, error: "Username tidak ditemukan" };
}

// ── Analytics ──

export async function getAnalyticsMetrics(): Promise<MetricData[]> {
  // TODO: Replace with GET /api/admin/dashboard/stats
  await delay(300);
  return MOCK_METRICS;
}

export async function getHourlyCheckIns(): Promise<HourlyCheckIn[]> {
  // TODO: Replace with GET /api/admin/analytics/hourly
  await delay(300);
  return MOCK_HOURLY_CHECKINS;
}

export async function getTopInterests(): Promise<InterestStat[]> {
  // TODO: Replace with GET /api/admin/analytics/interests
  await delay(300);
  return MOCK_TOP_INTERESTS;
}

// ── Location ──

export async function getLocationDetail(): Promise<LocationData> {
  // TODO: Replace with GET /api/admin/locations/{slug}
  await delay(300);
  return MOCK_LOCATION;
}

export async function toggleLocationStatus(
  slug: string,
  isActive: boolean
): Promise<{ success: boolean }> {
  // TODO: Replace with PUT /api/admin/locations/{slug}
  await delay(500);
  return { success: true };
}

// ── Users ──

export async function getActiveUsers(): Promise<AdminUser[]> {
  // TODO: Replace with GET /api/admin/locations/{slug}/users
  await delay(300);
  return MOCK_USERS;
}

export async function forceLogoutUser(
  userId: string,
  reason: string
): Promise<{ success: boolean }> {
  // TODO: Replace with POST /api/admin/users/{userId}/kick
  // Body: { reason }
  await delay(600);
  console.log(`[Mock] Force logout user ${userId}, reason: ${reason}`);
  return { success: true };
}
