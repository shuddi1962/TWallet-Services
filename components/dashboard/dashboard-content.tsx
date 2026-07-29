"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wallet,
  CreditCard,
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Activity,
} from "lucide-react";
import { WelcomeBanner } from "./welcome-banner";
import { QuickActions } from "./quick-actions";
import { WalletOverview } from "./wallet-overview";
import { NotificationPanel } from "./notification-panel";
import { ActivityTimeline } from "./activity-timeline";
import { Button } from "@/components/ui/button";
import type { DashboardData } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-300 ring-amber-500/20",
  paid: "bg-sky-500/15 text-sky-300 ring-sky-500/20",
  processing: "bg-violet-500/15 text-violet-300 ring-violet-500/20",
  shipped: "bg-indigo-500/15 text-indigo-300 ring-indigo-500/20",
  delivered: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/20",
  cancelled: "bg-red-500/15 text-red-300 ring-red-500/20",
  refunded: "bg-surface-700 text-surface-300 ring-white/10",
};

function PremiumStat({
  label,
  value,
  icon: Icon,
  accent,
  href,
}: {
  label: string;
  value: string | number;
  icon: typeof CreditCard;
  accent: string;
  href?: string;
}) {
  const inner = (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 transition hover:border-white/15 hover:shadow-xl hover:shadow-brand-500/5">
      <div className={cn("absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-30 blur-2xl", accent)} />
      <div className="relative flex items-start justify-between">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl ring-1", accent.includes("brand") ? "bg-brand-500/15 text-brand-300 ring-brand-500/25" : "bg-white/5 text-white ring-white/10")}>
          <Icon className="h-5 w-5" />
        </div>
        {href && (
          <ArrowUpRight className="h-4 w-4 text-surface-600 transition group-hover:text-brand-300" />
        )}
      </div>
      <p className="relative mt-4 text-2xl font-bold tracking-tight text-white">{value}</p>
      <p className="relative mt-1 text-sm text-surface-400">{label}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export function DashboardContent({ data }: { data: DashboardData }) {
  const activities = [
    ...data.recentOrders.map((o: any) => ({
      id: o.id,
      type: "order" as const,
      title: `Order ${o.order_number}`,
      description: `Status: ${o.status}`,
      timestamp: o.created_at,
    })),
    ...data.recentTransactions.map((t: any) => ({
      id: t.id,
      type: "wallet" as const,
      title: `Payment ${t.status}`,
      description: `${t.amount} USDC`,
      timestamp: t.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  const featuredOrder = data.recentOrders[0] as any;

  return (
    <>
      <motion.div
        className="space-y-6 pb-24 sm:pb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <WelcomeBanner name={data.userName} />
        </motion.div>

        <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <PremiumStat
            label="Active Cards"
            value={data.stats.activeCards}
            icon={CreditCard}
            accent="bg-brand-500"
            href="/dashboard/cards"
          />
          <PremiumStat
            label="Total Orders"
            value={data.stats.totalOrders}
            icon={ShoppingBag}
            accent="bg-violet-500"
            href="/dashboard/orders"
          />
          <PremiumStat
            label="Wallets"
            value={data.stats.walletCount}
            icon={Wallet}
            accent="bg-sky-500"
            href="/dashboard/wallet"
          />
          <PremiumStat
            label="Total Spent"
            value={`$${Number(data.stats.totalSpent).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            icon={TrendingUp}
            accent="bg-emerald-500"
            href="/dashboard/transactions"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="grid gap-6 xl:grid-cols-5">
          <div className="space-y-6 xl:col-span-3">
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-surface-900/90 to-[#0a1020] p-6">
              <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl" />
              <div className="relative mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">My Card</h2>
                  <p className="text-sm text-surface-400">Your latest order status</p>
                </div>
                <Button size="sm" className="rounded-full" asChild>
                  <Link href="/dashboard/cards">
                    <Plus className="h-4 w-4" />
                    New card
                  </Link>
                </Button>
              </div>

              {featuredOrder ? (
                <div className="relative grid gap-5 md:grid-cols-2">
                  <div className="aspect-[1.586/1] overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-indigo-700 to-violet-900 p-5 text-white shadow-2xl shadow-brand-600/30">
                    <div className="flex h-full flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div className="h-8 w-11 rounded-md bg-gradient-to-br from-amber-200 to-amber-500" />
                        <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                          {featuredOrder.card_products?.type ?? "card"}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-white/60">Card balance / order</p>
                        <p className="mt-1 text-2xl font-bold">
                          ${Number(featuredOrder.amount_usdc).toFixed(2)}
                        </p>
                        <div className="mt-3 flex items-end justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/50">Product</p>
                            <p className="text-sm font-medium">
                              {featuredOrder.card_products?.name ?? "TWallet Card"}
                            </p>
                          </div>
                          <p className="text-xs font-bold tracking-[0.2em]">VISA</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs text-surface-500">Order number</p>
                      <p className="mt-1 font-mono text-sm text-white">{featuredOrder.order_number}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs text-surface-500">Status</p>
                      <span
                        className={cn(
                          "mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1",
                          STATUS_STYLE[featuredOrder.status] ?? STATUS_STYLE.pending,
                        )}
                      >
                        {featuredOrder.status}
                      </span>
                    </div>
                    <Button variant="outline" className="rounded-xl" asChild>
                      <Link href={`/dashboard/orders/${featuredOrder.id}`}>View order details</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-14 text-center">
                  <CreditCard className="h-10 w-10 text-surface-600" />
                  <p className="mt-3 font-medium text-white">No cards yet</p>
                  <p className="mt-1 max-w-xs text-sm text-surface-400">
                    Order a virtual or physical crypto card in under a minute.
                  </p>
                  <Button className="mt-5 rounded-full" asChild>
                    <Link href="/dashboard/cards">Browse cards</Link>
                  </Button>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/[0.07] bg-surface-900/50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-brand-400" />
                  <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
                </div>
                <Link href="/dashboard/orders" className="text-sm text-brand-400 hover:text-brand-300">
                  View all
                </Link>
              </div>
              {data.recentOrders.length === 0 ? (
                <p className="py-10 text-center text-sm text-surface-500">No orders yet</p>
              ) : (
                <div className="space-y-2">
                  {data.recentOrders.map((order: any) => (
                    <Link
                      key={order.id}
                      href={`/dashboard/orders/${order.id}`}
                      className="flex items-center justify-between rounded-2xl border border-white/[0.05] bg-white/[0.02] px-4 py-3.5 transition hover:border-brand-500/30 hover:bg-brand-500/5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {order.card_products?.name ?? "Card"} — $
                          {Number(order.amount_usdc).toFixed(2)}
                        </p>
                        <p className="mt-0.5 font-mono text-xs text-surface-500">{order.order_number}</p>
                      </div>
                      <span
                        className={cn(
                          "ml-3 shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1",
                          STATUS_STYLE[order.status] ?? STATUS_STYLE.pending,
                        )}
                      >
                        {order.status}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 xl:col-span-2">
            <WalletOverview />
            <NotificationPanel notifications={data.notifications} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <QuickActions />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ActivityTimeline activities={activities} />
        </motion.div>
      </motion.div>
    </>
  );
}
