"use client";

import React from "react";

interface QRCodeCardProps {
  token: string;
  label: string;
  onDownload?: () => void;
}

export default function QRCodeCard({ token, label, onDownload }: QRCodeCardProps) {
  return (
    <div className="qr-card admin-card">
      {/* QR Code Frame */}
      <div className="qr-card__frame">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          aria-label="QR placeholder"
        >
          {/* Finder patterns (top-left, top-right, bottom-left) */}
          <rect x="10" y="10" width="50" height="50" rx="4" fill="#222" />
          <rect x="16" y="16" width="38" height="38" rx="2" fill="#fff" />
          <rect x="24" y="24" width="22" height="22" rx="2" fill="#222" />

          <rect x="140" y="10" width="50" height="50" rx="4" fill="#222" />
          <rect x="146" y="16" width="38" height="38" rx="2" fill="#fff" />
          <rect x="154" y="24" width="22" height="22" rx="2" fill="#222" />

          <rect x="10" y="140" width="50" height="50" rx="4" fill="#222" />
          <rect x="16" y="146" width="38" height="38" rx="2" fill="#fff" />
          <rect x="24" y="154" width="22" height="22" rx="2" fill="#222" />

          {/* Data modules (decorative) */}
          {[70, 80, 90, 100, 110, 120].map((x) =>
            [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170].map((y) => (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="8"
                height="8"
                rx="1"
                fill={(x + y) % 30 < 15 ? "#222" : "transparent"}
              />
            ))
          )}
          {[10, 20, 30, 40, 50].map((x) =>
            [70, 80, 90, 100, 110, 120].map((y) => (
              <rect
                key={`b-${x}-${y}`}
                x={x}
                y={y}
                width="8"
                height="8"
                rx="1"
                fill={(x * y) % 20 < 10 ? "#222" : "transparent"}
              />
            ))
          )}
          {[140, 150, 160, 170].map((x) =>
            [70, 80, 90, 100, 110, 120].map((y) => (
              <rect
                key={`c-${x}-${y}`}
                x={x}
                y={y}
                width="8"
                height="8"
                rx="1"
                fill={(x + y) % 25 < 12 ? "#222" : "transparent"}
              />
            ))
          )}
          {[70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170].map((x) =>
            [150, 160, 170].map((y) => (
              <rect
                key={`d-${x}-${y}`}
                x={x}
                y={y}
                width="8"
                height="8"
                rx="1"
                fill={(x * 3 + y) % 20 < 10 ? "#222" : "transparent"}
              />
            ))
          )}
        </svg>
      </div>

      {/* Label */}
      <p className="qr-card__label">{label}</p>

      {/* Token */}
      <p className="qr-card__token-row">
        Token: <code className="qr-card__token">{token}</code>
      </p>

      {/* Download Button */}
      <button
        type="button"
        className="admin-btn admin-btn-outline qr-card__btn"
        onClick={onDownload}
      >
        ⬇ Download QR
      </button>

      <style jsx>{`
        .qr-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .qr-card__frame {
          width: 240px;
          height: 240px;
          background: #fff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }

        .qr-card__label {
          font-size: 14px;
          font-weight: 600;
          color: var(--admin-text, #fff);
          text-align: center;
        }

        .qr-card__token-row {
          font-size: 13px;
          color: var(--admin-text-muted, #94A3B8);
        }

        .qr-card__token {
          font-family: 'SF Mono', 'Fira Code', monospace;
          color: var(--admin-accent, #7aa8ff);
          background: rgba(122, 168, 255, 0.1);
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 13px;
        }

        .qr-card__btn {
          width: 100%;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
