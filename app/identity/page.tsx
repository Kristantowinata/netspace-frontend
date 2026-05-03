"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MobileLayout from "@/components/layout/MobileLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import GenderSelector from "@/components/ui/GenderSelector";

export default function IdentityPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<string | null>(null);

  const isValid =
    name.trim().length > 0 &&
    age.trim().length > 0 &&
    Number(age) > 0 &&
    gender !== null;

  const handleSubmit = () => {
    if (!isValid) return;
    // TODO: Save to Zustand store
    router.push("/interests");
  };

  return (
    <MobileLayout showGlow={false}>
      {/* ── Background orbs ── */}
      <div
        className="identity-orbs"
        aria-hidden="true"
      >
        <div className="identity-orbs__blue" />
        <div className="identity-orbs__purple" />
      </div>

      {/* ── Header ── */}
      <header className="identity-header glass-strong">
        <div className="identity-header__inner">
          <div className="identity-header__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <div>
            <p className="identity-header__title">Social Check-in</p>
            <p className="identity-header__location">📍 Kopi Braga</p>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="identity-body">
        {/* Progress */}
        <div className="identity-body__progress">
          <ProgressBar currentStep={1} totalSteps={2} />
        </div>

        {/* Heading */}
        <div className="identity-body__heading">
          <p className="identity-body__step">Langkah 1 dari 2</p>
          <h1 className="identity-body__title">Siapa kamu?</h1>
          <p className="identity-body__subtitle">
            Nama ini hanya terlihat oleh pengguna lain di lokasi ini.
          </p>
        </div>

        {/* Form fields */}
        <div className="identity-body__fields">
          <Input
            id="name"
            label="Nama Tampilan"
            placeholder="mis. Keno, Alex, Dira..."
            value={name}
            onChange={setName}
            maxLength={30}
            helperText={`${name.length}/30 · Tidak disimpan permanen setelah sesi berakhir`}
          />

          <Input
            id="age"
            label="Umur"
            placeholder="mis. 24"
            value={age}
            onChange={(v) => {
              // Only allow digits
              const filtered = v.replace(/\D/g, "").slice(0, 3);
              setAge(filtered);
            }}
            inputMode="numeric"
          />

          <GenderSelector value={gender} onChange={setGender} />
        </div>
      </main>

      {/* ── CTA ── */}
      <div className="identity-cta">
        <Button onClick={handleSubmit} disabled={!isValid} fullWidth>
          Lanjut →
        </Button>
      </div>

      <style jsx>{`
        /* Background orbs */
        .identity-orbs {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .identity-orbs__blue {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(80, 130, 255, 0.45) 0%,
            transparent 70%
          );
          top: -80px;
          left: -80px;
        }

        .identity-orbs__purple {
          position: absolute;
          width: 240px;
          height: 240px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(130, 70, 255, 0.38) 0%,
            transparent 70%
          );
          bottom: 60px;
          right: -60px;
        }

        /* Header */
        .identity-header {
          position: relative;
          z-index: 1;
          padding: 18px 22px 14px;
          border-bottom: 1px solid var(--glass-border);
        }

        .identity-header__inner {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .identity-header__icon {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          background: var(--gradient-brand);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .identity-header__title {
          font-size: 15px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .identity-header__location {
          font-size: 11px;
          color: var(--text-secondary);
          margin-top: 1px;
        }

        /* Body */
        .identity-body {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 22px 22px 0;
          gap: 22px;
          overflow-y: auto;
        }

        .identity-body__progress {
          margin-bottom: -8px;
        }

        .identity-body__heading {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .identity-body__step {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .identity-body__title {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .identity-body__subtitle {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .identity-body__fields {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* CTA */
        .identity-cta {
          position: relative;
          z-index: 1;
          padding: 16px 22px 32px;
        }
      `}</style>
    </MobileLayout>
  );
}
