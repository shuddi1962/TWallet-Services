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
import { TwalletCard, finishForSlug, networkForSlug } from "@/components/cards/twallet-card";
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
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  paid: "bg-sky-50 text-sky-700 ring-sky-200",
  processing: "bg-violet-50 text-violet-700 ring-violet-200",
  shipped: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
  refunded: "bg-slate-100 text-slate-600 ring-slate-200",
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
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className={cn("absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl", accent)} />
      <div className="relative flex items-start justify-between">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 ring-1 ring-neutral-200")}>
          <Icon className="h-5 w-5 text-black" />
        </div>
        {href && (
          <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-black" />
        )}
      </div>
      <p className="relative mt-4 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="relative mt-1 text-sm text-slate-500">{label}</p>
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
            accent="bg-black"
            href="/dashboard/cards"
          />
          <PremiumStat
            label="Total Orders"
            value={data.stats.totalOrders}
            icon={ShoppingBag}
            accent="bg-black"
            href="/dashboard/orders"
          />
          <PremiumStat
            label="Wallets"
            value={data.stats.walletCount}
            icon={Wallet}
            accent="bg-black"
            href="/dashboard/wallet"
          />
          <PremiumStat
            label="Total Spent"
            value={`$${Number(data.stats.totalSpent).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            icon={TrendingUp}
            accent="bg-black"
            href="/dashboard/transactions"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="grid gap-6 xl:grid-cols-5">
          <div className="space-y-6 xl:col-span-3">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-neutral-900/10 blur-3xl" />
              <div className="relative mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">My Card</h2>
                  <p className="text-sm text-slate-500">Your latest order status</p>
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
                  <TwalletCard
                    finish={finishForSlug((featuredOrder.card_products as { slug?: string } | null)?.slug)}
                    holderName={data.userName?.toUpperCase() || "CARDHOLDER"}
                    panDisplay="4532 •••• •••• 4281"
                    expiry="08/29"
                    network={networkForSlug((featuredOrder.card_products as { slug?: string } | null)?.slug)}
                    isVirtual={featuredOrder.card_products?.type !== "physical"}
                    balanceLabel={`$${Number(featuredOrder.amount_usdc).toFixed(2)}`}
                    className="max-w-none"
                  />

                  <div className="flex flex-col justify-center space-y-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Order number</p>
                      <p className="mt-1 font-mono text-sm text-slate-900">{featuredOrder.order_number}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Status</p>
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
                      <Link href="/dashboard/cards">Manage card</Link>
                    </Button>
                    <Button variant="ghost" className="rounded-xl" asChild>
                      <Link href={`/dashboard/orders/${featuredOrder.id}`}>View order details</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-14 text-center">
                  <CreditCard className="h-10 w-10 text-slate-400" />
                  <p className="mt-3 font-medium text-slate-900">No cards yet</p>
                  <p className="mt-1 max-w-xs text-sm text-slate-500">
                    Order a virtual or physical crypto card in under a minute.
                  </p>
                  <Button className="mt-5 rounded-full" asChild>
                    <Link href="/dashboard/cards">Browse cards</Link>
                  </Button>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-black" />
                  <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
                </div>
                <Link href="/dashboard/orders" className="text-sm text-black hover:text-neutral-700">
                  View all
                </Link>
              </div>
              {data.recentOrders.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-400">No orders yet</p>
              ) : (
                <div className="space-y-2">
                  {data.recentOrders.map((order: any) => (
                    <Link
                      key={order.id}
                      href={`/dashboard/orders/${order.id}`}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 transition hover:border-neutral-300 hover:bg-neutral-100"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {order.card_products?.name ?? "Card"} — $
                          {Number(order.amount_usdc).toFixed(2)}
                        </p>
                        <p className="mt-0.5 font-mono text-xs text-slate-500">{order.order_number}</p>
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
