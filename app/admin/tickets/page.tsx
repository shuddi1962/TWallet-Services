import { getAllTickets } from "@/lib/admin/actions";
import { Suspense } from "react";
import { AdminTicketsTable } from "@/components/admin/tickets-table";

export default async function AdminTicketsPage(props: {
  searchParams?: Promise<{ status?: string; page?: string }>;
}) {
  const sp = await props.searchParams;
  const { tickets, count } = await getAllTickets({
    status: sp?.status,
    page: Number(sp?.page) || 0,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Tickets</h1>
          <p className="text-sm text-body">{count} total tickets</p>
        </div>
      </div>
      <Suspense fallback={<div className="text-body">Loading tickets...</div>}>
        <AdminTicketsTable tickets={tickets} count={count} />
      </Suspense>
    </div>
  );
}
