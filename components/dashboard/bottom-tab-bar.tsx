"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  ShoppingBag,
  Smartphone,
  Bell,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const tabs = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "Trust Wallet", href: "/dashboard/wallet", icon: Smartphone },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Profile", href: "/dashboard/settings", icon: User },
] as const;

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      role="tablist"
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-surface-800 bg-surface-950/95 backdrop-blur-lg sm:hidden"
    >
      <div className="flex items-center justify-around">
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
                "flex flex-col items-center gap-0.5 px-3 py-2 text-[11px] font-medium transition-colors",
                isActive
                  ? "text-brand-400"
                  : "text-surface-500 hover:text-surface-300",
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-10 items-center justify-center rounded-lg transition-colors",
                  isActive && "bg-brand-500/10",
                )}
              >
                <tab.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
