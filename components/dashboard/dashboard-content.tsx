"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { motion } from "framer-motion";
import { Wallet, CreditCard, ShoppingBag, TrendingUp } from "lucide-react";
import { WelcomeBanner } from "./welcome-banner";
import { QuickActions } from "./quick-actions";
import { WalletOverview } from "./wallet-overview";
import { NotificationPanel } from "./notification-panel";
import { ActivityTimeline } from "./activity-timeline";
import { BottomTabBar } from "./bottom-tab-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardData } from "@/lib/types";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

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
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

  return (
    <>
      <motion.div className="space-y-6 pb-20 sm:pb-6" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
          <WelcomeBanner name={data.userName} />
        </motion.div>

        <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Active Cards" value={data.stats.activeCards} icon={CreditCard} />
          <StatCard label="Total Orders" value={data.stats.totalOrders} icon={ShoppingBag} />
          <StatCard label="Wallet Connections" value={data.stats.walletCount} icon={Wallet} />
          <StatCard label="Total Spent" value={data.stats.totalSpent} icon={TrendingUp} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <QuickActions />
        </motion.div>

        <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <WalletOverview />
          </div>
          <div>
            <NotificationPanel notifications={data.notifications} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {data.recentOrders.length === 0 ? (
                <p className="text-sm text-surface-400 py-8 text-center">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {data.recentOrders.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between rounded-xl border border-surface-800 bg-surface-900 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-surface-200">{order.card_products?.name ?? "Card"} — ${Number(order.amount_usdc).toFixed(2)}</p>
                        <p className="text-xs text-surface-500">{order.order_number}</p>
                      </div>
                      <span className="rounded-full bg-surface-800 px-3 py-1 text-xs text-surface-400 capitalize">{order.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ActivityTimeline activities={activities} />
        </motion.div>
      </motion.div>

      <BottomTabBar />
    </>
  );
}
