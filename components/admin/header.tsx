"use client";

import { Menu, Bell } from "lucide-react";
import { usePathname } from "next/navigation";

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
    <header className="sticky top-0 z-40 h-[72px] bg-white border-b border-surface-200 shadow-xs flex items-center px-6 gap-4">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-surface-100 text-body"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="text-sm text-body font-medium">
        {breadcrumbFromPath(pathname)}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-danger/10 text-danger">
          Production
        </span>

        <button className="relative p-2 rounded-lg hover:bg-surface-100 text-body" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-surface-200">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-heading leading-tight">Admin</p>
            <p className="text-xs text-body">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
