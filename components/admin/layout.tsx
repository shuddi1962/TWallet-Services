"use client";

import { ReactNode, useEffect, useState } from "react";
import { AdminSidebar } from "./sidebar";
import { AdminHeader } from "./header";
import { AdminRealtime } from "./admin-realtime";
import { cn } from "@/lib/utils/cn";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin-sidebar-collapsed");
    if (stored) setSidebarCollapsed(stored === "true");
  }, []);

  const handleCollapsedChange = (next: boolean) => {
    setSidebarCollapsed(next);
    localStorage.setItem("admin-sidebar-collapsed", String(next));
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900">
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onCollapsedChange={handleCollapsedChange}
      />
      <div className={cn("transition-all duration-300", sidebarCollapsed ? "lg:pl-[76px]" : "lg:pl-[260px]")}>
        <AdminHeader onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main className="relative min-h-screen p-4 md:p-6" aria-label="Admin Dashboard">
          <div className="relative mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
      <AdminRealtime />
    </div>
  );
}
