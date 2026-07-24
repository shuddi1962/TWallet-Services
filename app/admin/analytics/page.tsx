import { getAdminStats, getAnalyticsChartData } from "@/lib/admin/actions";
import { Card, CardContent } from "@/components/ui/card";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";
import { TrendingUp, Users, BarChart3, DollarSign } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const [stats, chartData] = await Promise.all([getAdminStats(), getAnalyticsChartData()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="mt-1 text-sm text-surface-400">Platform metrics and insights</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10">
                <TrendingUp className="h-5 w-5 text-brand-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-surface-400">Total Revenue</p>
                <p className="text-xl font-bold text-white">${stats.revenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-surface-400">Total Users</p>
                <p className="text-xl font-bold text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <BarChart3 className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-surface-400">Completed Orders</p>
                <p className="text-xl font-bold text-white">{stats.completedOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <DollarSign className="h-5 w-5 text-purple-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-surface-400">Today Transactions</p>
                <p className="text-xl font-bold text-white">{stats.todayTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AnalyticsCharts data={chartData} />
    </div>
  );
}
