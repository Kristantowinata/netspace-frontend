"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MobileLayout from "@/components/layout/MobileLayout";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import InterestTag from "@/components/ui/InterestTag";
import Input from "@/components/ui/Input";
import { useAppStore } from "@/store/useAppStore";

const INTERESTS = [
  { emoji: "☕", label: "Kopi" },
  { emoji: "🎮", label: "Gaming" },
  { emoji: "📚", label: "Buku" },
  { emoji: "🎵", label: "Musik" },
  { emoji: "🍜", label: "Kuliner" },
  { emoji: "✈️", label: "Travel" },
  { emoji: "💻", label: "Tech" },
  { emoji: "🎨", label: "Seni" },
  { emoji: "🏋️", label: "Olahraga" },
  { emoji: "🎬", label: "Film" },
  { emoji: "📷", label: "Fotografi" },
  { emoji: "🌱", label: "Tanaman" },
];

export default function InterestsPage() {
  const router = useRouter();
  const { location, setInterests } = useAppStore();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showCustom, setShowCustom] = useState(false);
  const [customInterest, setCustomInterest] = useState("");

  const toggle = (label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const totalSelected = selected.size;
  const isValid = totalSelected >= 1;

  const handleSubmit = () => {
    if (!isValid) return;
    const selectedInterests = INTERESTS.filter((i) => selected.has(i.label));
    setInterests(selectedInterests);
    router.push(`/${location}/room`);
  };

  return (
    <MobileLayout showGlow={false}>
      {/* ── Background orbs ── */}
      <div className="interests-orbs" aria-hidden="true">
        <div className="interests-orbs__blue" />
        <div className="interests-orbs__purple" />
      </div>

      {/* ── Header ── */}
      <header className="interests-header glass-strong">
        <div className="interests-header__progress">
          <ProgressBar currentStep={2} totalSteps={2} />
        </div>
        <p className="interests-header__step">Langkah 2 dari 2</p>
        <h1 className="interests-header__title">Apa minatmu?</h1>
        <p className="interests-header__subtitle">
          Pilih minimal 1 agar mudah ditemukan orang lain.
        </p>
      </header>

      {/* ── Tags ── */}
      <main className="interests-body">
        <div className="interests-body__tags">
          {INTERESTS.map((item) => (
            <InterestTag
              key={item.label}
              emoji={item.emoji}
              label={item.label}
              selected={selected.has(item.label)}
              onClick={() => toggle(item.label)}
            />
          ))}

          {/* "Lainnya" toggle button */}
          <button
            type="button"
            onClick={() => setShowCustom((v) => !v)}
            className="interests-body__other-btn"
            style={
              showCustom
                ? {
                    background:
                      "linear-gradient(135deg, rgba(56, 100, 255, 0.6), rgba(100, 60, 255, 0.5))",
                    border: "1px solid rgba(100, 140, 255, 0.55)",
                    color: "white",
                    fontWeight: 700,
                    boxShadow: "0 2px 14px rgba(56, 100, 255, 0.35)",
                  }
                : undefined
            }
          >
            Lainnya
          </button>
        </div>

        {/* Custom interest input — shown when "Lainnya" is active */}
        {showCustom && (
          <div className="interests-body__custom">
            <Input
              id="custom-interest"
              label="Minat Lainnya"
              placeholder="mis. Journaling, Skateboard, K-Pop..."
              value={customInterest}
              onChange={setCustomInterest}
              helperText="Tulis minat yang belum ada di daftar atas"
            />
          </div>
        )}
      </main>

      {/* ── CTA ── */}
      <div className="interests-cta">
        {totalSelected > 0 && (
          <p className="interests-cta__count">
            {totalSelected} dipilih
          </p>
        )}
        <Button onClick={handleSubmit} disabled={!isValid} fullWidth>
          Masuk ke Ruangan →
        </Button>
      </div>

      <style jsx>{`
        /* Background orbs */
        .interests-orbs {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .interests-orbs__blue {
          position: absolute;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(80, 130, 255, 0.42) 0%,
            transparent 70%
          );
          top: -60px;
          left: -60px;
        }

        .interests-orbs__purple {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(130, 70, 255, 0.35) 0%,
            transparent 70%
          );
          bottom: 80px;
          right: -40px;
        }

        /* Header */
        .interests-header {
          position: relative;
          z-index: 1;
          padding: 18px 22px 14px;
          border-bottom: 1px solid var(--glass-border);
        }

        .interests-header__progress {
          margin-bottom: 14px;
        }

        .interests-header__step {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--text-secondary);
          margin-bottom: 5px;
        }

        .interests-header__title {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .interests-header__subtitle {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.65);
          line-height: 1.5;
        }

        /* Body */
        .interests-body {
          position: relative;
          z-index: 1;
          flex: 1;
          padding: 16px 20px 0;
          overflow-y: auto;
        }

        .interests-body__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .interests-body__other-btn {
          padding: 9px 16px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.25s ease;
          -webkit-tap-highlight-color: transparent;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.13);
          color: rgba(255, 255, 255, 0.65);
        }

        .interests-body__custom {
          margin-top: 18px;
        }

        /* CTA */
        .interests-cta {
          position: relative;
          z-index: 1;
          padding: 12px 22px 32px;
        }

        .interests-cta__count {
          font-size: 12px;
          color: rgba(120, 160, 255, 0.8);
          text-align: center;
          margin-bottom: 10px;
          font-weight: 600;
        }
      `}</style>
    </MobileLayout>
  );
}
