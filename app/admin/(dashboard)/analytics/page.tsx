import { getAdminStats, getAnalyticsChartData } from "@/lib/admin/actions";
import { AnalyticsPanel } from "@/components/admin/analytics-panel";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const [stats, chartData] = await Promise.all([getAdminStats(), getAnalyticsChartData()]);

  return <AnalyticsPanel initialStats={stats} initialChartData={chartData} />;
}