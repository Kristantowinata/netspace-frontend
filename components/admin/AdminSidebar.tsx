"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminStore } from "@/store/useAdminStore";

const NAV_ITEMS = [
  { href: "/admin/analytics", icon: "📊", label: "Analytics" },
  { href: "/admin/lokasi", icon: "📍", label: "Lokasi & QR" },
  { href: "/admin/users", icon: "👥", label: "Users Aktif" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAdminStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <aside className="admin-sidebar">
      {/* Brand */}
      <div className="admin-sidebar__brand">
        <div className="admin-sidebar__logo">N</div>
        <div className="admin-sidebar__brand-text">
          <span className="admin-sidebar__brand-name">Social Check-in</span>
          <span className="admin-sidebar__brand-sub">Admin Dashboard</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-sidebar__link ${
              pathname === item.href ? "admin-sidebar__link--active" : ""
            }`}
          >
            <span className="admin-sidebar__ico">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="admin-sidebar__footer">
        <button
          type="button"
          className="admin-sidebar__logout"
          onClick={handleLogout}
        >
          <span className="admin-sidebar__ico">⎋</span>
          Logout
        </button>
      </div>

      <style jsx>{`
        .admin-sidebar {
          position: sticky;
          top: 0;
          height: 100vh;
          width: var(--admin-sidebar-width, 248px);
          min-width: var(--admin-sidebar-width, 248px);
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          background: rgba(10, 15, 34, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-right: 1px solid var(--admin-card-border, rgba(255,255,255,0.08));
          z-index: 20;
        }

        /* Brand */
        .admin-sidebar__brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 8px;
          margin-bottom: 32px;
        }

        .admin-sidebar__logo {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #4F6EFF, #2B3FA8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 800;
          color: white;
          box-shadow: 0 4px 14px rgba(79, 110, 255, 0.35);
          flex-shrink: 0;
        }

        .admin-sidebar__brand-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .admin-sidebar__brand-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--admin-text, #fff);
          letter-spacing: -0.01em;
        }

        .admin-sidebar__brand-sub {
          font-size: 12px;
          color: var(--admin-text-muted, #94A3B8);
        }

        /* Nav */
        .admin-sidebar__nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .admin-sidebar__link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--admin-text-muted, #94A3B8);
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .admin-sidebar__link:hover {
          color: var(--admin-text-body, #CBD5E1);
          background: rgba(255, 255, 255, 0.04);
        }

        .admin-sidebar__link--active {
          color: var(--admin-text, #fff);
          background: rgba(79, 110, 255, 0.12);
          font-weight: 600;
        }

        .admin-sidebar__ico {
          font-size: 16px;
          width: 20px;
          text-align: center;
        }

        /* Footer */
        .admin-sidebar__footer {
          padding-top: 16px;
          border-top: 1px solid var(--admin-card-border, rgba(255,255,255,0.08));
        }

        .admin-sidebar__logout {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          color: var(--admin-danger, #F87171);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .admin-sidebar__logout:hover {
          background: rgba(248, 113, 113, 0.08);
        }
      `}</style>
    </aside>
  );
}
