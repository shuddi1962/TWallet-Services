"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, ShoppingBag, CreditCard, Coins,
  LifeBuoy, BarChart3, Settings, ScrollText, LogOut,
  ChevronLeft, Search,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, route: "/admin", roles: ["super_admin", "operations", "finance", "support", "viewer"] },
  { label: "Users", icon: Users, route: "/admin/users", roles: ["super_admin", "operations"] },
  { label: "Orders", icon: ShoppingBag, route: "/admin/orders", roles: ["super_admin", "operations", "finance"] },
  { label: "Cards", icon: CreditCard, route: "/admin/cards", roles: ["super_admin", "operations"] },
  { label: "Payments", icon: Coins, route: "/admin/payments", roles: ["super_admin", "finance"] },
  { label: "Analytics", icon: BarChart3, route: "/admin/analytics", roles: ["super_admin", "finance", "viewer"] },
  { label: "Support", icon: LifeBuoy, route: "/admin/support", roles: ["super_admin", "support", "operations"] },
  { label: "Settings", icon: Settings, route: "/admin/settings", roles: ["super_admin"] },
  { label: "Audit Logs", icon: ScrollText, route: "/admin/audit", roles: ["super_admin"] },
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
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-surface-200 z-50 flex flex-col transition-all duration-300 ${collapsed ? "w-[72px]" : "w-[240px]"} ${
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
      aria-label="Admin navigation"
    >
      <div className="flex items-center gap-2 p-4 border-b border-surface-200">
        {!collapsed && <span className="text-xl font-bold text-primary">TWALLET</span>}
        <button
          onClick={toggle}
          className="p-1.5 rounded-lg hover:bg-surface-100 text-body transition-colors ml-auto"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      </div>

      {!collapsed && (
        <div className="px-3 pt-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-surface-100 rounded-lg text-body text-sm">
            <Search className="w-4 h-4" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search navigation..."
              className="bg-transparent border-none outline-none w-full text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search navigation"
            />
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {filtered.map((item) => {
          const isActive = pathname === item.route || (item.route !== "/admin" && pathname.startsWith(item.route));
          return (
            <Link
              key={item.route}
              href={item.route}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary border-l-[3px] border-primary ml-0 pl-[9px]"
                  : "text-body hover:text-heading hover:bg-surface-100"
              }`}
              aria-current={isActive ? "page" : undefined}
              aria-label={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" aria-hidden="true" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-surface-200">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-body hover:text-heading hover:bg-surface-100 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" aria-hidden="true" />
          {!collapsed && <span>Back to Site</span>}
        </Link>
      </div>
    </aside>
  );
}
