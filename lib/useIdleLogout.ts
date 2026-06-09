// ═══════════════════════════════════════════
// NetSpace — Idle auto-logout hook
//
// NetSpace sessions are presence-based: you're only "in the room" while you're
// actually using the app. This hook ends the session after a stretch of no
// interaction (tap / key / scroll / tab focus). It also nudges the backend with
// a throttled keep-alive "ping" on activity so an active-but-quiet reader isn't
// reaped by the server's read-deadline safety net.
// ═══════════════════════════════════════════

import { useEffect, useRef } from "react";
import { wsClient } from "./ws";

// Log out after this much inactivity.
const IDLE_LIMIT_MS = 30 * 60 * 1000; // 30 minutes
// Tell the server we're alive at most this often (cheap keep-alive).
const PING_THROTTLE_MS = 60 * 1000; // 1 minute

// Events that count as "the user is still here". scroll is observed in the
// capture phase so scrolling inside nested containers (chat list, etc.) counts
// too, since scroll events don't bubble.
const ACTIVITY_EVENTS = ["pointerdown", "keydown", "touchstart", "scroll"];

/**
 * Runs `onExpire` after IDLE_LIMIT_MS of no user interaction.
 *
 * @param enabled  Only arm the timer for a real, authenticated session.
 * @param onExpire Called once when the idle limit is reached. Kept current via
 *                 a ref, so callers can pass a fresh closure each render.
 */
export function useIdleLogout(enabled: boolean, onExpire: () => void): void {
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let lastPing = 0;
    let expired = false;

    const fireExpire = () => {
      if (expired) return; // guard against double-fire
      expired = true;
      onExpireRef.current();
    };

    const resetTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(fireExpire, IDLE_LIMIT_MS);
    };

    const onActivity = () => {
      if (expired) return;
      // A backgrounded tab firing stray events shouldn't count as presence.
      if (document.visibilityState === "hidden") return;
      resetTimer();
      const now = Date.now();
      if (now - lastPing > PING_THROTTLE_MS) {
        lastPing = now;
        wsClient.send("ping", {});
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") onActivity();
    };

    ACTIVITY_EVENTS.forEach((e) =>
      window.addEventListener(e, onActivity, { capture: true, passive: true })
    );
    document.addEventListener("visibilitychange", onVisibility);

    resetTimer(); // start the clock

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      ACTIVITY_EVENTS.forEach((e) =>
        window.removeEventListener(e, onActivity, { capture: true })
      );
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);
}
