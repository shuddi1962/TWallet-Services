"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Smartphone,
  CreditCard,
  Package,
  ArrowRightLeft,
  HeadphonesIcon,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  { label: "My Wallet", href: "/dashboard/wallet", icon: Smartphone, primary: false },
  { label: "Order Card", href: "/dashboard/cards", icon: CreditCard, primary: true },
  { label: "Track Order", href: "/dashboard/orders", icon: Package, primary: false },
  { label: "Transactions", href: "/dashboard/transactions", icon: ArrowRightLeft, primary: false },
  { label: "Support", href: "/dashboard/support", icon: HeadphonesIcon, primary: false },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, primary: false },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function QuickActions() {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
      >
        {actions.map((action) => (
          <motion.div key={action.label} variants={itemVariants}>
            <Button
              variant={action.primary ? "dark" : "ghost"}
              fullWidth
              asChild
              className={!action.primary ? "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50" : undefined}
            >
              <Link href={action.href}>
                <action.icon className="h-4 w-4" aria-hidden="true" />
                <span className="text-xs sm:text-sm">{action.label}</span>
              </Link>
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
