import { getOrders } from "@/lib/admin/actions";
import { AdminOrdersTable } from "@/components/admin/orders-table";

export default async function AdminOrdersPage(props: {
  searchParams?: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const sp = await props.searchParams;
  const { orders, count } = await getOrders({
    search: sp?.search,
    status: sp?.status,
    page: Number(sp?.page) || 0,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Orders</h1>
          <p className="text-sm text-body">{count} total orders</p>
        </div>
      </div>
      <AdminOrdersTable orders={orders} count={count} />
    </div>
  );
}
