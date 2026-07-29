"use client";

import { useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const IDLE_MS = 30 * 60 * 1000;
const WARN_MS = 25 * 60 * 1000;
const PROTECTED = ["/dashboard", "/admin"];

export function SessionTimeout() {
  const pathname = usePathname();
  const router = useRouter();
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warned = useRef(false);

  const isProtected = PROTECTED.some((p) => pathname?.startsWith(p));

  const logout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.error("Session expired due to inactivity. Please sign in again.");
    router.push("/auth/login");
  }, [router]);

  const resetTimers = useCallback(() => {
    if (!isProtected) return;
    warned.current = false;
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (warnTimer.current) clearTimeout(warnTimer.current);

    warnTimer.current = setTimeout(() => {
      if (!warned.current) {
        warned.current = true;
        toast.warning("You will be signed out in 5 minutes due to inactivity.", {
          duration: 10_000,
        });
      }
    }, WARN_MS);

    idleTimer.current = setTimeout(() => {
      void logout();
    }, IDLE_MS);
  }, [isProtected, logout]);

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
