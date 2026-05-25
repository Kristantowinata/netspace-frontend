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

    if (result.success && result.admin) {
      login(result.admin.name, result.admin.role, result.admin.plan, result.admin.avatar);
      router.push(`/${location}/admin/analytics`);
    } else {
      setError(result.error || "Login gagal");
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card" data-screen-label="Admin Login">
        {/* Brand */}
        <div className="login-brand">
          <div className="login-brand__logo">{locInfo.avatar}</div>
          <div className="login-brand__text">
            <span className="login-brand__name">{locInfo.name}</span>
            <span className="login-brand__sub">Admin Dashboard</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="login-title">Selamat Datang</h1>
        <p className="login-subtitle">
          Masuk dengan kredensial yang diberikan oleh tim NetSpace untuk mengelola <strong>{locInfo.name}</strong>.
        </p>

        {/* Error */}
        {error && <div className="login-error">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="login-input"
              placeholder="Username admin"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="password">
              Password
              <button type="button" className="login-toggle-pw" onClick={() => setShowPw(!showPw)}>
                {showPw ? "Sembunyikan" : "Tampilkan"}
              </button>
            </label>
            <input
              id="password"
              type={showPw ? "text" : "password"}
              className="login-input"
              placeholder="Masukkan password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="login-submit"
            disabled={loading || !username || !password}
          >
            {loading ? (
              <span className="login-submit__loading">
                <span className="login-submit__spinner" />
                Memproses...
              </span>
            ) : "Masuk"}
          </button>
        </form>

        <p className="login-footnote">
          Lupa kredensial? Hubungi <span className="login-footnote__link">support NetSpace</span>.
        </p>
      </div>

      <style jsx>{`
        .login-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 24px;
          position: relative;
          z-index: 1;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 20px;
          padding: 44px 38px;
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        /* Brand */
        .login-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .login-brand__logo {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(79, 110, 255, 0.2), rgba(122, 80, 255, 0.15));
          border: 1px solid rgba(79, 110, 255, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .login-brand__text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .login-brand__name {
          font-size: 18px;
          font-weight: 800;
          color: var(--admin-text, #fff);
        }

        .login-brand__sub {
          font-size: 12px;
          font-weight: 500;
          color: var(--admin-text-muted, #94A3B8);
        }

        /* Heading */
        .login-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--admin-text, #fff);
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .login-subtitle {
          font-size: 13.5px;
          color: var(--admin-text-muted, #94A3B8);
          margin-bottom: 28px;
          line-height: 1.6;
        }

        /* Error */
        .login-error {
          padding: 11px 16px;
          border-radius: 10px;
          background: rgba(248, 113, 113, 0.08);
          border: 1px solid rgba(248, 113, 113, 0.2);
          color: var(--admin-danger, #F87171);
          font-size: 13px;
          margin-bottom: 20px;
        }

        /* Form */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .login-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 600;
          color: var(--admin-text-body, #CBD5E1);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .login-toggle-pw {
          background: none;
          border: none;
          font-family: inherit;
          font-size: 11px;
          font-weight: 500;
          color: var(--admin-accent, #7aa8ff);
          cursor: pointer;
          padding: 0;
          text-transform: none;
          letter-spacing: normal;
          transition: color 0.15s;
        }

        .login-toggle-pw:hover {
          color: var(--admin-text, #fff);
        }

        .login-input {
          padding: 12px 16px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--admin-text, #fff);
          font-family: inherit;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }

        .login-input::placeholder {
          color: rgba(148, 163, 184, 0.6);
        }

        .login-input:focus {
          border-color: rgba(79, 110, 255, 0.4);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 0 3px rgba(79, 110, 255, 0.1);
        }

        /* Submit */
        .login-submit {
          margin-top: 8px;
          padding: 13px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4F6EFF, #2B3FA8);
          color: white;
          font-family: inherit;
          font-size: 14.5px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(79, 110, 255, 0.3);
          transition: all 0.2s ease;
        }

        .login-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 12px 32px rgba(79, 110, 255, 0.4);
        }

        .login-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .login-submit__loading {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .login-submit__spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* Footnote */
        .login-footnote {
          text-align: center;
          font-size: 12px;
          color: var(--admin-text-muted, #94A3B8);
          margin-top: 28px;
        }

        .login-footnote__link {
          color: var(--admin-accent, #7aa8ff);
          cursor: pointer;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
