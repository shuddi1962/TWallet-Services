"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getAdminUnreadNotificationCount, getCurrentAdminId } from "@/lib/admin/actions";

export function AdminBell() {
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const adminId = await getCurrentAdminId();
      if (cancelled) return;
      if (!adminId) {
        setReady(true);
        return;
      }
      const initial = await getAdminUnreadNotificationCount();
      if (cancelled) return;
      setCount(initial);
      setReady(true);

      const supabase = createClient();
      const channel = supabase
        .channel(`admin-hdr-notif-${adminId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "admin_notifications", filter: `admin_id=eq.${adminId}` },
          (payload: unknown) => {
            const p = payload as { eventType: string; new?: { read?: boolean } | null; old?: { read?: boolean } | null };
            if (p.eventType === "INSERT") {
              setCount((c) => (p.new?.read ? c : c + 1));
            } else if (p.eventType === "UPDATE") {
              const wasRead = p.old?.read === true;
              const isRead = p.new?.read === true;
              if (wasRead !== isRead) setCount((c) => Math.max(0, c + (isRead ? -1 : 1)));
            } else if (p.eventType === "DELETE") {
              if (p.old?.read === false) setCount((c) => Math.max(0, c - 1));
            }
          },
        )
        .subscribe();

      cleanup = () => {
        void supabase.removeChannel(channel);
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <Link
      href="/admin/notifications"
      className="relative rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
      aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ""}`}
    >
      <Bell className="h-5 w-5" aria-hidden="true" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
      {ready && count === 0 && (
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-slate-200" aria-hidden="true" />
      )}
    </Link>
  );
}
