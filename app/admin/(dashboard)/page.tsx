import { getAdminStats, getRecentOrders, getRecentPayments, getRecentSignups, getRecentTickets, getActivityFeed } from "@/lib/admin/actions";
import { AdminOverview } from "@/components/admin/overview";

export default async function AdminPage() {
  const [stats, recentOrders, recentPayments, recentSignups, recentTickets, activity] = await Promise.all([
    getAdminStats(),
    getRecentOrders(),
    getRecentPayments(),
    getRecentSignups(),
    getRecentTickets(),
    getActivityFeed(),
  ]);

  return (
    <AdminOverview
      stats={stats}
      recentOrders={recentOrders}
      recentPayments={recentPayments}
      recentSignups={recentSignups}
      recentTickets={recentTickets}
      activity={activity}
    />
  );
}
