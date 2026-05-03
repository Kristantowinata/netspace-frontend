"use client";

import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit";
  variant?: "primary" | "ghost";
}

export default function Button({
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  type = "button",
  variant = "primary",
}: ButtonProps) {
  const isPrimary = variant === "primary";

  const baseStyle: React.CSSProperties = {
    padding: "17px 24px",
    borderRadius: "18px",
    fontSize: "16px",
    fontWeight: 700,
    border: "none",
    fontFamily: "inherit",
    cursor: disabled ? "default" : "pointer",
    transition: "all 0.25s ease",
    WebkitTapHighlightColor: "transparent",
    width: fullWidth ? "100%" : undefined,
  };

  const variantStyle: React.CSSProperties = isPrimary
    ? disabled
      ? {
          background: "rgba(255, 255, 255, 0.08)",
          color: "rgba(255, 255, 255, 0.25)",
          boxShadow: "none",
        }
      : {
          background: "linear-gradient(135deg, #4338ca, #6366f1, #5082FF)",
          color: "var(--text-primary)",
          boxShadow: "0 4px 24px rgba(80, 130, 255, 0.35)",
        }
    : {
        background: "var(--glass-bg)",
        color: "var(--text-secondary)",
        border: "1px solid var(--glass-border)",
      };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...variantStyle }}
      onMouseEnter={(e) => {
        if (!disabled && isPrimary) {
          e.currentTarget.style.boxShadow =
            "0 6px 32px rgba(80, 130, 255, 0.5)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && isPrimary) {
          e.currentTarget.style.boxShadow =
            "0 4px 24px rgba(80, 130, 255, 0.35)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
    >
      {children}
    </button>
  );
}
