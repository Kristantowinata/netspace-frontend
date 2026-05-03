"use client";

import React from "react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
}: ProgressBarProps) {
  return (
    <div className="progress-bar" role="progressbar" aria-valuenow={currentStep} aria-valuemax={totalSteps}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`progress-bar__segment ${
            i < currentStep ? "progress-bar__segment--active" : ""
          }`}
        />
      ))}

      <style jsx>{`
        .progress-bar {
          display: flex;
          gap: 6px;
        }

        .progress-bar__segment {
          flex: 1;
          height: 3px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.15);
          transition: background 0.3s ease;
        }

        .progress-bar__segment--active {
          background: var(--gradient-progress);
        }
      `}</style>
    </div>
  );
}
