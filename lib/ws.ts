// ═══════════════════════════════════════════
// NetSpace — Frontend WebSocket client (singleton)
// Talks to the Go backend's /ws endpoint.
//
// Connection URL:
//   ws://<host>/ws?token=<jwt>&locationSlug=<slug>
//
// Wire format (both directions): { "event": string, "data": object }
// ═══════════════════════════════════════════

import { useEffect, useRef, useState } from "react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

// http -> ws, https -> wss
function wsBaseUrl(): string {
  return BASE_URL.replace(/^http/, "ws");
}

type Handler<T = unknown> = (data: T) => void;

// Internal lifecycle events components can subscribe to.
export const WS_OPEN = "__open";
export const WS_CLOSE = "__close";

class WsClient {
  private socket: WebSocket | null = null;
  private token = "";
  private locationSlug = "";
  private connectedKey = "";
  private shouldReconnect = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private queue: string[] = [];
  private listeners = new Map<string, Set<Handler>>();

  /** Idempotent: connecting twice with the same creds is a no-op. */
  connect(token: string, locationSlug: string): void {
    if (typeof window === "undefined") return;
    if (!token || !locationSlug) return;

    const key = `${token}::${locationSlug}`;
    const live =
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING);

    if (live && this.connectedKey === key) return; // already connected

    // Creds changed (e.g. new session) — tear the old socket down first.
    if (this.socket && this.connectedKey !== key) {
      this.teardown();
    }

    this.token = token;
    this.locationSlug = locationSlug;
    this.connectedKey = key;
    this.shouldReconnect = true;
    this.open();
  }

  private open(): void {
    if (!this.token || !this.locationSlug) return;

    const url = `${wsBaseUrl()}/ws?token=${encodeURIComponent(
      this.token
    )}&locationSlug=${encodeURIComponent(this.locationSlug)}`;

    let socket: WebSocket;
    try {
      socket = new WebSocket(url);
    } catch (err) {
      console.error("[ws] failed to open socket", err);
      this.scheduleReconnect();
      return;
    }
    this.socket = socket;

    socket.onopen = () => {
      // Flush anything queued while we were connecting.
      const pending = this.queue;
      this.queue = [];
      pending.forEach((m) => socket.send(m));
      this.emit(WS_OPEN, null);
    };

    socket.onmessage = (ev: MessageEvent) => {
      let parsed: { event?: string; data?: unknown };
      try {
        parsed = JSON.parse(ev.data as string);
      } catch {
        return;
      }
      if (parsed && typeof parsed.event === "string") {
        this.emit(parsed.event, parsed.data);
      }
    };

    socket.onclose = () => {
      if (this.socket === socket) this.socket = null;
      this.emit(WS_CLOSE, null);
      this.scheduleReconnect();
    };

    socket.onerror = () => {
      try {
        socket.close();
      } catch {
        /* noop */
      }
    };
  }

  private scheduleReconnect(): void {
    if (!this.shouldReconnect) return;
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.open();
    }, 1500);
  }

  private teardown(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      try {
        this.socket.onclose = null;
        this.socket.close();
      } catch {
        /* noop */
      }
      this.socket = null;
    }
  }

  /** Closes the socket and stops reconnecting (call on logout). */
  disconnect(): void {
    this.shouldReconnect = false;
    this.teardown();
    this.connectedKey = "";
    this.token = "";
    this.locationSlug = "";
    this.queue = [];
  }

  isConnected(): boolean {
    return !!this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  /** Send an event. If the socket isn't open yet, the message is queued. */
  send(event: string, data: unknown): void {
    const message = JSON.stringify({ event, data });
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      this.queue.push(message);
    }
  }

  /** Subscribe to an event. Returns an unsubscribe function. */
  on<T = unknown>(event: string, handler: Handler<T>): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(handler as Handler);
    return () => {
      set!.delete(handler as Handler);
    };
  }

  private emit(event: string, data: unknown): void {
    const set = this.listeners.get(event);
    if (set) set.forEach((h) => h(data));
  }
}

export const wsClient = new WsClient();

// ── React hooks ──

/** Subscribe to a WS event for the lifetime of the component. */
export function useWsEvent<T = unknown>(
  event: string,
  handler: (data: T) => void
): void {
  const ref = useRef(handler);
  ref.current = handler;

  useEffect(() => {
    const off = wsClient.on<T>(event, (d) => ref.current(d));
    return off;
  }, [event]);
}

/** Live connection status, reflecting open/close events. */
export function useWsStatus(): boolean {
  const [connected, setConnected] = useState<boolean>(() =>
    wsClient.isConnected()
  );
  useEffect(() => {
    const offOpen = wsClient.on(WS_OPEN, () => setConnected(true));
    const offClose = wsClient.on(WS_CLOSE, () => setConnected(false));
    setConnected(wsClient.isConnected());
    return () => {
      offOpen();
      offClose();
    };
  }, []);
  return connected;
}
