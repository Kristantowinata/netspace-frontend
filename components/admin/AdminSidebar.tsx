"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminStore } from "@/store/useAdminStore";

interface AdminSidebarProps {
  location: string;
  locationName: string;
  locationAvatar: string;
}

export default function AdminSidebar({ location, locationName, locationAvatar }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAdminStore((s) => s.logout);

  const NAV_ITEMS = [
    { href: `/${location}/admin/analytics`, icon: "📊", label: "Analytics" },
    { href: `/${location}/admin/lokasi`, icon: "📍", label: "Lokasi & QR" },
    { href: `/${location}/admin/users`, icon: "👥", label: "Users Aktif" },
  ];

  const handleLogout = () => {
    logout();
    router.push(`/${location}/admin/login`);
  };

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__logo">{locationAvatar}</div>
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-name">{locationName}</span>
          <span className="sidebar__brand-sub">Admin Dashboard</span>
        </div>
      </div>

      {/* Divider */}
      <div className="sidebar__divider" />

      {/* Label */}
      <span className="sidebar__section-label">MENU</span>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
            >
              <span className="sidebar__ico">{item.icon}</span>
              <span className="sidebar__link-text">{item.label}</span>
              {isActive && <span className="sidebar__active-indicator" />}
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="sidebar__spacer" />

      {/* Footer */}
      <div className="sidebar__footer">
        <div className="sidebar__divider" />
        <button
          type="button"
          className="sidebar__logout"
          onClick={handleLogout}
        >
          <span className="sidebar__ico">⎋</span>
          <span className="sidebar__link-text">Logout</span>
        </button>
      </div>

      <style jsx>{`
        .sidebar {
          position: sticky;
          top: 0;
          height: 100vh;
          width: var(--admin-sidebar-width, 260px);
          min-width: var(--admin-sidebar-width, 260px);
          display: flex;
          flex-direction: column;
          padding: 20px 14px;
          background: rgba(8, 12, 28, 0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          z-index: 20;
        }

        /* Brand */
        .sidebar__brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 10px;
          margin-bottom: 8px;
        }

        .sidebar__logo {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(79, 110, 255, 0.2), rgba(122, 80, 255, 0.15));
          border: 1px solid rgba(79, 110, 255, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .sidebar__brand-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .sidebar__brand-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--admin-text, #fff);
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar__brand-sub {
          font-size: 11px;
          font-weight: 500;
          color: var(--admin-text-muted, #94A3B8);
          letter-spacing: 0.02em;
        }

        /* Divider */
        .sidebar__divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          margin: 8px 10px;
        }

        /* Section label */
        .sidebar__section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: rgba(148, 163, 184, 0.5);
          padding: 10px 14px 6px;
        }

        /* Nav */
        .sidebar__nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar__link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--admin-text-muted, #94A3B8);
          text-decoration: none;
          transition: all 0.2s ease;
          overflow: hidden;
        }

        .sidebar__link:hover {
          color: var(--admin-text-body, #CBD5E1);
          background: rgba(255, 255, 255, 0.03);
        }

        .sidebar__link--active {
          color: var(--admin-text, #fff);
          background: rgba(79, 110, 255, 0.1);
          font-weight: 600;
        }

        .sidebar__active-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          border-radius: 0 3px 3px 0;
          background: linear-gradient(180deg, #4F6EFF, #7aa8ff);
          box-shadow: 0 0 12px rgba(79, 110, 255, 0.5);
        }

        .sidebar__ico {
          font-size: 16px;
          width: 22px;
          text-align: center;
          flex-shrink: 0;
        }

        .sidebar__link-text {
          white-space: nowrap;
        }

        .sidebar__spacer {
          flex: 1;
        }

        /* Footer */
        .sidebar__footer {
          margin-top: auto;
        }

        .sidebar__logout {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          font-family: inherit;
          color: rgba(248, 113, 113, 0.8);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sidebar__logout:hover {
          background: rgba(248, 113, 113, 0.06);
          color: var(--admin-danger, #F87171);
        }
      `}</style>
    </aside>
  );
}
