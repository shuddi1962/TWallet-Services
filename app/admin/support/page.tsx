import { getAdminTickets, getAdminList } from "@/lib/admin/actions";
import { AdminSupportTable } from "@/components/admin/support-table";

export default async function AdminSupportPage(props: {
  searchParams?: Promise<{ search?: string; status?: string; priority?: string; category?: string; assignedTo?: string; page?: string }>;
}) {
  const sp = await props.searchParams;
  const [{ tickets, count }, admins] = await Promise.all([
    getAdminTickets({
      search: sp?.search,
      status: sp?.status,
      priority: sp?.priority,
      category: sp?.category,
      assignedTo: sp?.assignedTo,
      page: Number(sp?.page) || 0,
    }),
    getAdminList(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Support Tickets</h1>
          <p className="text-sm text-body">{count} total tickets</p>
        </div>
      </div>
      <AdminSupportTable tickets={tickets} count={count} admins={admins} />
    </div>
  );
}