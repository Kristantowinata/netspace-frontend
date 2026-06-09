"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import SearchInput from "@/components/admin/SearchInput";
import LivePill from "@/components/admin/LivePill";
import ForceLogoutModal from "@/components/admin/ForceLogoutModal";
import { getActiveUsers, forceLogoutUser } from "@/services/adminApi";
import type { AdminUser } from "@/services/adminMockData";

export default function UsersPage() {
  const params = useParams();
  const location = params.location as string;

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [modalUser, setModalUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // silent=true is the background poll: it refreshes the roster in place without
  // toggling `loading`, so the skeleton rows don't flash every few seconds. Only
  // the first load (and the manual "Coba Lagi") show the loading state.
  const fetchUsersData = useCallback(
    (silent = false) => {
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      return getActiveUsers(location)
        .then((data) => {
          setUsers(data);
          if (silent) setError(null);
        })
        .catch((err) => {
          console.error(err);
          // Don't wipe the table on a transient background failure; only show
          // the error screen on a foreground load.
          if (!silent) {
            setError(
              "Gagal memuat data pengguna aktif. Silakan periksa koneksi server Anda."
            );
          }
        })
        .finally(() => {
          if (!silent) setLoading(false);
        });
    },
    [location]
  );

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  // The roster reflects who holds a live socket, which changes as people join
  // and leave — poll every 10s so the admin sees it update without a refresh.
  useEffect(() => {
    const id = setInterval(() => fetchUsersData(true), 10_000);
    return () => clearInterval(id);
  }, [fetchUsersData]);

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
      <div>
        {/* Header */}
        <div className="flex flex-col gap-[18px] mb-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-white mb-1 tracking-tight">Users Aktif</h1>
              <p className="text-[13px] text-admin-text-muted">Kelola user yang sedang check-in di lokasi.</p>
            </div>
            <LivePill count={users.length} />
          </div>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cari nama user..."
          />
        </div>

        {/* Table */}
        <div className="bg-white/[0.035] backdrop-blur-[20px] border border-white/[0.06] rounded-xl overflow-hidden">
          {error ? (
            <div className="py-14 px-6 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center text-admin-danger text-lg font-bold">
                ⚠️
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Gagal Memuat Data</p>
                <p className="text-xs text-admin-text-muted mt-1 max-w-[320px]">{error}</p>
              </div>
              <button
                type="button"
                className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg font-[inherit] text-xs font-semibold cursor-pointer transition-all duration-200 outline-none bg-admin-primary/10 text-admin-accent border border-admin-primary/35 hover:bg-admin-primary/20 hover:border-admin-primary/50"
                onClick={() => fetchUsersData()}
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="py-[13px] px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-admin-text-muted text-left bg-white/[0.015] border-b border-white/[0.06]">Nama</th>
                  <th className="py-[13px] px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-admin-text-muted text-left bg-white/[0.015] border-b border-white/[0.06] max-[900px]:hidden">Gender</th>
                  <th className="py-[13px] px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-admin-text-muted text-left bg-white/[0.015] border-b border-white/[0.06]">Minat</th>
                  <th className="py-[13px] px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-admin-text-muted text-left bg-white/[0.015] border-b border-white/[0.06]">Durasi</th>
                  <th className="py-[13px] px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-admin-text-muted text-right bg-white/[0.015] border-b border-white/[0.06]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} className="border-b border-white/[0.03] last:border-b-0 animate-admin-pulse">
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-[10px] bg-white/5 border border-white/5 shrink-0" />
                          <div className="flex flex-col gap-1.5">
                            <div className="w-24 h-4 bg-white/10 rounded" />
                            <div className="w-16 h-3 bg-white/5 rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 align-middle max-[900px]:hidden">
                        <div className="w-14 h-6 bg-white/5 rounded-full animate-admin-pulse" />
                      </td>
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex gap-1.5">
                          <div className="w-16 h-6 bg-white/5 rounded-md animate-admin-pulse" />
                          <div className="w-20 h-6 bg-white/5 rounded-md animate-admin-pulse" />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 align-middle">
                        <div className="w-12 h-4 bg-white/5 rounded animate-admin-pulse" />
                      </td>
                      <td className="py-3.5 px-4 align-middle text-right">
                        <div className="inline-flex w-28 h-9 bg-white/5 rounded-lg ml-auto animate-admin-pulse" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-14 px-6 text-center text-admin-text-muted text-sm">
                      Tidak ada user yang cocok
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr key={user.id} className="border-b border-white/[0.03] last:border-b-0 transition-colors duration-150 hover:bg-white/[0.02]">
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-[10px] bg-[linear-gradient(135deg,rgba(79,110,255,0.2),rgba(122,80,255,0.15))] border border-admin-primary/15 flex items-center justify-center text-[17px] shrink-0">
                            {user.avatar}
                          </div>
                          <div className="flex flex-col gap-px">
                            <span className="text-sm font-semibold text-white">{user.name}</span>
                            <span className="text-[11.5px] text-admin-text-muted font-mono">{user.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 align-middle max-[900px]:hidden">
                        <span className="inline-flex py-1 px-3 rounded-full text-xs font-medium bg-white/[0.04] text-admin-text-body border border-white/[0.08]">
                          {user.gender}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex flex-wrap gap-1">
                          {user.interests.map((int, i) => (
                            <span key={i} className="inline-flex items-center gap-1 py-[3px] px-2.5 rounded-md text-xs font-medium bg-admin-accent-fill text-admin-accent border border-admin-accent/20">
                              {int.emoji} {int.label}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 align-middle">
                        <span className="tabular-nums text-admin-text-body text-sm">{user.duration} menit</span>
                      </td>
                      <td className="py-3.5 px-4 align-middle text-right">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg font-[inherit] text-[13px] font-semibold cursor-pointer transition-all duration-200 outline-none bg-red-400/10 text-admin-danger border border-red-400/30 hover:bg-red-400/20 hover:border-red-400/50 hover:-translate-y-px active:translate-y-0"
                          onClick={() => setModalUser(user.name)}
                        >
                          Force Logout
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>


      <ForceLogoutModal
        isOpen={modalUser !== null}
        userName={modalUser || ""}
        onConfirm={handleForceLogout}
        onClose={() => setModalUser(null)}
      />
    </AdminLayout>
  );
}
