"use client";

import { useState } from "react";
import { Menu, X, CreditCard, Bell } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";

export function DashboardHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/5 bg-surface-950/80 px-4 backdrop-blur-xl lg:px-6">
      <button
        className="lg:hidden"
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
        aria-label="Toggle menu"
      >
        {mobileNavOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>

      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-600/20">
          <CreditCard className="h-4.5 w-4.5 text-white" />
        </div>
        <span className="text-base font-bold tracking-tight text-white">
          TWALLET
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/notifications"
          className="relative rounded-full p-2 text-surface-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error" />
        </Link>
        <Avatar fallback="U" className="h-9 w-9 ring-2 ring-brand-500/20" />
      </div>
    </header>
  );
}
