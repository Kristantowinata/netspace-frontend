"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
   Tab definitions
   ---------------------------------------- */

const TABS: NavTab[] = [
  {
    key: "home",
    label: "Home",
    href: "/room/public",
    iconActive: "/Assets/home_active.png",
    iconInactive: "/Assets/home_inactive.png",
    matchPrefixes: ["/room", "/identity", "/interests"],
  },
  {
    key: "chat",
    label: "Chat",
    href: "/chats",
    iconActive: "/Assets/chat_active.png",
    iconInactive: "/Assets/chat_inactive.png",
    matchPrefixes: ["/chats", "/chat/", "/group/"],
  },
  {
    key: "profile",
    label: "Profil",
    href: "/profile",
    iconActive: "/Assets/profil_active.png",
    iconInactive: "/Assets/profil_inactive.png",
    matchPrefixes: ["/profile"],
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export default function BottomNav({ chatUnread = false }: BottomNavProps) {
  const pathname = usePathname();

  const isActive = (tab: NavTab): boolean =>
    tab.matchPrefixes.some((prefix) => pathname.startsWith(prefix));

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
