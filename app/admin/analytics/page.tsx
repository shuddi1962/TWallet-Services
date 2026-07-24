import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="mt-1 text-sm text-surface-400">
          Platform metrics and insights
        </p>
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
                <p className="text-xl font-bold text-white">$0.00</p>
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
                <p className="text-xl font-bold text-white">0</p>
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
                <p className="text-sm text-surface-400">Total Orders</p>
                <p className="text-xl font-bold text-white">0</p>
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
                <p className="text-sm text-surface-400">Cards Issued</p>
                <p className="text-xl font-bold text-white">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-white/10">
              <p className="text-sm text-surface-400">Chart placeholder — install Recharts for live charts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orders (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-white/10">
              <p className="text-sm text-surface-400">Chart placeholder — install Recharts for live charts</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
