"use client";

import React, { useRef } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";

interface QRCodeCardProps {
  // Full URL the QR encodes, e.g. https://app.example.com/kopiloka
  url: string;
  label: string;
  token: string;
  // Base name for downloaded files (usually the location slug).
  fileName: string;
}

export default function QRCodeCard({
  url,
  label,
  token,
  fileName,
}: QRCodeCardProps) {
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  const triggerDownload = (href: string, name: string) => {
    const a = document.createElement("a");
    a.href = href;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // PNG: grab the high-res hidden canvas → data URL.
  const downloadPng = () => {
    const canvas = canvasWrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    triggerDownload(canvas.toDataURL("image/png"), `${fileName}-qr.png`);
  };

  // SVG: serialize the rendered <svg> (crisp at any print size).
  const downloadSvg = () => {
    const svg = svgWrapRef.current?.querySelector("svg");
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    triggerDownload(href, `${fileName}-qr.svg`);
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  };

  const valid = !!url;

  return (
    <div className="flex flex-col items-center gap-4 bg-white/[0.035] backdrop-blur-[20px] border border-white/[0.06] rounded-xl p-6">
      {/* QR Code (real, encodes the location URL) */}
      <div className="w-[240px] h-[240px] bg-white rounded-xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.4)] p-4">
        {valid ? (
          <div ref={svgWrapRef} className="flex items-center justify-center">
            <QRCodeSVG
              value={url}
              size={208}
              level="M"
              marginSize={2}
              bgColor="#FFFFFF"
              fgColor="#000000"
              title={label}
            />
          </div>
        ) : (
          <span className="text-sm text-gray-400">Memuat…</span>
        )}
      </div>

      {/* Hidden high-res canvas, used only to export a print-quality PNG */}
      {valid && (
        <div ref={canvasWrapRef} className="hidden" aria-hidden="true">
          <QRCodeCanvas
            value={url}
            size={1024}
            level="M"
            marginSize={2}
            bgColor="#FFFFFF"
            fgColor="#000000"
          />
        </div>
      )}

      {/* Label */}
      <p className="text-sm font-semibold text-white text-center">{label}</p>

      {/* The encoded URL — so the admin can verify where it points */}
      {valid && (
        <p className="text-[12px] text-admin-text-muted text-center break-all">
          {url}
        </p>
      )}

      {/* Token */}
      <p className="text-[13px] text-admin-text-muted">
        Token:{" "}
        <code className="font-mono text-admin-accent bg-admin-accent/10 px-2 py-[3px] rounded text-[13px]">
          {token}
        </code>
      </p>

      {/* Download buttons */}
      <div className="flex gap-2 w-full mt-1">
        <button
          type="button"
          disabled={!valid}
          className="inline-flex items-center justify-center gap-1.5 flex-1 px-4 py-2.5 rounded-lg font-[inherit] text-[13px] font-semibold cursor-pointer transition-all duration-200 outline-none bg-admin-primary/15 text-admin-accent border border-admin-primary/35 hover:bg-admin-primary/25 hover:-translate-y-px active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={downloadPng}
        >
          ⬇ PNG
        </button>
        <button
          type="button"
          disabled={!valid}
          className="inline-flex items-center justify-center gap-1.5 flex-1 px-4 py-2.5 rounded-lg font-[inherit] text-[13px] font-semibold cursor-pointer transition-all duration-200 outline-none bg-transparent text-admin-text-body border border-white/[0.12] hover:border-white/25 hover:text-white hover:-translate-y-px active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={downloadSvg}
        >
          ⬇ SVG
        </button>
      </div>
    </div>
  );
}
