"use client";

import React from "react";
import { useAdminStore } from "@/store/useAdminStore";
import StatusBadge from "@/components/admin/StatusBadge";

export default function AdminTopbar() {
  const { adminName, adminRole, adminPlan, adminAvatar } = useAdminStore();

  return (
    <header className="admin-topbar">
      <StatusBadge label="System Online" />

      <div className="admin-topbar__user">
        <div className="admin-topbar__info">
          <span className="admin-topbar__name">{adminName || "Admin"}</span>
          <span className="admin-topbar__role">{adminRole || "Partner"} · {adminPlan || "Pro Plan"}</span>
        </div>
        <div className="admin-topbar__avatar">
          {adminAvatar || "☕"}
        </div>
      </div>

      <style jsx>{`
        .admin-topbar {
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          height: var(--admin-topbar-height, 64px);
          background: rgba(10, 15, 34, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--admin-card-border, rgba(255,255,255,0.08));
        }

        .admin-topbar__user {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-topbar__info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1px;
        }

        .admin-topbar__name {
          font-size: 13px;
          font-weight: 700;
          color: var(--admin-text, #fff);
        }

        .admin-topbar__role {
          font-size: 11px;
          color: var(--admin-text-muted, #94A3B8);
        }

        .admin-topbar__avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(79, 110, 255, 0.4), rgba(43, 63, 168, 0.3));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
      `}</style>
    </header>
  );
}
