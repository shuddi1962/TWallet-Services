import { getAuditLogs } from "@/lib/admin/actions";
import { AdminAuditTable } from "@/components/admin/audit-table";

export default async function AdminAuditPage(props: {
  searchParams?: Promise<{ search?: string; action?: string; targetType?: string; page?: string }>;
}) {
  const sp = await props.searchParams;
  const { logs, count } = await getAuditLogs({
    search: sp?.search,
    action: sp?.action,
    targetType: sp?.targetType,
    page: Number(sp?.page) || 0,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Audit Logs</h1>
          <p className="text-sm text-body">{count} log entries</p>
        </div>
      </div>
      <AdminAuditTable logs={logs} count={count} />
    </div>
  );
}
