"use client";

import { useState } from "react";
import { Menu, X, Wallet, Bell } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-surface-200 bg-white/80 px-4 backdrop-blur-lg lg:px-6">
      <button
        className="lg:hidden"
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
        aria-label="Toggle menu"
      >
        {mobileNavOpen ? (
          <X className="h-6 w-6 text-surface-900" />
        ) : (
          <Menu className="h-6 w-6 text-surface-900" />
        )}
      </button>

      <div className="flex items-center gap-2 lg:hidden">
        <Wallet className="h-6 w-6 text-brand-600" />
        <span className="text-lg font-bold tracking-tight text-surface-900">
          TWallet
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/notifications"
          className="relative rounded-full p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-700"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error" />
        </Link>
        <Avatar fallback="U" className="h-9 w-9" />
      </div>
    </header>
  );
}
