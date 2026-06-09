"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface BottomNavProps {
  chatUnread?: boolean;
}

interface NavTab {
  key: string;
  label: string;
  href: string;
  iconActive: string;
  iconInactive: string;
  /** Pathname prefixes that mark this tab as active */
  matchPrefixes: string[];
}


/* ----------------------------------------
   Component
   ---------------------------------------- */


export default function BottomNav({ chatUnread = false }: BottomNavProps) {
  const pathname = usePathname();
  const location = useAppStore((s) => s.location);
  const hasUnreadNotif = useAppStore((s) => s.hasUnreadNotif);

  const TABS: NavTab[] = [
    {
      key: "home",
      label: "Home",
      href: `/${location}/room`,
      iconActive: "/Assets/home_active.png",
      iconInactive: "/Assets/home_inactive.png",
      matchPrefixes: [`/${location}/room`, `/${location}/identity`, `/${location}/interests`],
    },
    {
      key: "chat",
      label: "Chat",
      href: `/${location}/chats`,
      iconActive: "/Assets/chat_active.png",
      iconInactive: "/Assets/chat_inactive.png",
      matchPrefixes: [`/${location}/chats`, `/${location}/chat/`, `/${location}/group/`, `/${location}/room/public`],
    },
    {
      key: "profile",
      label: "Profil",
      href: `/${location}/profile`,
      iconActive: "/Assets/profil_active.png",
      iconInactive: "/Assets/profil_inactive.png",
      matchPrefixes: [`/${location}/profile`],
    },
  ];

  // Longest-prefix-match: e.g. /room/public (13 chars) beats /room (5 chars)
  const activeTabKey = (() => {
    let bestKey = "";
    let bestLen = 0;
    for (const tab of TABS) {
      for (const prefix of tab.matchPrefixes) {
        if (pathname.startsWith(prefix) && prefix.length > bestLen) {
          bestKey = tab.key;
          bestLen = prefix.length;
        }
      }
    }
    return bestKey;
  })();

  const isActive = (tab: NavTab): boolean => tab.key === activeTabKey;

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {TABS.map((tab) => {
        const active = isActive(tab);

        return (
          <Link key={tab.key} href={tab.href} className="bottom-nav__tab">
            <span className="bottom-nav__icon-wrapper">
              <Image
                src={active ? tab.iconActive : tab.iconInactive}
                alt={tab.label}
                width={24}
                height={24}
                className="bottom-nav__icon"
              />

              {/* Unread dot — only on chat tab */}
              {tab.key === "chat" && chatUnread && (
                <span className="bottom-nav__unread-dot" aria-label="Unread messages" />
              )}

              {/* Unread dot — profile tab, for pending notifications.
                  Hidden while Profile is the active tab (you're looking at them). */}
              {tab.key === "profile" && hasUnreadNotif && !active && (
                <span className="bottom-nav__unread-dot" aria-label="Notifikasi baru" />
              )}
            </span>

            <span
              className="bottom-nav__label"
              style={{
                color: active
                  ? "var(--accent-primary)"
                  : "var(--text-muted)",
              }}
            >
              {tab.label}
            </span>

            {/* Active indicator dot */}
            {active && <span className="bottom-nav__active-dot" />}
          </Link>
        );
      })}

      <style jsx>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 390px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          height: 64px;
          background-color: var(--bg-card);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid var(--border);
          z-index: 50;
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }

        .bottom-nav__tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          flex: 1;
          padding: 8px 0 4px;
          text-decoration: none;
          position: relative;
          -webkit-tap-highlight-color: transparent;
          transition: opacity 0.15s ease;
        }

        .bottom-nav__tab:active {
          opacity: 0.7;
        }

        .bottom-nav__icon-wrapper {
          position: relative;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bottom-nav__label {
          font-size: 11px;
          font-weight: 500;
          line-height: 1;
          transition: color 0.2s ease;
        }

        .bottom-nav__active-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: var(--accent-primary);
          margin-top: 2px;
        }

        .bottom-nav__unread-dot {
          position: absolute;
          top: -2px;
          right: -4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--danger-text);
          border: 1.5px solid var(--bg-card);
        }
      `}</style>
    </nav>
  );
}
