# NetSpace — Frontend

**NetSpace** is a location‑based, ephemeral social app for cafés. A visitor scans the café's QR code, gets gated by GPS (they must physically be at the venue), checks in with a quick profile, and can then see who else is there and chat — public room, direct messages, and group chats. All session data is purged when they leave.

This repository is the **web client** (Next.js). It talks to the [NetSpace backend](#-backend-connection) over REST + WebSocket.

> **Note:** geolocation requires **HTTPS** (works on `localhost` and on any HTTPS domain — not on plain‑HTTP LAN IPs).

---

## ✨ Features

- 📍 **Location gate** — you can only enter when you're physically inside the café's geofence (GPS).
- 👋 **Presence** — see who's currently at the venue, filter by interests, real‑time join/leave.
- 💬 **Chat** — public room, 1‑to‑1 DMs (with WhatsApp‑style read receipts), and group chats (create, rename, invite, leave).
- 🔔 **Notifications** — incoming‑DM toast, group invites, tap‑to‑dismiss.
- 🚫 **Block / unblock** — session‑scoped, person‑to‑person.
- 🕒 **Auto‑logout** — after 30 min idle, or when you leave the venue's geofence.
- 🛠️ **Admin panel** — per café: live analytics, active users, force‑logout, and a **QR generator** (PNG/SVG) for the venue.

---

## 🧪 Trying it out (demo)

> 🧪 **This deployment runs in DEMO mode** (`lib/demo.ts`). The app normally **gates entry on GPS** — you must be physically inside the café's geofence — but in demo mode the gate **self‑anchors on *your* position**, so anyone can get in from anywhere while the GPS "you must be at the venue" UX stays visible. Walk ~150 m away and you'll still be logged out — that's the location feature in action. For a real café, set `DEMO_MODE = false`.

### Admin panel
Open `/<slug>/admin/login` and sign in with the demo credentials:

| Café | URL | Username | Password |
|---|---|---|---|
| Kopiloka | `/kopiloka/admin/login` | `kopiloka` | `admin123` |
| Koktong | `/koktong/admin/login` | `koktong` | `admin123` |
| Kopi Braga | `/kopi-braga/admin/login` | `kopibraga` | `admin123` |

> 🔓 **Demo credentials only — change them in production.** With these you can view analytics, manage active users, and download the venue QR.

### Letting yourself in from anywhere (testing the location gate)
When running locally, open **`lib/geofence.ts`** and point the override at your own spot — or use a giant radius so you're always "inside":

```ts
// Option 1 — center on your coordinates
export const GEOFENCE_OVERRIDE = { lat: <your-lat>, lng: <your-lng>, radius: 100 };

// Option 2 — effectively disable the gate (everyone is "inside")
export const GEOFENCE_OVERRIDE = { lat: 0, lng: 0, radius: 20_000_000 };
```

Get your coordinates in the browser console:
```js
navigator.geolocation.getCurrentPosition(p => console.log(p.coords.latitude, p.coords.longitude));
```
See the full [Geofence section](#-geofence--coordinates--radius-read-this-to-try--change-it) for `GEOFENCE_TEST_MODE` and production settings.

---

## 🧱 Tech Stack

| Area | Tech |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) |
| UI | **React 19**, TypeScript (strict) |
| Styling | **Tailwind CSS 4** + scoped `styled-jsx` |
| State | **Zustand 5** (with `sessionStorage` persistence) |
| Realtime | Native **WebSocket** client (singleton, auto‑reconnect) |
| QR codes | **qrcode.react** |
| Location | Browser **Geolocation API** |

---

## 📁 Project Structure

```
app/[location]/            # All venue pages are scoped by café slug
  page.tsx                 # Entry: the GPS location gate (scan-QR landing)
  identity/ interests/     # Check-in flow
  room/  room/public/      # "Who's here" + public chat room
  chat/[userId]/           # 1-to-1 DM
  group/[groupId]/         # Group chat
  chats/  profile/         # Chat list + profile/notifications/blocked
  admin/                   # Admin panel (analytics, users, lokasi+QR, login)
lib/
  ws.ts                    # WebSocket client + React hooks
  wsTypes.ts               # Wire-format types (mirror the Go api package)
  geofence.ts              # 📍 Geofence config + helpers (see below)
  useGeofenceLogout.ts     # Continuous "left the venue" logout
  useIdleLogout.ts         # 30-min idle logout
store/                     # Zustand stores (app + admin)
components/                # UI components (chat bubbles, modals, admin, …)
```

---

## 🚀 Getting Started (local)

### Prerequisites
- **Node.js 20+**
- The **[NetSpace backend](#-backend-connection)** running (default `http://localhost:8080`) + its PostgreSQL.

### 1. Install
```bash
npm install
```

### 2. Configure environment
Create **`.env.local`** in the project root:
```bash
# URL of the Go backend (REST + WebSocket)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# Canonical app URL — used to build the QR code links in the admin panel
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
> `.env*` is git‑ignored — never commit it. In production set these in your host (e.g. Vercel) Project Settings.

### 3. Run
```bash
npm run dev      # dev server on http://localhost:3000
```
Then open one of the seeded venues, e.g. **http://localhost:3000/kopiloka**.

Other scripts:
```bash
npm run build    # production build
npm start        # run the production build
npm run lint     # lint
```

> **Local tip:** on `localhost` the browser allows geolocation over plain HTTP, so the gate works without HTTPS. To test from a phone you need an HTTPS URL (deploy, or use a tunnel like cloudflared/ngrok).

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | ✅ | Base URL of the backend, e.g. `https://api.example.com`. The WS client derives `wss://` from `https://` automatically. |
| `NEXT_PUBLIC_APP_URL` | ✅ | Canonical URL of this app, used to generate the venue QR links (`<APP_URL>/<slug>`). Falls back to the current origin if unset. |

`NEXT_PUBLIC_*` variables are inlined at **build time** — after changing them you must **rebuild / redeploy**.

---

## 📍 Geofence — Coordinates & Radius (read this to try / change it)

The whole app is gated on location: a visitor must be within **`radius` meters** of a café's coordinate to enter, and is logged out if they walk out. The logic lives in **`lib/geofence.ts`** and is shared by the entry gate and the continuous logout hook.

### Where the coordinates come from
Each café (a row in the backend `Locations` table) carries `latitude`, `longitude`, and `geofenceRadius`. The frontend fetches them via `GET /api/locations/{slug}`. **To change a venue's location/radius for real, update those DB columns** (see the backend README).

### `lib/geofence.ts` knobs

```ts
// false = production: accuracy-aware + fail-OPEN (a GPS glitch never blocks a real visitor)
// true  = testing:    raw distance (small radius works) + fail-CLOSED (no location = blocked)
export const GEOFENCE_TEST_MODE = false;

// Manual override for ALL venues (handy for testing). Set to null to use each
// venue's real DB coordinates instead.
export const GEOFENCE_OVERRIDE: GeofenceTarget | null = {
  lat: -6.200754,
  lng: 106.783913,
  radius: 40, // meters
};
```

- **Want to test the gate at your own desk?** Set `GEOFENCE_OVERRIDE` to your current spot and a small radius, then reload the app.
- **Going to production?** Set `GEOFENCE_TEST_MODE = false` **and** `GEOFENCE_OVERRIDE = null`, then set real per‑café coordinates in the database.

### How to get a coordinate
- **Google Maps:** right‑click the spot → the first item is `lat, lng`.
- **Your current position (browser console):**
  ```js
  navigator.geolocation.getCurrentPosition(p => console.log(p.coords.latitude, p.coords.longitude));
  ```

### Choosing a radius
- **Real café:** `30–50 m`. Phone GPS is typically accurate to 10–30 m, so a too‑small radius can wrongly block people who are actually inside.
- **Testing on foot:** `10 m` (only meaningful with `GEOFENCE_TEST_MODE = true`).

### Auto‑logout timing
- Idle logout: **30 min** of no interaction (`lib/useIdleLogout.ts`).
- Geofence logout: continuous, kicks in when you leave the radius (`lib/useGeofenceLogout.ts`).

---

## 🔌 Backend connection

This client expects the **Go backend** (separate repo). It uses:
- **REST** for check‑in, venue lookup, chat history, notifications, admin.
- **WebSocket** (`/ws?token=…&locationSlug=…`) for presence and live chat.

Point it at your backend with `NEXT_PUBLIC_API_BASE_URL`.

---

## 🗺️ QR Codes

Each café needs **one** static QR encoding `<NEXT_PUBLIC_APP_URL>/<slug>` (e.g. `https://app.example.com/kopiloka`). Generate & download it (PNG/SVG) from the admin panel:

```
/<slug>/admin/lokasi   →  log in (admin)  →  Download PNG / SVG
```

The QR is static and points straight at your domain — print it once and reuse it. Security comes from the **GPS geofence**, not from the QR being secret.

---

## 🏗️ Deploy (Vercel)

1. Import this repo into Vercel (framework auto‑detected as Next.js).
2. Set env vars: `NEXT_PUBLIC_API_BASE_URL` (your backend URL), `NEXT_PUBLIC_APP_URL` (your Vercel URL).
3. Deploy → HTTPS is provided automatically (required for geolocation on phones).
4. After the first deploy, make sure `NEXT_PUBLIC_APP_URL` matches the live URL, then redeploy so the QR links are correct.

---

## ✅ Before going fully public
- Set the geofence to production mode (above) and real per‑café coordinates.
- Make sure the backend's admin passwords and `JWT_SECRET_KEY` are **not** the dev defaults.
- Add a short privacy notice (the app uses precise location + a name/age).

---

## 📄 License

For educational / portfolio use.

---
note : admin pass = admin123
