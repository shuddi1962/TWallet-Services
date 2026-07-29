"use client";

import { ReactNode, useState } from "react";
import { AdminSidebar } from "./sidebar";
import { AdminHeader } from "./header";
import { AdminRealtime } from "./admin-realtime";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#05080f] text-surface-100">
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />
      <div className="transition-all duration-300 lg:pl-[260px]">
        <AdminHeader onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main className="relative p-4 md:p-6" aria-label="Admin Dashboard">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.07),transparent_45%)]" />
          <div className="relative mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
      <AdminRealtime />
    </div>
  );
}
