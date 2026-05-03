"use client";

import React from "react";

interface MobileLayoutProps {
  children: React.ReactNode;
  /** Whether to show the default purple glow orb (default: true) */
  showGlow?: boolean;
}

export default function MobileLayout({
  children,
  showGlow = true,
}: MobileLayoutProps) {
  return (
    <div className="mobile-layout">
      {children}

      {/* Purple radial glow — decorative, non-interactive */}
      {showGlow && (
        <div className="mobile-layout__glow" aria-hidden="true" />
      )}

      <style jsx>{`
        .mobile-layout {
          position: relative;
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 390px;
          min-height: 100svh;
          margin-left: auto;
          margin-right: auto;
          background-color: var(--bg-primary);
          overflow-x: hidden;
          overflow-y: auto;
          isolation: isolate;
        }

        .mobile-layout__glow {
          position: fixed;
          bottom: -80px;
          right: -80px;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: var(--bg-glow);
          opacity: 0.45;
          filter: blur(100px);
          pointer-events: none;
          z-index: 0;
        }

        @media (min-width: 430px) {
          .mobile-layout {
            border-left: 1px solid var(--border);
            border-right: 1px solid var(--border);
            box-shadow: 0 0 80px rgba(52, 39, 137, 0.3);
          }

          .mobile-layout__glow {
            right: calc(50% - 195px - 80px);
          }
        }
      `}</style>
    </div>
  );
}
