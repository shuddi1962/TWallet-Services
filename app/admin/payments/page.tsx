import { getPayments } from "@/lib/admin/actions";
import { AdminPaymentsTable } from "@/components/admin/payments-table";

export default async function AdminPaymentsPage(props: {
  searchParams?: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const sp = await props.searchParams;
  const { payments, count } = await getPayments({
    search: sp?.search,
    status: sp?.status,
    page: Number(sp?.page) || 0,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Payments</h1>
          <p className="text-sm text-body">{count} total payments</p>
        </div>
      </div>
      <AdminPaymentsTable payments={payments} count={count} />
    </div>
  );
}
