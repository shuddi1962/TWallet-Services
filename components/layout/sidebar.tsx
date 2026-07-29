"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  ShoppingCart,
  Wallet,
  ArrowLeftRight,
  LifeBuoy,
  Settings,
  Bell,
  Home,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/cards", label: "Cards", icon: CreditCard },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { href: "/dashboard/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/support", label: "Support", icon: LifeBuoy },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      className="flex h-full w-72 shrink-0 flex-col border-r border-white/[0.06] bg-[#070b14]"
      aria-label="Dashboard navigation"
    >
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-5">
        <Link href="/" className="group flex items-center gap-3" onClick={onNavigate}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 via-brand-600 to-accent-600 shadow-lg shadow-brand-600/40 transition group-hover:scale-105">
            <CreditCard className="h-5 w-5 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#070b14] bg-emerald-400" />
          </div>
          <div>
            <span className="block text-base font-bold tracking-tight text-white">TWALLET</span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-surface-500">
              Card Platform
            </span>
          </div>
        </Link>
      </div>

      <div className="px-4 pt-5">
        <Link
          href="/dashboard/cards"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:brightness-110"
        >
          <Sparkles className="h-4 w-4" />
          Order a Card
        </Link>
      </div>

      <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-surface-600">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-white/[0.07] text-white shadow-inner"
                  : "text-surface-400 hover:bg-white/[0.04] hover:text-white",
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-brand-400 to-accent-500" />
              )}
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl transition",
                  isActive
                    ? "bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/25"
                    : "bg-white/[0.03] text-surface-500 group-hover:text-surface-300",
                )}
              >
                <item.icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.06] p-3">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-surface-500 transition hover:bg-white/[0.04] hover:text-white"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
