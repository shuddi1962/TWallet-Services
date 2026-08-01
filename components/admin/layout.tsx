"use client";

import { ReactNode, useState } from "react";
import { AdminSidebar } from "./sidebar";
import { AdminHeader } from "./header";
import { AdminRealtime } from "./admin-realtime";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900">
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />
      <div className="transition-all duration-300 lg:pl-[260px]">
        <AdminHeader onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main className="relative min-h-screen p-4 md:p-6" aria-label="Admin Dashboard">
          <div className="relative mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
      <AdminRealtime />
    </div>
  );
}
