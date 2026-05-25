"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/useAdminStore";
import { loginAdmin } from "@/services/adminApi";

export default function AdminLoginPage() {
  const router = useRouter();
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
      router.push("/admin/analytics");
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
          <div className="login-brand__logo">N</div>
          <div className="login-brand__text">
            <span className="login-brand__name">NetSpace</span>
            <span className="login-brand__sub">Admin Dashboard</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="login-title">Admin Dashboard Login</h1>
        <p className="login-subtitle">
          Masuk dengan kredensial yang diberikan oleh tim NetSpace.
        </p>

        {/* Error */}
        {error && (
          <div className="login-error">{error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="login-input"
              placeholder="kopiloka.sudirman"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="password">
              Password
              <button
                type="button"
                className="login-toggle-pw"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? "Hide" : "Show"}
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
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="login-footnote">
          Lupa kredensial? Hubungi support NetSpace.
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
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid var(--admin-card-border, rgba(255,255,255,0.08));
          border-radius: 16px;
          padding: 40px 36px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        /* Brand */
        .login-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
        }

        .login-brand__logo {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4F6EFF, #2B3FA8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 800;
          color: white;
          box-shadow: 0 6px 18px rgba(79, 110, 255, 0.35);
        }

        .login-brand__text {
          display: flex;
          flex-direction: column;
        }

        .login-brand__name {
          font-size: 18px;
          font-weight: 800;
          color: var(--admin-text, #fff);
        }

        .login-brand__sub {
          font-size: 12px;
          color: var(--admin-text-muted, #94A3B8);
        }

        /* Heading */
        .login-title {
          font-size: 22px;
          font-weight: 800;
          color: var(--admin-text, #fff);
          margin-bottom: 6px;
        }

        .login-subtitle {
          font-size: 13px;
          color: var(--admin-text-muted, #94A3B8);
          margin-bottom: 24px;
          line-height: 1.5;
        }

        /* Error */
        .login-error {
          padding: 10px 14px;
          border-radius: 8px;
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid rgba(248, 113, 113, 0.25);
          color: var(--admin-danger, #F87171);
          font-size: 13px;
          margin-bottom: 16px;
        }

        /* Form */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .login-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 600;
          color: var(--admin-text-body, #CBD5E1);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .login-toggle-pw {
          background: none;
          border: none;
          font-family: inherit;
          font-size: 12px;
          font-weight: 500;
          color: var(--admin-accent, #7aa8ff);
          cursor: pointer;
          padding: 0;
          text-transform: none;
          letter-spacing: normal;
        }

        .login-toggle-pw:hover {
          color: var(--admin-text, #fff);
        }

        .login-input {
          padding: 12px 14px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--admin-text, #fff);
          font-family: inherit;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
        }

        .login-input::placeholder {
          color: var(--admin-text-muted, #94A3B8);
        }

        .login-input:focus {
          border-color: var(--admin-accent, #7aa8ff);
          background: rgba(255, 255, 255, 0.06);
        }

        /* Submit */
        .login-submit {
          margin-top: 6px;
          padding: 13px;
          border-radius: 10px;
          background: linear-gradient(135deg, #4F6EFF, #2B3FA8);
          color: white;
          font-family: inherit;
          font-size: 15px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(79, 110, 255, 0.35);
          transition: all 0.2s ease;
        }

        .login-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(79, 110, 255, 0.45);
        }

        .login-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Footnote */
        .login-footnote {
          text-align: center;
          font-size: 12px;
          color: var(--admin-text-muted, #94A3B8);
          margin-top: 24px;
        }
      `}</style>
    </div>
  );
}
