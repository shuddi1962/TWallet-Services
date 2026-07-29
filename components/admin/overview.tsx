"use client";

import {
  Users,
  Wallet,
  Clock,
  CheckCircle,
  DollarSign,
  LifeBuoy,
  Activity,
  ArrowLeftRight,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import type { RecentOrder, RecentPayment, RecentSignup, RecentTicket, AuditEntry } from "@/lib/admin/types";
import { cn } from "@/lib/utils/cn";

interface Stats {
  totalUsers: number;
  activeWallets: number;
  pendingOrders: number;
  completedOrders: number;
  revenue: number;
  openTickets: number;
  todayTransactions: number;
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  icon: typeof Users;
  tone: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.05] to-transparent p-5 transition hover:border-white/15">
      <div className={cn("absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-20 blur-2xl", tone)} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-surface-400">{label}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-white">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-white/10", tone.replace("bg-", "bg-") + "/20")}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

function Panel({
  title,
  href,
  children,
  className,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-white/[0.07] bg-[#0b1220]/80 p-5", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        <Link href={href} className="inline-flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300">
          View all <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      {children}
    </div>
  );
}

const statusClass = (status: string) => {
  if (["delivered", "completed", "confirmed"].includes(status)) return "bg-emerald-500/15 text-emerald-300";
  if (["paid", "processing"].includes(status)) return "bg-sky-500/15 text-sky-300";
  if (["pending", "shipped"].includes(status)) return "bg-amber-500/15 text-amber-300";
  if (["failed", "cancelled"].includes(status)) return "bg-red-500/15 text-red-300";
  return "bg-white/10 text-surface-300";
};

export function AdminOverview({
  stats,
  recentOrders,
  recentPayments,
  recentSignups,
  recentTickets,
  activity,
}: {
  stats: Stats;
  recentOrders: RecentOrder[];
  recentPayments: RecentPayment[];
  recentSignups: RecentSignup[];
  recentTickets: RecentTicket[];
  activity: AuditEntry[];
}) {
  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, tone: "bg-brand-500" },
    { label: "Active Wallets", value: stats.activeWallets, icon: Wallet, tone: "bg-sky-500" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: Clock, tone: "bg-amber-500" },
    { label: "Completed Orders", value: stats.completedOrders, icon: CheckCircle, tone: "bg-emerald-500" },
    { label: "Revenue (USDC)", value: stats.revenue.toLocaleString(), icon: DollarSign, tone: "bg-emerald-500" },
    { label: "Open Tickets", value: stats.openTickets, icon: LifeBuoy, tone: "bg-violet-500" },
    { label: "System Health", value: "Healthy", icon: Activity, tone: "bg-emerald-500" },
    { label: "Today's TX", value: stats.todayTransactions, icon: ArrowLeftRight, tone: "bg-brand-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Operations</p>
          <h1 className="mt-1 text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-surface-400">Live platform pulse — orders, payments, users.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Recent Orders" href="/admin/orders" className="lg:col-span-2">
          {recentOrders.length === 0 ? (
            <p className="py-6 text-sm text-surface-500">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-left text-surface-500">
                    <th className="py-2 pr-4 font-medium">Order</th>
                    <th className="py-2 pr-4 font-medium">Customer</th>
                    <th className="py-2 pr-4 font-medium">Card</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-white/[0.04]">
                      <td className="py-3 pr-4 font-mono text-xs text-brand-300">{order.id?.slice(0, 8)}</td>
                      <td className="py-3 pr-4 text-surface-200">{order.profiles?.full_name ?? "—"}</td>
                      <td className="py-3 pr-4 text-surface-400">{order.card_products?.name ?? "—"}</td>
                      <td className="py-3 pr-4">
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium capitalize", statusClass(order.status))}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-surface-500">
                        {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <div className="space-y-6">
          <Panel title="Recent Signups" href="/admin/users">
            {recentSignups.length === 0 ? (
              <p className="text-sm text-surface-500">No signups yet</p>
            ) : (
              <div className="space-y-3">
                {recentSignups.map((user) => (
                  <div key={user.email} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/20 text-xs font-semibold text-brand-300">
                      {user.full_name?.charAt(0) ?? "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{user.full_name}</p>
                      <p className="truncate text-xs text-surface-500">{user.email}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-surface-500">
                      {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Open Tickets" href="/admin/support">
            {recentTickets.length === 0 ? (
              <p className="text-sm text-surface-500">No open tickets</p>
            ) : (
              <div className="space-y-3">
                {recentTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                        ticket.priority === "urgent"
                          ? "bg-red-500/15 text-red-300"
                          : ticket.priority === "high"
                            ? "bg-amber-500/15 text-amber-300"
                            : "bg-white/10 text-surface-300",
                      )}
                    >
                      {ticket.priority}
                    </span>
                    <p className="flex-1 truncate text-sm text-surface-200">{ticket.subject}</p>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Recent Payments" href="/admin/payments">
          {recentPayments.length === 0 ? (
            <p className="py-4 text-sm text-surface-500">No payments yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-left text-surface-500">
                    <th className="py-2 pr-4 font-medium">Tx</th>
                    <th className="py-2 pr-4 font-medium">Amount</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 font-medium">When</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((tx) => (
                    <tr key={tx.id} className="border-b border-white/[0.04]">
                      <td className="py-3 pr-4 font-mono text-xs text-brand-300">
                        {tx.tx_hash?.slice(0, 10)}…
                      </td>
                      <td className="py-3 pr-4 font-medium text-white">{tx.amount} USDC</td>
                      <td className="py-3 pr-4">
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium capitalize", statusClass(tx.status))}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-surface-500">
                        {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel title="Activity Feed" href="/admin/audit">
          {activity.length === 0 ? (
            <p className="py-4 text-sm text-surface-500">No activity yet</p>
          ) : (
            <div className="space-y-3">
              {activity.map((log) => (
                <div key={log.id} className="flex items-start gap-3 border-b border-white/[0.04] pb-3 last:border-0">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm capitalize text-surface-200">{log.action?.replace(/_/g, " ")}</p>
                    <p className="text-xs text-surface-500">
                      {log.admins?.profiles?.full_name ?? "System"} —{" "}
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
