import { getAdminNotifications } from "@/lib/admin/actions";
import { AdminNotificationsTable } from "@/components/admin/notifications-table";
import { SendNotification } from "@/components/admin/send-notification";

export default async function AdminNotificationsPage(props: {
  searchParams?: Promise<{ type?: string; read?: string; dateFrom?: string; dateTo?: string; page?: string }>;
}) {
  const sp = await props.searchParams;
  const { notifications, count } = await getAdminNotifications({
    type: sp?.type,
    read: sp?.read,
    dateFrom: sp?.dateFrom,
    dateTo: sp?.dateTo,
    page: Number(sp?.page) || 0,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Notifications</h1>
          <p className="text-sm text-body">{count} notification{count === 1 ? "" : "s"}</p>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <SendNotification />
        </div>
        <div className="xl:col-span-2">
          <AdminNotificationsTable notifications={notifications} count={count} />
        </div>
      </div>
    </div>
  );
}