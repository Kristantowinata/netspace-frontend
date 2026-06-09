"use client";

import React, { useCallback, useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useWsEvent } from "@/lib/ws";
import { EV, type NotificationDTO } from "@/lib/wsTypes";

// How long the toast stays up before auto-dismissing. The progress bar animates
// over this same duration so the countdown is visible.
const DURATION_MS = 5000;

interface ToastData {
  // key forces the progress bar to restart its CSS animation when a new
  // message replaces the current toast.
  key: number;
  senderId: string;
  emoji: string;
  title: string;
  message: string;
}

// Strip the wrapping quotes the backend adds around the message preview
// (Description is `"<message>"`), so the toast reads naturally.
function cleanPreview(desc: string): string {
  return desc.replace(/^"|"$/g, "");
}

// App-wide toast for incoming DMs: slides in at the top, shows who messaged and
// the text, auto-dismisses after 5s (with a draining progress bar), and opens
// the conversation when tapped. Suppressed while you're already in that chat.
export default function MessageToast() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const location = (params.location as string) ?? "";

  const [toast, setToast] = useState<ToastData | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seq = useRef(0);

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setToast(null);
  }, []);

  useWsEvent<NotificationDTO>(EV.NEW_NOTIFICATION, (data) => {
    if (data.type !== "message" || !data.senderId) return;
    // Already reading this conversation? No need to interrupt with a toast.
    if (pathname === `/${location}/chat/${data.senderId}`) return;

    seq.current += 1;
    setToast({
      key: seq.current,
      senderId: data.senderId,
      emoji: data.emoji,
      title: data.title,
      message: cleanPreview(data.description),
    });

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), DURATION_MS);
  });

  if (!toast) return null;

  const handleOpen = () => {
    const senderId = toast.senderId;
    dismiss();
    router.push(`/${location}/chat/${senderId}`);
  };

  return (
    <div className="msg-toast" role="button" tabIndex={0} onClick={handleOpen}>
      <div className="msg-toast__avatar">{toast.emoji}</div>
      <div className="msg-toast__body">
        <p className="msg-toast__title">{toast.title}</p>
        <p className="msg-toast__text">{toast.message}</p>
      </div>
      {/* key restarts the drain animation for each new toast */}
      <div key={toast.key} className="msg-toast__progress" />

      <style jsx>{`
        .msg-toast {
          position: fixed;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 300;
          width: calc(100% - 24px);
          max-width: 366px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px 14px;
          border-radius: 16px;
          background: rgba(22, 26, 58, 0.94);
          border: 1px solid rgba(120, 150, 255, 0.3);
          box-shadow: 0 10px 32px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          cursor: pointer;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          animation: msgToastIn 0.25s ease;
        }

        .msg-toast__avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          background: linear-gradient(135deg, #f97316, #ec4899);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .msg-toast__body {
          flex: 1;
          min-width: 0;
        }

        .msg-toast__title {
          font-size: 13.5px;
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .msg-toast__text {
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.6);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 1px;
        }

        .msg-toast__progress {
          position: absolute;
          left: 0;
          bottom: 0;
          height: 3px;
          width: 100%;
          transform-origin: left center;
          background: linear-gradient(90deg, #6ac8ff, #6366f1);
          animation: msgToastDrain ${DURATION_MS}ms linear forwards;
        }

        @keyframes msgToastIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes msgToastDrain {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
      `}</style>
    </div>
  );
}
