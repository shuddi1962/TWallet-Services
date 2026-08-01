"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, CreditCard, ShoppingBag, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const tabs = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Cards", href: "/dashboard/cards", icon: CreditCard },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "Wallet", href: "/dashboard/wallet", icon: Wallet },
  { label: "Settings", href: "/dashboard/settings", icon: User },
] as const;

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      role="tablist"
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl lg:hidden"
    >
      <div className="flex items-center justify-around px-1 pt-1">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-medium transition-colors",
                isActive ? "text-black" : "text-slate-400 hover:text-slate-600",
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-12 items-center justify-center rounded-xl transition-colors",
                  isActive && "bg-black text-white shadow-sm",
                )}
              >
                <tab.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="truncate">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
