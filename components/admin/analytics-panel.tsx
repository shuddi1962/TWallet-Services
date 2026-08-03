"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TrendingUp, Users, BarChart3, DollarSign, RefreshCw, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminStats, getAnalyticsChartData } from "@/lib/admin/actions";
import { useRealtime } from "@/lib/hooks/use-realtime";
import { AnalyticsCharts } from "./analytics-charts";

type Stats = Awaited<ReturnType<typeof getAdminStats>>;
type ChartData = Awaited<ReturnType<typeof getAnalyticsChartData>>;

function StatCard({
  icon,
  label,
  value,
  iconClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  iconClass: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}>{icon}</div>
          <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-xl font-bold text-slate-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AnalyticsPanel({
  initialStats,
  initialChartData,
}: {
  initialStats: Stats;
  initialChartData: ChartData;
}) {
  const [stats, setStats] = useState<Stats>(initialStats);
  const [chartData, setChartData] = useState<ChartData>(initialChartData);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(async () => {
    const [s, c] = await Promise.all([getAdminStats(), getAnalyticsChartData()]);
    setStats(s);
    setChartData(c);
    setLastUpdated(new Date());
  }, []);

  const debouncedRefresh = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void refresh();
    }, 800);
  }, [refresh]);

  // Real-time: any change to orders, payments, or users recomputes the dashboard
  useRealtime("analytics-orders-live", "*", "card_orders", debouncedRefresh);
  useRealtime("analytics-payments-live", "*", "payment_transactions", debouncedRefresh);
  useRealtime("analytics-users-live", "*", "profiles", debouncedRefresh);

  // Fallback sync every 60s in case realtime misses anything
  useEffect(() => {
    const id = setInterval(() => {
      void refresh();
    }, 60_000);
    return () => {
      clearInterval(id);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [refresh]);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            Platform metrics and insights · updates live
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Live · synced {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            type="button"
            onClick={() => void handleManualRefresh()}
            disabled={refreshing}
            aria-label="Refresh analytics"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-600 disabled:opacity-50"
          >
            <RefreshCw className={refreshing ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} aria-hidden="true" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-brand-600" aria-hidden="true" />}
          iconClass="bg-brand-50"
          label="Total Revenue"
          value={`$${stats.revenue.toFixed(2)}`}
        />
        <StatCard
          icon={<Users className="h-5 w-5 text-blue-600" aria-hidden="true" />}
          iconClass="bg-blue-50"
          label="Total Users"
          value={stats.totalUsers}
        />
        <StatCard
          icon={<BarChart3 className="h-5 w-5 text-green-600" aria-hidden="true" />}
          iconClass="bg-green-50"
          label="Completed Orders"
          value={stats.completedOrders}
        />
        <StatCard
          icon={<DollarSign className="h-5 w-5 text-purple-600" aria-hidden="true" />}
          iconClass="bg-purple-50"
          label="Today Transactions"
          value={stats.todayTransactions}
        />
      </div>

      {stats.pendingOrders > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <Activity className="h-4 w-4" aria-hidden="true" />
          {stats.pendingOrders} pending order{stats.pendingOrders !== 1 ? "s" : ""} awaiting payment · {stats.openTickets} open ticket{stats.openTickets !== 1 ? "s" : ""} · {stats.activeWallets} active wallet{stats.activeWallets !== 1 ? "s" : ""}
        </div>
      )}

      <AnalyticsCharts data={chartData} />
    </div>
  );
}