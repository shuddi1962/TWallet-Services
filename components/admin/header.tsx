"use client";

import { Menu, Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

function breadcrumbFromPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" / ");
}

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-white/[0.06] bg-[#070b14]/85 px-4 backdrop-blur-2xl md:px-6">
      <button
        onClick={onMenuToggle}
        className="rounded-xl border border-white/10 p-2 text-surface-300 transition hover:bg-white/5 lg:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <nav aria-label="Breadcrumb">
        <div className="text-sm font-medium text-surface-400">{breadcrumbFromPath(pathname)}</div>
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <span className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-semibold text-red-300 ring-1 ring-red-500/20">
          Production
        </span>

        <Link
          href="/admin/notifications"
          className="relative rounded-xl border border-white/10 p-2 text-surface-400 transition hover:bg-white/5 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error" />
        </Link>

        <div className="flex items-center gap-2 border-l border-white/10 pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20 text-sm font-semibold text-brand-300 ring-2 ring-brand-500/20">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-tight text-white">Admin</p>
            <p className="text-xs text-surface-500">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
