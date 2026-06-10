"use client";

import React, { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ChatBubble from "@/components/ui/ChatBubble";
import { useAdminStore } from "@/store/useAdminStore";
import {
  deleteAllPublicMessages,
  getActiveUsers,
  getAdminPublicMessages,
  type AdminPublicMessage,
} from "@/services/adminApi";
import {
  adminWsClient,
  useAdminWsEvent,
  useAdminWsStatus,
} from "@/lib/ws";
import {
  EV,
  type NewPublicMessageEvent,
  type PublicMessagesClearedEvent,
  type UserJoinedEvent,
  type UserLeftEvent,
} from "@/lib/wsTypes";

export default function AdminPublicChatPage() {
  const params = useParams();
  const location = params.location as string;
  const token = useAdminStore((state) => state.token);

  const [messages, setMessages] = useState<AdminPublicMessage[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const connected = useAdminWsStatus();

  const refreshOnlineCount = useCallback(async () => {
    try {
      const users = await getActiveUsers(location);
      setOnlineCount(users.length);
    } catch {
      // The chat remains usable if the presence snapshot briefly fails.
    }
  }, [location]);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setMessages(await getAdminPublicMessages(location));
    } catch {
      setError("Gagal memuat riwayat public chat. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    if (!token || !location) return;
    adminWsClient.connect(token, location);
    const bootstrap = setTimeout(() => {
      loadMessages();
      refreshOnlineCount();
    }, 0);

    const interval = setInterval(refreshOnlineCount, 15_000);
    return () => {
      clearTimeout(bootstrap);
      clearInterval(interval);
      adminWsClient.disconnect();
    };
  }, [token, location, loadMessages, refreshOnlineCount]);

  useAdminWsEvent<NewPublicMessageEvent>(EV.NEW_PUBLIC_MESSAGE, (message) => {
    setMessages((current) => {
      if (current.some((item) => item.id === message.id)) return current;
      return [...current, message];
    });
  });

  useAdminWsEvent<PublicMessagesClearedEvent>(
    EV.PUBLIC_MESSAGES_CLEARED,
    (event) => {
      if (event.locationSlug === location) setMessages([]);
    }
  );

  useAdminWsEvent<UserJoinedEvent>(EV.USER_JOINED, refreshOnlineCount);
  useAdminWsEvent<UserLeftEvent>(EV.USER_LEFT, refreshOnlineCount);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message || message.length > 500 || !connected) return;

    adminWsClient.send("send_public_message", {
      locationSlug: location,
      message,
    });
    setDraft("");
  };

  const handleDeleteAll = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteAllPublicMessages(location);
      setMessages([]);
      setShowDeleteModal(false);
    } catch {
      setDeleteError("Chat belum berhasil dihapus. Silakan coba lagi.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex h-[calc(100vh-140px)] min-h-[560px] flex-col">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="mb-1 text-2xl font-extrabold tracking-tight text-white">
              Public Chat
            </h1>
            <p className="text-[13px] text-admin-text-muted">
              Pantau dan ikut berbicara dengan user di lokasi ini.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs text-admin-text-body">
              <span className="h-2 w-2 rounded-full bg-admin-success shadow-[0_0_7px_rgba(52,211,153,0.75)]" />
              {onlineCount} user aktif
            </span>
            <button
              type="button"
              onClick={() => {
                setDeleteError(null);
                setShowDeleteModal(true);
              }}
              disabled={messages.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2 text-xs font-semibold text-admin-danger transition hover:-translate-y-px hover:border-red-400/50 hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5" />
              </svg>
              Delete Chat All
            </button>
          </div>
        </div>

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-[20px]">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-admin-text-muted">
              Percakapan Publik
            </span>
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${connected ? "text-admin-success" : "text-admin-warning"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-admin-success" : "bg-admin-warning animate-admin-pulse"}`} />
              {connected ? "Realtime terhubung" : "Menghubungkan..."}
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-5">
            {loading ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="h-7 w-7 animate-admin-spin rounded-full border-[3px] border-admin-primary/25 border-t-admin-primary" />
              </div>
            ) : error ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <p className="text-sm text-admin-text-body">{error}</p>
                <button
                  type="button"
                  onClick={loadMessages}
                  className="rounded-lg border border-admin-primary/35 bg-admin-primary/10 px-4 py-2 text-xs font-semibold text-admin-accent hover:bg-admin-primary/20"
                >
                  Coba Lagi
                </button>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-admin-primary/20 bg-admin-primary/10 text-admin-accent">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-white">Belum ada pesan</p>
                <p className="mt-1 text-xs text-admin-text-muted">
                  Mulai percakapan dengan user di lokasi ini.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message.message}
                  timestamp={message.timestamp}
                  variant={message.isMine ? "mine" : "other"}
                  senderName={message.senderName}
                  senderEmoji={message.senderEmoji}
                  isAdmin={message.isAdmin}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="border-t border-white/[0.06] bg-black/10 p-4">
            <div className="flex items-end gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] p-2 focus-within:border-admin-primary/45 focus-within:bg-white/[0.055]">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value.slice(0, 500))}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                rows={1}
                placeholder="Tulis pesan sebagai admin..."
                className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-admin-text-muted"
              />
              <div className="flex items-center gap-2">
                <span className="text-[10px] tabular-nums text-admin-text-muted">
                  {draft.length}/500
                </span>
                <button
                  type="submit"
                  disabled={!draft.trim() || !connected}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#4f6eff,#7654ff)] text-white shadow-[0_5px_16px_rgba(79,110,255,0.3)] transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                  aria-label="Kirim pesan"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(8,12,24,0.78)] p-6 backdrop-blur-[6px] animate-admin-fadein"
          onClick={() => !deleting && setShowDeleteModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-[480px] rounded-[18px] border border-white/[0.08] bg-[rgba(15,20,40,0.98)] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.6)] animate-admin-pop"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/25 bg-red-400/10 text-admin-danger">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white">Hapus semua public chat?</h2>
            <p className="mt-2 text-sm leading-relaxed text-admin-text-body">
              Seluruh riwayat chat di lokasi ini akan dihapus untuk admin dan semua user. Tindakan ini tidak dapat dibatalkan.
            </p>
            {deleteError && (
              <p className="mt-4 rounded-lg border border-red-400/20 bg-red-400/[0.07] px-3 py-2 text-xs text-admin-danger">
                {deleteError}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg border border-white/15 px-5 py-2.5 text-[13px] font-semibold text-admin-text-body transition hover:bg-white/5 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteAll}
                className="rounded-lg bg-[linear-gradient(135deg,#ef4444,#b91c1c)] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_6px_18px_rgba(239,68,68,0.28)] transition hover:-translate-y-px disabled:cursor-wait disabled:opacity-60"
              >
                {deleting ? "Menghapus..." : "Ya, Hapus Semua"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
