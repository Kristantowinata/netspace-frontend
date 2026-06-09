"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdminStore } from "@/store/useAdminStore";
import { getLocationInfo } from "@/services/adminMockData";
import { loginAdmin } from "@/services/adminApi";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useParams();
  const location = params.location as string;
  const locInfo = getLocationInfo(location);
  const login = useAdminStore((s) => s.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    setError("");

    const result = await loginAdmin(username, password);

    if (result.success && result.admin && result.token) {
      login(result.admin.name, result.admin.role, result.admin.plan, result.admin.avatar, result.token);
      router.push(`/${location}/admin/analytics`);
    } else {
      setError(result.error || "Login gagal");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 relative z-[1]">
      <div
        className="w-full max-w-[420px] bg-white/[0.04] backdrop-blur-[32px] border border-white/[0.07] rounded-[20px] py-11 px-[38px] shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]"
        data-screen-label="Admin Login"
      >
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-[46px] h-[46px] rounded-[14px] bg-[linear-gradient(135deg,rgba(79,110,255,0.2),rgba(122,80,255,0.15))] border border-admin-primary/25 flex items-center justify-center text-[22px]">
            {locInfo.avatar}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-extrabold text-white">{locInfo.name}</span>
            <span className="text-xs font-medium text-admin-text-muted">Admin Dashboard</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Selamat Datang</h1>
        <p className="text-[13.5px] text-admin-text-muted mb-7 leading-[1.6]">
          Masuk dengan kredensial yang diberikan oleh tim NetSpace untuk mengelola <strong>{locInfo.name}</strong>.
        </p>

        {/* Error */}
        {error && (
          <div className="py-[11px] px-4 rounded-[10px] bg-red-400/[0.08] border border-red-400/20 text-admin-danger text-[13px] mb-5">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-[7px]">
            <label className="flex items-center justify-between text-xs font-semibold text-admin-text-body uppercase tracking-[0.06em]" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="py-3 px-4 rounded-[10px] bg-white/[0.03] border border-white/[0.08] text-white font-[inherit] text-sm outline-none transition-[border-color,background,box-shadow] duration-200 placeholder:text-admin-text-muted/60 focus:border-admin-primary/40 focus:bg-white/5 focus:shadow-[0_0_0_3px_rgba(79,110,255,0.1)]"
              placeholder="Username admin"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-[7px]">
            <label className="flex items-center justify-between text-xs font-semibold text-admin-text-body uppercase tracking-[0.06em]" htmlFor="password">
              Password
              <button
                type="button"
                className="bg-none border-none font-[inherit] text-[11px] font-medium text-admin-accent cursor-pointer p-0 normal-case tracking-normal transition-colors duration-150 hover:text-white"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? "Sembunyikan" : "Tampilkan"}
              </button>
            </label>
            <input
              id="password"
              type={showPw ? "text" : "password"}
              className="py-3 px-4 rounded-[10px] bg-white/[0.03] border border-white/[0.08] text-white font-[inherit] text-sm outline-none transition-[border-color,background,box-shadow] duration-200 placeholder:text-admin-text-muted/60 focus:border-admin-primary/40 focus:bg-white/5 focus:shadow-[0_0_0_3px_rgba(79,110,255,0.1)]"
              placeholder="Masukkan password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="mt-2 py-[13px] rounded-xl bg-[linear-gradient(135deg,#4F6EFF,#2B3FA8)] text-white font-[inherit] text-[14.5px] font-bold border-none cursor-pointer shadow-[0_8px_24px_rgba(79,110,255,0.3)] transition-all duration-200 hover:not-disabled:-translate-y-px hover:not-disabled:shadow-[0_12px_32px_rgba(79,110,255,0.4)] active:not-disabled:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !username || !password}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-admin-spin" />
                Memproses...
              </span>
            ) : "Masuk"}
          </button>
        </form>

        <p className="text-center text-xs text-admin-text-muted mt-7">
          Lupa kredensial? Hubungi <span className="text-admin-accent cursor-pointer">support NetSpace</span>.
        </p>
      </div>
    </div>
  );
}
