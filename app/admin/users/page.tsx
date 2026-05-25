"use client";

import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import SearchInput from "@/components/admin/SearchInput";
import LivePill from "@/components/admin/LivePill";
import ForceLogoutModal from "@/components/admin/ForceLogoutModal";
import { getActiveUsers, forceLogoutUser } from "@/services/adminApi";
import type { AdminUser } from "@/services/adminMockData";

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [modalUser, setModalUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleForceLogout = useCallback(async (reason: string) => {
    if (!modalUser) return;
    const target = users.find((u) => u.name === modalUser);
    if (!target) return;

    await forceLogoutUser(target.id, reason);
    setUsers((prev) => prev.filter((u) => u.id !== target.id));
    setModalUser(null);
  }, [modalUser, users]);

  return (
    <AdminLayout>
      <div className="users-page">
        {/* Header */}
        <div className="users-page__header">
          <div className="users-page__title-row">
            <h1 className="users-page__title">Users Aktif</h1>
            <LivePill count={users.length} />
          </div>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cari nama user..."
          />
        </div>

        {/* Table */}
        <div className="users-page__table-card admin-card" style={{ padding: 0, overflow: "hidden" }}>
          {loading ? (
            <p className="users-page__loading">Memuat data...</p>
          ) : filtered.length === 0 ? (
            <p className="users-page__empty">Tidak ada user yang cocok</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th className="admin-hide-mobile">Gender</th>
                  <th>Minat</th>
                  <th>Durasi</th>
                  <th style={{ textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id}>
                    {/* Nama */}
                    <td>
                      <div className="users-table__user">
                        <div className="users-table__avatar">{user.avatar}</div>
                        <div className="users-table__info">
                          <span className="users-table__name">{user.name}</span>
                          <span className="users-table__id">{user.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Gender */}
                    <td className="admin-hide-mobile">
                      <span className="admin-pill">{user.gender}</span>
                    </td>

                    {/* Minat */}
                    <td>
                      <div className="users-table__interests">
                        {user.interests.map((int, i) => (
                          <span key={i} className="admin-chip">
                            {int.emoji} {int.label}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Durasi */}
                    <td>
                      <span className="users-table__duration">
                        {user.duration} menit
                      </span>
                    </td>

                    {/* Aksi */}
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger"
                        onClick={() => setModalUser(user.name)}
                      >
                        Force Logout
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Force Logout Modal */}
      <ForceLogoutModal
        isOpen={modalUser !== null}
        userName={modalUser || ""}
        onConfirm={handleForceLogout}
        onClose={() => setModalUser(null)}
      />

      <style jsx>{`
        .users-page__header {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .users-page__title-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .users-page__title {
          font-size: 22px;
          font-weight: 800;
          color: var(--admin-text, #fff);
        }

        .users-page__loading,
        .users-page__empty {
          padding: 48px 24px;
          text-align: center;
          color: var(--admin-text-muted, #94A3B8);
          font-size: 14px;
        }

        /* Table */
        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table thead th {
          padding: 12px 16px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--admin-text-muted, #94A3B8);
          text-align: left;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid var(--admin-card-border, rgba(255,255,255,0.08));
        }

        .users-table tbody tr {
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          transition: background 0.15s ease;
        }

        .users-table tbody tr:last-child {
          border-bottom: none;
        }

        .users-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .users-table td {
          padding: 14px 16px;
          vertical-align: middle;
        }

        /* User cell */
        .users-table__user {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .users-table__avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(79, 110, 255, 0.35), rgba(43, 63, 168, 0.25));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .users-table__info {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .users-table__name {
          font-size: 14px;
          font-weight: 600;
          color: var(--admin-text, #fff);
        }

        .users-table__id {
          font-size: 12px;
          color: var(--admin-text-muted, #94A3B8);
        }

        /* Interests */
        .users-table__interests {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        /* Duration */
        .users-table__duration {
          font-variant-numeric: tabular-nums;
          color: var(--admin-text-body, #CBD5E1);
          font-size: 14px;
        }
      `}</style>
    </AdminLayout>
  );
}
