"use client";

import { useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "@/features/auth/server/actions";
import { useSystemSettings } from "@/lib/hooks/use-system-settings";
import { toast } from "sonner";

const PROTECTED = ["/dashboard", "/admin"];

export function SessionTimeout() {
  const pathname = usePathname();
  const settings = useSystemSettings();
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warned = useRef(false);

  const isProtected = PROTECTED.some((p) => pathname?.startsWith(p));

  const logout = useCallback(async () => {
    toast.error("Session expired due to inactivity. Please sign in again.");
    await signOut();
  }, []);

  const idleMs = Math.max(1, Number(settings.security?.session_idle_minutes ?? 30)) * 60 * 1000;
  const warnMs = Math.max(1, Number(settings.security?.session_warn_minutes ?? 25)) * 60 * 1000;
  const warnLeadMs = Math.max(1, Math.round((idleMs - warnMs) / 60000));

  const resetTimers = useCallback(() => {
    if (!isProtected) return;
    warned.current = false;
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (warnTimer.current) clearTimeout(warnTimer.current);

    warnTimer.current = setTimeout(() => {
      if (!warned.current) {
        warned.current = true;
        toast.warning(`You will be signed out in ${warnLeadMs} minute${warnLeadMs === 1 ? "" : "s"} due to inactivity.`, {
          duration: 10_000,
        });
      }
    }, Math.max(warnMs, idleMs - warnLeadMs * 60 * 1000));

    idleTimer.current = setTimeout(() => {
      void logout();
    }, idleMs);
  }, [isProtected, logout, idleMs, warnMs, warnLeadMs]);

  useEffect(() => {
    if (!isProtected) return;

    const events = ["mousedown", "keydown", "touchstart", "scroll", "pointermove"] as const;
    const onActivity = () => resetTimers();

    resetTimers();
    for (const e of events) window.addEventListener(e, onActivity, { passive: true });

    return () => {
      for (const e of events) window.removeEventListener(e, onActivity);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (warnTimer.current) clearTimeout(warnTimer.current);
    };
  }, [isProtected, resetTimers]);

  return null;
}
