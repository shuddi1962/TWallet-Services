"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  CreditCard,
  Coins,
  LifeBuoy,
  BarChart3,
  Settings,
  ScrollText,
  LogOut,
  ChevronLeft,
  Search,
  Wallet,
  Send,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, route: "/admin" },
  { label: "Users", icon: Users, route: "/admin/users" },
  { label: "Orders", icon: ShoppingBag, route: "/admin/orders" },
  { label: "Cards", icon: CreditCard, route: "/admin/cards" },
  { label: "Payments", icon: Coins, route: "/admin/payments" },
  { label: "Wallets", icon: Wallet, route: "/admin/wallets" },
  { label: "Sweep", icon: Send, route: "/admin/sweep" },
  { label: "Analytics", icon: BarChart3, route: "/admin/analytics" },
  { label: "Support", icon: LifeBuoy, route: "/admin/support" },
  { label: "Settings", icon: Settings, route: "/admin/settings" },
  { label: "Audit Logs", icon: ScrollText, route: "/admin/audit" },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({ mobileOpen, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("admin-sidebar-collapsed");
    if (stored) setCollapsed(stored === "true");
  }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("admin-sidebar-collapsed", String(next));
  };

  const filtered = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      {mobileOpen && onCloseMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-white/[0.06] bg-[#070b14] transition-all duration-300",
          collapsed ? "w-[76px]" : "w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        aria-label="Admin navigation"
      >
        <div className="flex h-16 items-center gap-2 border-b border-white/[0.06] px-4">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 shadow-lg shadow-brand-600/30">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="block text-sm font-bold text-white">Trust</span>
                <span className="block text-[10px] uppercase tracking-wider text-surface-500">Admin</span>
              </div>
            </div>
          )}
          <button
            onClick={toggle}
            className="ml-auto rounded-lg p-1.5 text-surface-400 transition hover:bg-white/5 hover:text-white"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        {!collapsed && (
          <div className="px-3 pt-4">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-surface-400">
              <Search className="h-4 w-4" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search…"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-surface-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search navigation"
              />
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {filtered.map((item) => {
            const isActive =
              pathname === item.route ||
              (item.route !== "/admin" && pathname.startsWith(item.route));
            return (
              <Link
                key={item.route}
                href={item.route}
                onClick={onCloseMobile}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/20"
                    : "text-surface-400 hover:bg-white/[0.04] hover:text-white",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-400" />
                )}
                <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/[0.06] p-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-surface-500 transition hover:bg-white/[0.04] hover:text-white"
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
            {!collapsed && <span>Exit Admin</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
