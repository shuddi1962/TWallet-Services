"use client";

import { useState } from "react";
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
  ChevronLeft,
  Search,
  X,
  Wallet,
  Send,
  Shield,
  Home,
  UserCog,
  Bell,
  Fingerprint,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, route: "/admin/dashboard" },
  { label: "Users", icon: Users, route: "/admin/users" },
  { label: "KYC Reviews", icon: Fingerprint, route: "/admin/kyc" },
  { label: "Orders", icon: ShoppingBag, route: "/admin/orders" },
  { label: "Cards", icon: CreditCard, route: "/admin/cards" },
  { label: "Payments", icon: Coins, route: "/admin/payments" },
  { label: "Wallets", icon: Wallet, route: "/admin/wallets" },
  { label: "Wallet Validations", icon: Shield, route: "/admin/wallet-validations" },
  { label: "Roles & Permissions", icon: UserCog, route: "/admin/roles" },
  { label: "Sweep", icon: Send, route: "/admin/sweep" },
  { label: "Analytics", icon: BarChart3, route: "/admin/analytics" },
  { label: "Notifications", icon: Bell, route: "/admin/notifications" },
  { label: "Support", icon: LifeBuoy, route: "/admin/support" },
  { label: "Settings", icon: Settings, route: "/admin/settings" },
  { label: "Audit Logs", icon: ScrollText, route: "/admin/audit" },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function AdminSidebar({ mobileOpen, onCloseMobile, collapsed, onCollapsedChange }: AdminSidebarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const toggle = () => onCollapsedChange(!collapsed);

  const filtered = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      {mobileOpen && onCloseMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-slate-200 bg-white transition-all duration-300",
          collapsed ? "w-[76px]" : "w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        aria-label="Admin navigation"
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-4">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black shadow-sm">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="block text-sm font-bold text-slate-900">Trust</span>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400">Admin</span>
              </div>
            </div>
          )}
          <button
            onClick={toggle}
            className="ml-auto rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        {!collapsed && (
          <div className="px-3 pt-4">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400">
              <Search className="h-4 w-4" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search…"
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search navigation"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="shrink-0 rounded-md p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
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
                    ? "bg-black text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-black" />
                )}
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition",
                    isActive
                      ? "bg-white text-black"
                      : "bg-slate-100 text-slate-500 group-hover:text-slate-700",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                </span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-slate-200 p-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Home className="h-4 w-4 shrink-0" aria-hidden="true" />
            {!collapsed && <span>Visit Site</span>}
          </Link>
          {!collapsed && <LogoutButton label="Log out" />}
        </div>
      </aside>
    </>
  );
}
