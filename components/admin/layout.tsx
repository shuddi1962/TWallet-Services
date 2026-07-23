"use client";

import { ReactNode, useState } from "react";
import { AdminSidebar } from "./sidebar";
import { AdminHeader } from "./header";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-50">
      <AdminSidebar />
      <div className="lg:pl-[240px] transition-all duration-300">
        <AdminHeader onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main className="p-6" aria-label="Admin Dashboard">
          {children}
        </main>
      </div>
    </div>
  );
}
