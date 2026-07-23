"use client";

import {
  Users, Wallet, Clock, CheckCircle, DollarSign, LifeBuoy, Activity, ArrowLeftRight,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import type { RecentOrder, RecentPayment, RecentSignup, RecentTicket, AuditEntry } from "@/lib/admin/types";

interface StatProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const colorMap: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
  success: "bg-success/10 text-success",
};

function StatCard({ label, value, icon, color }: StatProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow" aria-label={`${label}: ${value}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-body font-medium">{label}</p>
          <p className="text-2xl font-bold text-heading mt-1">{typeof value === "number" ? value.toLocaleString() : value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color] ?? colorMap.primary}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface Stats {
  totalUsers: number;
  activeWallets: number;
  pendingOrders: number;
  completedOrders: number;
  revenue: number;
  openTickets: number;
  todayTransactions: number;
}

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
    { label: "Total Users", value: stats.totalUsers, icon: <Users className="w-5 h-5" />, color: "primary" },
    { label: "Active Wallets", value: stats.activeWallets, icon: <Wallet className="w-5 h-5" />, color: "info" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: <Clock className="w-5 h-5" />, color: "warning" },
    { label: "Completed Orders", value: stats.completedOrders, icon: <CheckCircle className="w-5 h-5" />, color: "success" },
    { label: "Revenue (USDC)", value: stats.revenue.toLocaleString(), icon: <DollarSign className="w-5 h-5" />, color: "success" },
    { label: "Open Tickets", value: stats.openTickets, icon: <LifeBuoy className="w-5 h-5" />, color: "warning" },
    { label: "System Health", value: "Healthy", icon: <Activity className="w-5 h-5" />, color: "success" },
    { label: "Today's TX", value: stats.todayTransactions, icon: <ArrowLeftRight className="w-5 h-5" />, color: "primary" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-heading">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-heading">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-body py-4">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-body border-b border-surface-200">
                    <th scope="col" className="py-2 pr-4 font-medium">Order</th>
                    <th scope="col" className="py-2 pr-4 font-medium">Customer</th>
                    <th scope="col" className="py-2 pr-4 font-medium">Card</th>
                    <th scope="col" className="py-2 pr-4 font-medium">Status</th>
                    <th scope="col" className="py-2 pr-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order: RecentOrder) => (
                    <tr key={order.id} className="border-b border-surface-100">
                      <td className="py-2.5 pr-4 font-mono text-xs text-primary">{order.id?.slice(0, 8)}</td>
                      <td className="py-2.5 pr-4 text-heading">{order.profiles?.full_name ?? "—"}</td>
                      <td className="py-2.5 pr-4 text-body">{order.card_products?.name ?? "—"}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          order.status === "delivered" || order.status === "completed" ? "bg-success/10 text-success" :
                          order.status === "paid" ? "bg-info/10 text-info" :
                          order.status === "processing" ? "bg-warning/10 text-warning" :
                          "bg-surface-200 text-body"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-body text-xs">
                        {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-heading">Recent Signups</h2>
              <Link href="/admin/users" className="text-sm text-primary hover:underline">View All</Link>
            </div>
            {recentSignups.length === 0 ? (
              <p className="text-sm text-body py-2">No signups yet</p>
            ) : (
              <div className="space-y-3">
                {recentSignups.map((user: RecentSignup) => (
                  <div key={user.email} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
                      {user.full_name?.charAt(0) ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-heading truncate">{user.full_name}</p>
                      <p className="text-xs text-body truncate">{user.email}</p>
                    </div>
                    <span className="text-xs text-body shrink-0">
                      {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-heading">Open Tickets</h2>
              <Link href="/admin/support" className="text-sm text-primary hover:underline">View All</Link>
            </div>
            {recentTickets.length === 0 ? (
              <p className="text-sm text-body py-2">No open tickets</p>
            ) : (
              <div className="space-y-3">
                {recentTickets.map((ticket: RecentTicket) => (
                  <div key={ticket.id} className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      ticket.priority === "urgent" ? "bg-danger/10 text-danger" :
                      ticket.priority === "high" ? "bg-warning/10 text-warning" :
                      "bg-surface-200 text-body"
                    }`}>
                      {ticket.priority}
                    </span>
                    <p className="text-sm text-heading truncate flex-1">{ticket.subject}</p>
                    <span className="text-xs text-body">
                      {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-heading">Recent Payments</h2>
            <Link href="/admin/payments" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          {recentPayments.length === 0 ? (
            <p className="text-sm text-body py-4">No payments yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-body border-b border-surface-200">
                    <th scope="col" className="py-2 pr-4 font-medium">Tx Hash</th>
                    <th scope="col" className="py-2 pr-4 font-medium">Amount</th>
                    <th scope="col" className="py-2 pr-4 font-medium">Network</th>
                    <th scope="col" className="py-2 pr-4 font-medium">Status</th>
                    <th scope="col" className="py-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((tx: RecentPayment) => (
                    <tr key={tx.id} className="border-b border-surface-100">
                      <td className="py-2.5 pr-4 font-mono text-xs text-primary">{tx.tx_hash?.slice(0, 10)}...</td>
                      <td className="py-2.5 pr-4 font-medium text-heading">{tx.amount} USDC</td>
                      <td className="py-2.5 pr-4 text-body">{tx.supported_networks?.name ?? "—"}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          tx.status === "confirmed" ? "bg-success/10 text-success" :
                          tx.status === "pending" ? "bg-warning/10 text-warning" :
                          tx.status === "failed" ? "bg-danger/10 text-danger" :
                          "bg-surface-200 text-body"
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-body text-xs">
                        {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-heading">Activity Feed</h2>
            <Link href="/admin/audit" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          {activity.length === 0 ? (
            <p className="text-sm text-body py-4">No activity yet</p>
          ) : (
            <div className="space-y-3">
              {activity.map((log: AuditEntry) => (
                <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-surface-100 last:border-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-heading">{log.action?.replace(/_/g, " ")}</p>
                    <p className="text-xs text-body">
                      {log.admins?.profiles?.full_name ?? "System"} — {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
