"use client";

import { useState, useEffect } from "react";
import { Menu, X, Bell } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { ConnectButton } from "@/components/wallet/connect-button";
import { Sidebar } from "@/components/layout/sidebar";
import { DashboardSearch } from "@/components/layout/dashboard-search";
import { createClient } from "@/lib/supabase/client";

export function DashboardHeader({ userName }: { userName?: string }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [name, setName] = useState(userName ?? "U");

  useEffect(() => {
    const supabase = createClient();
    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const n =
          (user.user_metadata as { full_name?: string })?.full_name ??
          user.email?.split("@")[0] ??
          "U";
        setName(n);
        const { count } = await supabase
          .from("notifications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("read", false);
        setUnread(count ?? 0);

        const channel = supabase
          .channel(`hdr-notif-${user.id}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "notifications",
              filter: `user_id=eq.${user.id}`,
            },
            (payload: unknown) => {
              const p = payload as {
                eventType: "INSERT" | "UPDATE" | "DELETE";
                new?: Record<string, unknown> | null;
                old?: Record<string, unknown> | null;
              };
              if (p.eventType === "INSERT") {
                const read = (p.new as { read?: boolean } | null)?.read;
                if (!read) setUnread((u) => u + 1);
                return;
              }
              const row = p.eventType === "DELETE" ? p.old : p.new;
              const wasRead = (row as { read?: boolean } | null)?.read;
              if (wasRead) {
                // A notification was read or removed; recount to stay accurate.
                void (async () => {
                  const { count } = await supabase
                    .from("notifications")
                    .select("*", { count: "exact", head: true })
                    .eq("user_id", user.id)
                    .eq("read", false);
                  setUnread(count ?? 0);
                })();
              }
            },
          )
          .subscribe();
        return () => {
          void supabase.removeChannel(channel);
        };
      }
    })();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-2xl lg:px-6">
        <div className="flex items-center gap-3">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileNavOpen}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1 md:max-w-[340px]">
            <DashboardSearch />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <ConnectButton />
          </div>
          <Link
            href="/dashboard/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </Link>
          <Link href="/dashboard/profile" className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 transition hover:bg-slate-50">
            <Avatar fallback={initials} className="h-8 w-8 ring-2 ring-brand-500/30" />
            <span className="hidden max-w-[100px] truncate text-sm font-medium text-slate-700 sm:block">
              {name}
            </span>
          </Link>
        </div>
      </header>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col shadow-2xl">
            <button
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            <Sidebar onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
