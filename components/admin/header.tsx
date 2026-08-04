"use client";

import Link from "next/link";
import { Menu, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { AdminBell } from "@/components/admin/admin-bell";

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
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-2xl md:px-6">
      <button
        onClick={onMenuToggle}
        className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <nav aria-label="Breadcrumb">
        <div className="text-sm font-medium text-slate-500">{breadcrumbFromPath(pathname)}</div>
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-500/20">
          Production
        </span>

        <AdminBell />

        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2 border-l border-slate-200 pl-3 transition hover:opacity-80"
          aria-label="Go to your account"
          title="Go to your account"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-tight text-slate-900">Admin</p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
          <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
