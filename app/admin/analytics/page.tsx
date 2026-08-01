import { getAdminStats, getAnalyticsChartData } from "@/lib/admin/actions";
import { Card, CardContent } from "@/components/ui/card";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";
import { TrendingUp, Users, BarChart3, DollarSign } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const [stats, chartData] = await Promise.all([getAdminStats(), getAnalyticsChartData()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Platform metrics and insights</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                <TrendingUp className="h-5 w-5 text-brand-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Revenue</p>
                <p className="text-xl font-bold text-slate-900">${stats.revenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Users className="h-5 w-5 text-blue-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Users</p>
                <p className="text-xl font-bold text-slate-900">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <BarChart3 className="h-5 w-5 text-green-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Completed Orders</p>
                <p className="text-xl font-bold text-slate-900">{stats.completedOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <DollarSign className="h-5 w-5 text-purple-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Today Transactions</p>
                <p className="text-xl font-bold text-slate-900">{stats.todayTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AnalyticsCharts data={chartData} />
    </div>
  );
}
