"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminStore } from "@/store/useAdminStore";
import { getActiveUsers } from "@/services/adminApi";

interface AdminSidebarProps {
  location: string;
  locationName: string;
  locationAvatar: string;
}

export default function AdminSidebar({ location, locationName, locationAvatar }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAdminStore((s) => s.logout);
  const adminName = useAdminStore((s) => s.adminName);
  const adminRole = useAdminStore((s) => s.adminRole);
  const adminAvatar = useAdminStore((s) => s.adminAvatar);

  const [activeUsersCount, setActiveUsersCount] = useState<number | null>(null);

  useEffect(() => {
    // Initial fetch
    getActiveUsers().then((data) => {
      setActiveUsersCount(data.length);
    }).catch(() => {});

    // Poll every 15 seconds to keep sidebar badge fresh
    const interval = setInterval(() => {
      getActiveUsers().then((data) => {
        setActiveUsersCount(data.length);
      }).catch(() => {});
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const NAV_ITEMS = [
    {
      href: `/${location}/admin/analytics`,
      label: "Analytics",
      icon: (
        <svg className="sidebar__ico-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
      )
    },
    {
      href: `/${location}/admin/lokasi`,
      label: "Lokasi & QR",
      icon: (
        <svg className="sidebar__ico-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <rect x="7" y="7" width="3" height="3" />
          <rect x="14" y="7" width="3" height="3" />
          <rect x="7" y="14" width="3" height="3" />
          <path d="M14 14h3v3h-3z" />
        </svg>
      )
    },
    {
      href: `/${location}/admin/users`,
      label: "Users Aktif",
      icon: (
        <svg className="sidebar__ico-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
  ];

  const handleLogout = () => {
    logout();
    router.push(`/${location}/admin/login`);
  };

  return (
    <aside className="sidebar">
      {/* Platform Branding */}
      <div className="sidebar__brand">
        <div className="sidebar__logo-container">
          <svg className="sidebar__logo-svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="url(#logoGrad)" strokeWidth="2.5" />
            <path d="M12 7L16 12L12 17L8 12Z" fill="url(#logoGrad)" />
            <defs>
              <linearGradient id="logoGrad" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4F6EFF" />
                <stop offset="1" stopColor="#7aa8ff" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-platform">NETSPACE</span>
          <span className="sidebar__brand-sub">PORTAL PARTNER</span>
        </div>
      </div>

      {/* Workspace / Location Switcher Indicator */}
      <div className="sidebar__location-card">
        <div className="sidebar__location-avatar">
          {locationAvatar}
        </div>
        <div className="sidebar__location-info">
          <span className="sidebar__location-name" title={locationName}>
            {locationName}
          </span>
          <span className="sidebar__location-status">
            <span className="sidebar__status-dot" />
            Online
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="sidebar__divider" />

      {/* Label */}
      <span className="sidebar__section-label">NAVIGASI UTAMA</span>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const isUsersPage = item.label === "Users Aktif";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
            >
              <span className="sidebar__ico">{item.icon}</span>
              <span className="sidebar__link-text">{item.label}</span>
              {isUsersPage && activeUsersCount !== null && (
                <span className="sidebar__badge">{activeUsersCount}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="sidebar__spacer" />

      {/* Footer */}
      <div className="sidebar__footer">
        <div className="sidebar__divider" style={{ marginBottom: "16px" }} />
        
        {/* Logged in User Profile Card */}
        <div className="sidebar__user-profile">
          <div className="sidebar__user-avatar">
            {adminAvatar || "🧑‍💼"}
          </div>
          <div className="sidebar__user-info">
            <span className="sidebar__user-name" title={adminName || "Admin"}>
              {adminName || "Admin"}
            </span>
            <span className="sidebar__user-role">
              {adminRole || "Partner"}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="sidebar__logout"
          onClick={handleLogout}
        >
          <span className="sidebar__ico">
            <svg className="sidebar__ico-svg logout-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
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
          padding: 24px 16px;
          background: linear-gradient(180deg, rgba(10, 15, 34, 0.95) 0%, rgba(8, 12, 28, 0.98) 100%);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.02), 8px 0 32px rgba(0, 0, 0, 0.3);
          z-index: 20;
        }

        /* Brand */
        .sidebar__brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 8px;
          margin-bottom: 16px;
        }

        .sidebar__logo-container {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(79, 110, 255, 0.08);
          border: 1px solid rgba(79, 110, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(79, 110, 255, 0.15);
        }

        .sidebar__logo-svg {
          width: 20px;
          height: 20px;
        }

        .sidebar__brand-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .sidebar__brand-platform {
          font-size: 13.5px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.15em;
          line-height: 1.2;
        }

        .sidebar__brand-sub {
          font-size: 9px;
          font-weight: 700;
          color: var(--admin-accent, #7aa8ff);
          letter-spacing: 0.08em;
        }

        /* Location Card */
        .sidebar__location-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          margin: 0 4px 18px 4px;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .sidebar__location-card:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.08);
        }

        .sidebar__location-avatar {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
        }

        .sidebar__location-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .sidebar__location-name {
          font-size: 12.5px;
          font-weight: 600;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar__location-status {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10.5px;
          color: var(--admin-text-muted, #94A3B8);
        }

        .sidebar__status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--admin-success, #34D399);
          box-shadow: 0 0 6px var(--admin-success, #34D399);
        }

        /* Divider */
        .sidebar__divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06) 10%, rgba(255, 255, 255, 0.06) 90%, transparent);
          margin: 0 4px 14px 4px;
        }

        /* Section label */
        .sidebar__section-label {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: rgba(148, 163, 184, 0.45);
          padding: 0 10px 8px;
        }

        /* Nav */
        .sidebar__nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar__link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
          border: 1px solid transparent;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .sidebar__link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.05);
          transform: translateX(4px);
        }

        .sidebar__link--active {
          color: #ffffff;
          background: linear-gradient(90deg, rgba(79, 110, 255, 0.15) 0%, rgba(79, 110, 255, 0.03) 100%);
          border: 1px solid rgba(79, 110, 255, 0.25);
          font-weight: 600;
        }

        /* Active line indicator inside button bounds */
        .sidebar__link::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%) scaleY(0.4);
          width: 3px;
          height: 14px;
          border-radius: 0 3px 3px 0;
          background: var(--admin-primary, #4F6EFF);
          opacity: 0;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar__link--active::before {
          height: 18px;
          transform: translateY(-50%) scaleY(1);
          opacity: 1;
          box-shadow: 0 0 8px rgba(79, 110, 255, 0.8);
        }

        .sidebar__ico {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .sidebar__ico-svg {
          width: 18px;
          height: 18px;
          transition: stroke 0.2s ease;
        }

        .sidebar__link:hover .sidebar__ico-svg {
          color: #ffffff;
        }

        .sidebar__link--active .sidebar__ico-svg {
          color: var(--admin-accent, #7aa8ff);
          filter: drop-shadow(0 0 4px rgba(122, 168, 255, 0.4));
        }

        .sidebar__link-text {
          white-space: nowrap;
        }

        .sidebar__badge {
          margin-left: auto;
          font-size: 11px;
          font-weight: 700;
          background: rgba(52, 211, 153, 0.12);
          color: var(--admin-success, #34D399);
          padding: 2px 7px;
          border-radius: 6px;
          border: 1px solid rgba(52, 211, 153, 0.2);
          animation: badge-pulse 2s infinite;
        }

        @keyframes badge-pulse {
          0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.4); }
          70% { box-shadow: 0 0 0 4px rgba(52, 211, 153, 0); }
          100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
        }

        .sidebar__spacer {
          flex: 1;
        }

        /* Footer User Profile */
        .sidebar__user-profile {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 8px;
          margin-bottom: 12px;
        }

        .sidebar__user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(79, 110, 255, 0.2), rgba(122, 80, 255, 0.15));
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .sidebar__user-info {
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;
        }

        .sidebar__user-name {
          font-size: 12.5px;
          font-weight: 600;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar__user-role {
          font-size: 10.5px;
          color: var(--admin-text-muted, #94A3B8);
        }

        /* Logout button */
        .sidebar__logout {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          color: rgba(248, 113, 113, 0.85);
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sidebar__logout:hover {
          background: rgba(248, 113, 113, 0.06);
          border-color: rgba(248, 113, 113, 0.15);
          color: var(--admin-danger, #F87171);
          transform: translateX(4px);
        }

        .logout-svg {
          width: 16px;
          height: 16px;
        }
      `}</style>
    </aside>
  );
}
