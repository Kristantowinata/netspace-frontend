"use client";

import MobileLayout from "@/components/layout/MobileLayout";

export default function Home() {
  return (
    <MobileLayout showGlow={false}>
      <div className="error-orbs" aria-hidden="true">
        <div className="error-orbs__red" />
        <div className="error-orbs__purple" />
      </div>

      <main className="error-content">
        <div className="error-icon">
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
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1 className="error-title">Akses Tidak Valid</h1>
        <p className="error-description">
          Aplikasi ini hanya dapat diakses melalui QR Code.
          <br />
          Silakan scan QR Code yang tersedia di lokasi Anda untuk memulai sesi.
        </p>
      </main>

      <style jsx>{`
        .error-orbs {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .error-orbs__red {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 56, 100, 0.4) 0%,
            transparent 70%
          );
          top: -80px;
          left: -60px;
        }

        .error-orbs__purple {
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

        .error-content {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 28px;
          gap: 16px;
          text-align: center;
        }

        .error-icon {
          width: 72px;
          height: 72px;
          border-radius: 24px;
          background: linear-gradient(135deg, #ff3864 0%, #ff6b38 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(255, 56, 100, 0.45);
          margin-bottom: 8px;
        }

        .error-title {
          font-size: 24px;
          font-weight: 800;
          color: white;
        }

        .error-description {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
        }
      `}</style>
    </MobileLayout>
  );
}

