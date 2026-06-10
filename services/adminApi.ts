// ═══════════════════════════════════════════
// NetSpace Admin — API Service Layer
// Talks to the Go backend (default http://localhost:8080)
// Base URL configurable via NEXT_PUBLIC_API_BASE_URL
// ═══════════════════════════════════════════

import type {
  AdminUser,
  MetricData,
  HourlyCheckIn,
  InterestStat,
  LocationData,
  AdminProfile,
} from "./adminMockData";

import { useAdminStore } from "@/store/useAdminStore";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

// Builds request headers, attaching the admin JWT as a Bearer token when present.
function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extra,
  };
  const token =
    typeof window !== "undefined" ? useAdminStore.getState().token : "";
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`GET ${path} failed with status ${res.status}`);
  }
  return (await res.json()) as T;
}

export interface AdminPublicMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderEmoji: string;
  message: string;
  timestamp: string;
  isMine: boolean;
  isAdmin: boolean;
}

// ── Auth ──

export async function loginAdmin(
  username: string,
  password: string
): Promise<{ success: boolean; admin?: AdminProfile; token?: string; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = (await res.json().catch(() => null)) as {
      success?: boolean;
      admin?: AdminProfile;
      token?: string;
      error?: string;
    } | null;

    if (data?.success && data.admin && data.token) {
      return { success: true, admin: data.admin, token: data.token };
    }
    return { success: false, error: data?.error ?? "Login gagal" };
  } catch {
    return {
      success: false,
      error: "Tidak dapat terhubung ke server. Periksa koneksi Anda.",
    };
  }
}

// ── Analytics (global, tidak per-lokasi) ──

export async function getAnalyticsMetrics(): Promise<MetricData[]> {
  return apiGet<MetricData[]>("/api/admin/dashboard/stats");
}

export async function getHourlyCheckIns(): Promise<HourlyCheckIn[]> {
  return apiGet<HourlyCheckIn[]>("/api/admin/analytics/hourly");
}

export async function getTopInterests(): Promise<InterestStat[]> {
  return apiGet<InterestStat[]>("/api/admin/analytics/interests");
}

// ── Location ──

export async function getLocationDetail(slug: string): Promise<LocationData> {
  return apiGet<LocationData>(`/api/admin/locations/${slug}`);
}

export async function toggleLocationStatus(
  slug: string,
  isActive: boolean
): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/api/admin/locations/${slug}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ isActive }),
  });
  if (!res.ok) {
    throw new Error(`Toggle location failed with status ${res.status}`);
  }
  return (await res.json()) as { success: boolean };
}

// ── Users ──

export async function getActiveUsers(slug: string): Promise<AdminUser[]> {
  return apiGet<AdminUser[]>(`/api/admin/locations/${slug}/users`);
}

export async function forceLogoutUser(
  userId: string,
  reason: string
): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/api/admin/users/${userId}/kick`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) {
    throw new Error(`Force logout failed with status ${res.status}`);
  }
  return (await res.json()) as { success: boolean };
}

export async function getAdminPublicMessages(
  slug: string
): Promise<AdminPublicMessage[]> {
  const data = await apiGet<{ messages: AdminPublicMessage[] }>(
    `/api/admin/locations/${slug}/public-messages`
  );
  return data.messages ?? [];
}

export async function deleteAllPublicMessages(
  slug: string
): Promise<{ success: boolean; deletedCount: number }> {
  const res = await fetch(
    `${BASE_URL}/api/admin/locations/${slug}/public-messages`,
    {
      method: "DELETE",
      headers: authHeaders(),
    }
  );
  if (!res.ok) {
    throw new Error(`Delete public messages failed with status ${res.status}`);
  }
  return (await res.json()) as { success: boolean; deletedCount: number };
}
