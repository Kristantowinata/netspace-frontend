"use client";

import MobileLayout from "@/components/layout/MobileLayout";

export default function Home() {
  return (
    <MobileLayout showGlow={false}>
      {/* ── Background orbs ── */}
      <div className="land-orbs" aria-hidden="true">
        <div className="land-orbs__blue" />
        <div className="land-orbs__purple" />
      </div>

      <main className="land-content">
        {/* Logo */}
        <div className="land-logo">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>

        <h1 className="land-title">Social Hub</h1>
        <p className="land-tagline">Temukan orang baru di sekitarmu</p>

        {/* QR instruction card */}
        <div className="land-card glass">
          <div className="land-card__icon">📱</div>
          <p className="land-card__text">
            Scan QR code di meja
            <br />
            untuk mulai check-in
          </p>
        </div>

        <div className="land-steps">
          <div className="land-step">
            <span className="land-step__num">1</span>
            <span className="land-step__text">Buka kamera HP</span>
          </div>
          <div className="land-step">
            <span className="land-step__num">2</span>
            <span className="land-step__text">Arahkan ke QR di meja</span>
          </div>
          <div className="land-step">
            <span className="land-step__num">3</span>
            <span className="land-step__text">Otomatis masuk app</span>
          </div>
        </div>

        <p className="land-footer">
          Chat anonim · Sementara · Auto-hapus saat logout
        </p>
      </main>

      <style jsx>{`
        .land-orbs {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .land-orbs__blue {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(56, 100, 255, 0.4) 0%,
            transparent 70%
          );
          top: -80px;
          left: -60px;
        }

        .land-orbs__purple {
          position: absolute;
          width: 240px;
          height: 240px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(130, 70, 255, 0.3) 0%,
            transparent 70%
          );
          bottom: 60px;
          right: -50px;
        }

        .land-content {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 28px;
          gap: 14px;
          text-align: center;
        }

        .land-logo {
          width: 72px;
          height: 72px;
          border-radius: 24px;
          background: var(--gradient-brand);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(56, 100, 255, 0.45);
          margin-bottom: 4px;
        }

        .land-title {
          font-size: 28px;
          font-weight: 800;
          color: white;
        }

        .land-tagline {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.55);
          font-weight: 500;
        }

        .land-card {
          padding: 24px 28px;
          border-radius: 20px;
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .land-card__icon {
          font-size: 40px;
        }

        .land-card__text {
          font-size: 16px;
          font-weight: 700;
          color: white;
          line-height: 1.5;
        }

        .land-steps {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 8px;
          width: 100%;
          max-width: 260px;
        }

        .land-step {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .land-step__num {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(56, 100, 255, 0.25);
          border: 1px solid rgba(56, 100, 255, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: #6ac8ff;
          flex-shrink: 0;
        }

        .land-step__text {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.55);
          font-weight: 500;
          text-align: left;
        }

        .land-footer {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.3);
          margin-top: 20px;
        }
      `}</style>
    </MobileLayout>
  );
}
