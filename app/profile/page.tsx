"use client";

import React from "react";
import { useRouter } from "next/navigation";
import MobileLayout from "@/components/layout/MobileLayout";
import BottomNav from "@/components/layout/BottomNav";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import NotificationCard from "@/components/ui/NotificationCard";

/* ──────────────────────────────────────────
   Mock data — will be replaced by Zustand / API
   ────────────────────────────────────────── */

const MOCK_PROFILE = {
  name: "Kevin N",
};

interface Notification {
  id: string;
  type: "message" | "group_invite" | "chat_request" | "system";
  emoji: string;
  avatarGradient: string;
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  primaryLabel?: string;
  secondaryLabel?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "message",
    emoji: "👩",
    avatarGradient: "linear-gradient(135deg, #f97316, #ec4899)",
    title: "Tanti mengirim pesan",
    description: '"Buset ini AI tambah canggih aja ya"',
    timestamp: "09:41",
    unread: true,
  },
  {
    id: "n2",
    type: "group_invite",
    emoji: "☕",
    avatarGradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    title: "Undangan Group Session",
    description: 'Ken O mengundangmu ke "Kopi Gacor"',
    timestamp: "09:38",
    unread: true,
    primaryLabel: "Gabung",
    secondaryLabel: "Tolak",
  },
];

/* ──────────────────────────────────────────
   Component
   ────────────────────────────────────────── */

export default function ProfilePage() {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: clear Zustand state / session
    router.push("/");
  };

  return (
    <MobileLayout showGlow={false}>
      {/* ── Background orb ── */}
      <div className="pf-orbs" aria-hidden="true">
        <div className="pf-orbs__blue" />
      </div>

      {/* ── Profile section ── */}
      <div className="pf-profile">
        <ProfileAvatar />
        <h1 className="pf-profile__name">{MOCK_PROFILE.name}</h1>
      </div>

      {/* ── Section label ── */}
      <p className="pf-section-label">NOTIFIKASI</p>

      {/* ── Notification list ── */}
      <div className="pf-notif-list hide-scrollbar">
        {MOCK_NOTIFICATIONS.map((n) => (
          <NotificationCard
            key={n.id}
            emoji={n.emoji}
            avatarGradient={n.avatarGradient}
            title={n.title}
            description={n.description}
            timestamp={n.timestamp}
            unread={n.unread}
            primaryLabel={n.primaryLabel}
            secondaryLabel={n.secondaryLabel}
            onPrimaryAction={() => {
              /* TODO: handle accept */
            }}
            onSecondaryAction={() => {
              /* TODO: handle reject */
            }}
          />
        ))}
      </div>

      {/* ── Logout button ── */}
      <div className="pf-logout-wrap">
        <button
          type="button"
          className="pf-logout"
          onClick={handleLogout}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#ff6b6b"
            aria-hidden="true"
          >
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
          </svg>
          Log Out
        </button>
      </div>

      {/* ── Bottom Nav ── */}
      <BottomNav />

      {/* ── Spacer ── */}
      <div className="pf-spacer" />

      <style jsx>{`
        /* Background orb */
        .pf-orbs {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .pf-orbs__blue {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(56, 100, 255, 0.35) 0%,
            transparent 70%
          );
          top: -80px;
          right: -60px;
        }

        /* Profile */
        .pf-profile {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 32px 24px 20px;
        }

        .pf-profile__name {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin-top: 12px;
        }

        /* Section label */
        .pf-section-label {
          position: relative;
          z-index: 1;
          padding: 0 24px 10px;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        /* Notification list */
        .pf-notif-list {
          position: relative;
          z-index: 1;
          flex: 1;
          padding: 0 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
        }

        /* Logout */
        .pf-logout-wrap {
          position: relative;
          z-index: 1;
          padding: 14px 16px 10px;
          flex-shrink: 0;
        }

        .pf-logout {
          width: 100%;
          background: rgba(255, 70, 70, 0.12);
          color: #ff6b6b;
          border: 1px solid rgba(255, 70, 70, 0.25);
          border-radius: 14px;
          padding: 13px;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          -webkit-tap-highlight-color: transparent;
          transition: background 0.15s ease;
        }

        .pf-logout:active {
          background: rgba(255, 70, 70, 0.2);
        }

        /* Spacer for bottom nav */
        .pf-spacer {
          height: 64px;
          flex-shrink: 0;
        }
      `}</style>
    </MobileLayout>
  );
}
