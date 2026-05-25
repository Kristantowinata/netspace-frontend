// ═══════════════════════════════════════════
// NetSpace Admin — Mock Data
// All data extracted from Admin-dokumentation/UX/ HTML files
// TODO: Replace with real API responses when backend is ready
// ═══════════════════════════════════════════

// ── Location Name Mapping ──
const LOCATION_NAMES: Record<string, { name: string; address: string; partnerId: string; avatar: string }> = {
  koktong: {
    name: "Koktong",
    address: "Jl. Pangeran Jayakarta No. 73, Jakarta Barat",
    partnerId: "KKT-001",
    avatar: "🍵",
  },
  kopiloka: {
    name: "Kopiloka Sudirman",
    address: "Jl. Jend. Sudirman No. 123, Jakarta Selatan",
    partnerId: "KPL-001",
    avatar: "☕",
  },
  "kopi-braga": {
    name: "Kopi Braga",
    address: "Jl. Braga No. 45, Bandung",
    partnerId: "KBG-001",
    avatar: "☕",
  },
};

export function getLocationInfo(slug: string) {
  return LOCATION_NAMES[slug] || {
    name: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    address: "-",
    partnerId: slug.toUpperCase().slice(0, 3) + "-001",
    avatar: "📍",
  };
}

export interface AdminUser {
  id: string;
  name: string;
  avatar: string;
  gender: string;
  interests: { emoji: string; label: string }[];
  duration: number; // minutes
}

export interface MetricData {
  label: string;
  value: string;
  delta?: string;
  deltaType: "up" | "down" | "live";
}

export interface HourlyCheckIn {
  label: string;
  value: number;
}

export interface InterestStat {
  emoji: string;
  label: string;
  percentage: number;
}

export interface LocationData {
  slug: string;
  name: string;
  address: string;
  partnerId: string;
  joinedDate: string;
  capacity: string;
  timezone: string;
  isActive: boolean;
  qrToken: string;
  qrLabel: string;
}

export interface AdminProfile {
  name: string;
  role: string;
  plan: string;
  avatar: string;
}

// ── Admin Profile ──
export const MOCK_ADMIN: AdminProfile = {
  name: "Kopiloka Sudirman",
  role: "Partner",
  plan: "Pro Plan",
  avatar: "☕",
};

// ── Metrics ──
export const MOCK_METRICS: MetricData[] = [
  { label: "Check-in Hari Ini", value: "124", delta: "↑ 18% vs kemarin", deltaType: "up" },
  { label: "User Aktif Sekarang", value: "8", delta: "Live", deltaType: "live" },
  { label: "Total Konversasi Hari Ini", value: "342", delta: "↑ 32% vs kemarin", deltaType: "up" },
  { label: "Avg. Session", value: "24m", delta: "↓ 5% vs kemarin", deltaType: "down" },
];

// ── Hourly Check-ins ──
export const MOCK_HOURLY_CHECKINS: HourlyCheckIn[] = [
  { label: "08:00", value: 6 },
  { label: "09:00", value: 11 },
  { label: "10:00", value: 17 },
  { label: "11:00", value: 24 },
  { label: "12:00", value: 21 },
  { label: "13:00", value: 15 },
  { label: "14:00", value: 18 },
  { label: "15:00", value: 12 },
];

// ── Top Interests ──
export const MOCK_TOP_INTERESTS: InterestStat[] = [
  { emoji: "☕", label: "Kopi", percentage: 78 },
  { emoji: "💻", label: "Tech", percentage: 54 },
  { emoji: "📚", label: "Buku", percentage: 41 },
  { emoji: "🎵", label: "Musik", percentage: 33 },
  { emoji: "🍜", label: "Kuliner", percentage: 28 },
];

// ── Active Users ──
export const MOCK_USERS: AdminUser[] = [
  {
    id: "u-8f2a",
    name: "Andi Pratama",
    avatar: "🧑",
    gender: "Laki-laki",
    interests: [
      { emoji: "☕", label: "Kopi" },
      { emoji: "💻", label: "Tech" },
    ],
    duration: 45,
  },
  {
    id: "u-3c91",
    name: "Alya Rizki",
    avatar: "👩",
    gender: "Perempuan",
    interests: [
      { emoji: "☕", label: "Kopi" },
      { emoji: "📚", label: "Buku" },
    ],
    duration: 32,
  },
  {
    id: "u-7d18",
    name: "Bimo Saputra",
    avatar: "🧔",
    gender: "Laki-laki",
    interests: [
      { emoji: "💻", label: "Tech" },
      { emoji: "🎮", label: "Gaming" },
    ],
    duration: 28,
  },
  {
    id: "u-4b66",
    name: "Citra Anindya",
    avatar: "👩‍🎤",
    gender: "Perempuan",
    interests: [
      { emoji: "🎵", label: "Musik" },
      { emoji: "🎨", label: "Seni" },
    ],
    duration: 17,
  },
  {
    id: "u-1a05",
    name: "Dani Kurniawan",
    avatar: "🧑‍💼",
    gender: "Laki-laki",
    interests: [
      { emoji: "💻", label: "Tech" },
      { emoji: "💼", label: "Bisnis" },
    ],
    duration: 12,
  },
  {
    id: "u-9e44",
    name: "Erika Putri",
    avatar: "👩‍🍳",
    gender: "Perempuan",
    interests: [
      { emoji: "🍜", label: "Kuliner" },
      { emoji: "✈️", label: "Travel" },
    ],
    duration: 8,
  },
];

// ── Location Data ──
export const MOCK_LOCATION: LocationData = {
  slug: "kopiloka-sudirman",
  name: "Kopiloka Sudirman",
  address: "Jl. Jend. Sudirman No. 123, Jakarta Selatan",
  partnerId: "KPL-001",
  joinedDate: "12 Februari 2026",
  capacity: "~ 40 user",
  timezone: "WIB · UTC+7",
  isActive: true,
  qrToken: "kpl-001-m1-a8f4",
  qrLabel: "Meja 1 · Kopiloka Sudirman",
};
