"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MobileLayout from "@/components/layout/MobileLayout";
import BottomNav from "@/components/layout/BottomNav";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import NotificationCard from "@/components/ui/NotificationCard";
import { useAppStore } from "@/store/useAppStore";
import { wsClient, useWsEvent } from "@/lib/ws";
import { EV, type NotificationDTO } from "@/lib/wsTypes";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

// Group invite descriptions look like: `Budi mengundangmu ke "Kopi Gacor"`.
function extractGroupName(desc: string): string {
  const m = desc.match(/"([^"]+)"/);
  return m ? m[1] : "Group Session";
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const location = (params.location as string) ?? "";

  const name = useAppStore((s) => s.name);
  const sessionToken = useAppStore((s) => s.sessionToken);
  const setGroup = useAppStore((s) => s.setGroup);
  const setUnreadNotif = useAppStore((s) => s.setUnreadNotif);
  const reset = useAppStore((s) => s.reset);
  const blockedUsers = useAppStore((s) => s.blockedUsers);
  const unblockUser = useAppStore((s) => s.unblockUser);
  const displayName = name || "User";

  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);

  // Viewing this page means the user has seen their notifications — drop the
  // unread dot on the Profile tab.
  useEffect(() => {
    setUnreadNotif(false);
  }, [setUnreadNotif]);

  // Load persisted notifications on mount.
  useEffect(() => {
    if (!sessionToken) return;
    const fetchNotifs = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/notifications`, {
          headers: { Authorization: `Bearer ${sessionToken}` },
        });
        if (!res.ok) return;
        const data: { notifications: NotificationDTO[] } = await res.json();
        setNotifications(data.notifications ?? []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifs();
  }, [sessionToken]);

  // Live notifications (new messages / group invites) arrive over WS. We're
  // already on the Profile page, so they're seen immediately — keep the dot off.
  useWsEvent<NotificationDTO>(EV.NEW_NOTIFICATION, (data) => {
    setNotifications((prev) =>
      prev.some((n) => n.id === data.id) ? prev : [data, ...prev]
    );
    setUnreadNotif(false);
  });

  const markRead = (id: string) => {
    wsClient.send("notification_read", { notificationId: id });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleAccept = (n: NotificationDTO) => {
    if (n.type === "group_invite" && n.groupId) {
      setGroup(n.groupId, { name: extractGroupName(n.description), iAmHost: false });
      wsClient.send("accept_group_invite", { groupId: n.groupId });
      // The invite is resolved — drop it immediately (the server also deletes it
      // so it won't come back on a re-fetch).
      setNotifications((prev) => prev.filter((item) => item.id !== n.id));
      router.push(`/${location}/group/${n.groupId}`);
    }
  };

  const handleReject = (n: NotificationDTO) => {
    markRead(n.id);
    // Let the host know their group invite was declined.
    if (n.type === "group_invite" && n.groupId) {
      wsClient.send("reject_group_invite", { groupId: n.groupId });
    }
    setNotifications((prev) => prev.filter((item) => item.id !== n.id));
  };

  // Remove a notification everywhere: from the list now, and from the DB so it
  // doesn't reappear on a re-fetch.
  const dismissNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    wsClient.send("dismiss_notification", { notificationId: id });
  };

  // Tapping a notification means the user has read it → it disappears. For a
  // message notification we also open the DM with the sender.
  const handleNotifTap = (n: NotificationDTO) => {
    dismissNotif(n.id);
    if (n.type === "message" && n.senderId) {
      router.push(`/${location}/chat/${n.senderId}`);
    }
  };

  // Lift a block: stop hiding them + tell the server to deliver their messages
  // again. They reappear in lists/chat from here on (this session).
  const handleUnblock = (userId: string) => {
    unblockUser(userId);
    wsClient.send("unblock_user", { userId });
  };

  const handleLogout = async () => {
    // Tell the backend we're leaving (marks session inactive, blacklists token).
    try {
      if (sessionToken) {
        await fetch(`${API_BASE}/api/sessions/logout`, {
          headers: { Authorization: `Bearer ${sessionToken}` },
        });
      }
    } catch (err) {
      console.error(err);
    }
    // Close the live socket so the backend stops seeing us as online.
    wsClient.disconnect();
    reset();
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
        <h1 className="pf-profile__name">{displayName}</h1>
      </div>

      {/* ── Section label ── */}
      <p className="pf-section-label">NOTIFIKASI</p>

      {/* ── Notification list ── */}
      <div className="pf-notif-list hide-scrollbar">
        {notifications.length > 0 ? (
          notifications.map((n) => (
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
              onPrimaryAction={() => handleAccept(n)}
              onSecondaryAction={() => handleReject(n)}
              onClick={
                // Group invites are resolved via Gabung/Tolak, not by tapping;
                // every other notification dismisses on tap (it's been read).
                n.type === "group_invite"
                  ? undefined
                  : () => handleNotifTap(n)
              }
            />
          ))
        ) : (
          <p className="pf-notif-empty">Belum ada notifikasi</p>
        )}
      </div>

      {/* ── Blocked users section ── */}
      <p className="pf-section-label">DIBLOKIR</p>
      <div className="pf-block-list hide-scrollbar">
        {blockedUsers.length > 0 ? (
          blockedUsers.map((u) => (
            <div key={u.id} className="pf-block-card">
              <div className="pf-block-card__left">
                <div className="pf-block-card__avatar">{u.emoji}</div>
                <span className="pf-block-card__name">{u.name}</span>
              </div>
              <button
                type="button"
                className="pf-block-card__btn"
                onClick={() => handleUnblock(u.id)}
              >
                Buka Blokir
              </button>
            </div>
          ))
        ) : (
          <p className="pf-notif-empty">Tidak ada yang diblokir</p>
        )}
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
          min-height: 0;
          padding: 0 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
        }

        .pf-notif-empty {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
          text-align: center;
          padding: 32px 20px;
        }

        /* Blocked users list */
        .pf-block-list {
          position: relative;
          z-index: 1;
          flex-shrink: 0;
          max-height: 168px;
          padding: 0 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow-y: auto;
        }

        .pf-block-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: rgba(255, 255, 255, 0.055);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          padding: 10px 12px;
        }

        .pf-block-card__left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .pf-block-card__avatar {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
          background: linear-gradient(
            135deg,
            rgba(120, 120, 130, 0.35),
            rgba(80, 80, 90, 0.25)
          );
          border: 1px solid rgba(255, 255, 255, 0.08);
          filter: grayscale(0.4);
        }

        .pf-block-card__name {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pf-block-card__btn {
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 20px;
          padding: 7px 14px;
          font-size: 12.5px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition: background 0.15s ease;
        }

        .pf-block-card__btn:active {
          background: rgba(255, 255, 255, 0.18);
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
