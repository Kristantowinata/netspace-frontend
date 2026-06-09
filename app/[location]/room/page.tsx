"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MobileLayout from "@/components/layout/MobileLayout";
import BottomNav from "@/components/layout/BottomNav";
import UserCard from "@/components/ui/UserCard";
import PublicRoomCard from "@/components/ui/PublicRoomCard";
import UserProfileDrawer from "@/components/ui/UserProfileDrawer";
import { useAppStore } from "@/store/useAppStore";
import { useWsEvent } from "@/lib/ws";
import { EV, type UserJoinedEvent, type UserLeftEvent } from "@/lib/wsTypes";

interface Interest {
  emoji: string;
  label: string;
}

interface MockUser {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  occupation: string;
  interests: Interest[];
}

interface GetUsersResponse {
  users: MockUser[];
  onlineCount: number;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

function formatLocationName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const location = (params.location as string) ?? "public";
  const locationName = formatLocationName(location);

  const [activeTab, setActiveTab] = useState("Semua");
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);

  const sessionToken = useAppStore((s) => s.sessionToken);
  const myId = useAppStore((s) => s.userId);
  const blockedIds = useAppStore((s) => s.blockedIds);
  const unreadPublic = useAppStore((s) => s.unreadPublic);

  const [users, setUsers] = useState<MockUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_BASE}/api/locations/${location}/users`,
          {
            headers: sessionToken
              ? { Authorization: `Bearer ${sessionToken}` }
              : undefined,
          },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data: GetUsersResponse = await res.json();

        setUsers(data.users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [location, sessionToken]);

  /* ──────────────────────────────────────────
     Live roster — people checking in / leaving update the list and the
     online badge in real time, without a manual refresh.
     ────────────────────────────────────────── */

  useWsEvent<UserJoinedEvent>(EV.USER_JOINED, (data) => {
    const u = data.user;
    // Ignore self and anyone this user has blocked — a blocked person must not
    // reappear in the roster just because they (re)joined.
    if (!u?.id || u.id === myId || blockedIds.includes(u.id)) return;
    setUsers((prev) =>
      prev.some((p) => p.id === u.id)
        ? prev
        : [
            ...prev,
            {
              id: u.id,
              slug: u.slug,
              name: u.name,
              emoji: u.emoji,
              occupation: u.occupation ?? "",
              interests: u.interests ?? [],
            },
          ]
    );
  });

  useWsEvent<UserLeftEvent>(EV.USER_LEFT, (data) => {
    setUsers((prev) => prev.filter((p) => p.id !== data.userId));
  });

  /* ──────────────────────────────────────────
     Roster the viewer is allowed to see — blocked users are removed entirely,
     so they vanish from the list, the interest tabs, and the online count
     (WhatsApp-style: a blocked person disappears from your view). blockedIds is
     persisted in sessionStorage, so they stay hidden across refreshes too.
     ────────────────────────────────────────── */

  const roster = useMemo(
    () => users.filter((u) => !blockedIds.includes(u.id)),
    [users, blockedIds]
  );

  const onlineCount = roster.length;

  /* ──────────────────────────────────────────
     Dynamic interests
     ────────────────────────────────────────── */

  const uniqueInterests = useMemo(() => {
    const seen = new Map<string, Interest>();

    roster.forEach((u) =>
      u.interests.forEach((i) => {
        if (!seen.has(i.label)) seen.set(i.label, i);
      })
    );

    return Array.from(seen.values());
  }, [roster]);

  /* ──────────────────────────────────────────
     Filter users by tab
     ────────────────────────────────────────── */

  const filteredUsers = useMemo(() => {
    if (activeTab === "Semua") return roster;

    return roster.filter((u) =>
      u.interests.some((i) => i.label === activeTab)
    );
  }, [activeTab, roster]);

  /* ──────────────────────────────────────────
     UI
     ────────────────────────────────────────── */

  if (loading) {
    return (
      <MobileLayout>
        <div className="p-4 text-white">Loading...</div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout showGlow={false}>
      {/* ── Background orbs ── */}
      <div className="room-orbs" aria-hidden="true">
        <div className="room-orbs__blue" />
        <div className="room-orbs__purple" />
      </div>

      {/* ── Header ── */}
      <header className="room-header glass-strong">
        <div className="room-header__top">
          <div className="room-header__left">
            <p className="room-header__location">📍 {locationName}</p>
            <h1 className="room-header__title">Siapa di sini?</h1>
          </div>
          <div className="room-header__badge">
            <span className="room-header__dot" />
            <span className="room-header__count">{onlineCount} online</span>
          </div>
        </div>

        {/* Tab filter */}
        <div className="room-tabs hide-scrollbar">
          {/* "Semua" tab */}
          <button
            type="button"
            className={`room-tabs__tab ${activeTab === "Semua" ? "room-tabs__tab--active" : ""}`}
            onClick={() => setActiveTab("Semua")}
          >
            Semua
          </button>

          {/* Dynamic interest tabs */}
          {uniqueInterests.map((interest) => (
            <button
              key={interest.label}
              type="button"
              className={`room-tabs__tab ${activeTab === interest.label ? "room-tabs__tab--active" : ""}`}
              onClick={() => setActiveTab(interest.label)}
            >
              {interest.emoji} {interest.label}
            </button>
          ))}
        </div>
      </header>

      {/* ── User list ── */}
      <main className="room-list hide-scrollbar">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              name={user.name}
              emoji={user.emoji}
              interests={user.interests}
              onChat={() => router.push(`/${location}/chat/${user.id}`)}
              onTap={() => setSelectedUser(user)}
            />
          ))
        ) : (
          <div className="room-list__empty">
            <p className="room-list__empty-emoji">🔍</p>
            <p className="room-list__empty-text">
              Belum ada yang punya interest ini di sini
            </p>
          </div>
        )}
      </main>

      {/* ── Public Room (sticky) ── */}
      <div className="room-public-sticky">
        <PublicRoomCard
          onJoin={() => router.push(`/${location}/room/public`)}
          unreadCount={unreadPublic}
        />
      </div>

      {/* ── Bottom Nav ── */}
      <BottomNav />

      {/* ── Spacer for fixed elements ── */}
      <div className="room-spacer" />

      {/* ── User Profile Drawer ── */}
      {selectedUser && (
        <UserProfileDrawer
          isOpen={true}
          name={selectedUser.name}
          emoji={selectedUser.emoji}
          occupation={selectedUser.occupation}
          interests={selectedUser.interests}
          onClose={() => setSelectedUser(null)}
          onChat={() => {
            setSelectedUser(null);
            router.push(`/${location}/chat/${selectedUser.id}`);
          }}
        />
      )}

      <style jsx>{`
        /* Background orbs */
        .room-orbs {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .room-orbs__blue {
          position: absolute;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(80, 130, 255, 0.42) 0%,
            transparent 70%
          );
          top: -60px;
          left: -60px;
        }

        .room-orbs__purple {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(130, 70, 255, 0.35) 0%,
            transparent 70%
          );
          bottom: 80px;
          right: -40px;
        }

        /* Header */
        .room-header {
          position: relative;
          z-index: 2;
          padding: 16px 20px 0;
          border-bottom: 1px solid var(--glass-border);
        }

        .room-header__top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .room-header__left {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .room-header__location {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.65);
          font-weight: 600;
        }

        .room-header__title {
          font-size: 20px;
          font-weight: 800;
          color: white;
        }

        .room-header__badge {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.3);
          padding: 6px 12px;
          border-radius: 50px;
          flex-shrink: 0;
        }

        .room-header__dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4ade80;
        }

        .room-header__count {
          font-size: 12px;
          font-weight: 700;
          color: #4ade80;
        }

        /* Tabs */
        .room-tabs {
          display: flex;
          gap: 2px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .room-tabs__tab {
          padding: 7px 16px;
          color: rgba(255, 255, 255, 0.48);
          font-size: 13px;
          font-weight: 500;
          border: none;
          background: transparent;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
          flex-shrink: 0;
          transition: color 0.2s ease, border-color 0.2s ease,
            background 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .room-tabs__tab--active {
          color: white;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.1);
          border-bottom-color: #6ac8ff;
          border-radius: 10px 10px 0 0;
        }

        /* User list */
        .room-list {
          position: relative;
          z-index: 1;
          flex: 1;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
        }

        .room-list__empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 40px 20px;
        }

        .room-list__empty-emoji {
          font-size: 40px;
        }

        .room-list__empty-text {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.45);
          text-align: center;
          line-height: 1.5;
        }

        /* Public Room sticky */
        .room-public-sticky {
          position: fixed;
          bottom: 64px;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 390px;
          padding: 0 14px 10px;
          z-index: 10;
          pointer-events: none;
        }

        .room-public-sticky > :global(*) {
          pointer-events: auto;
        }

        /* Spacer for fixed public room + bottom nav */
        .room-spacer {
          height: 160px;
          flex-shrink: 0;
        }

        @media (min-width: 430px) {
          .room-public-sticky {
            bottom: 64px;
          }
        }
      `}</style>
    </MobileLayout>
  );
}
