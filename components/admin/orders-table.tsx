"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { updateOrderStatus, type ActionResult } from "@/lib/admin/actions";
import { toast } from "sonner";

interface Order {
  id: string;
  status: string;
  amount?: number;
  created_at: string;
  profiles?: { full_name: string; email: string } | null;
  card_products?: { name: string; type: string } | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  paid: "bg-info/10 text-info",
  processing: "bg-primary/10 text-primary",
  shipped: "bg-info/10 text-info",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-surface-200 text-body",
  refunded: "bg-danger/10 text-danger",
};

const validTransitions: Record<string, string[]> = {
  pending: ["paid", "cancelled"],
  paid: ["processing", "cancelled", "refunded"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
};

export function AdminOrdersTable({ orders }: { orders: Order[]; count: number }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    if (search && !o.id?.toLowerCase().includes(search.toLowerCase()) && !o.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    return true;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    const result: ActionResult = await updateOrderStatus(orderId, newStatus);
    setUpdating(null);
    if (result.success) {
      toast.success(`Order ${newStatus}`);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm flex-1 max-w-sm">
          <Search className="w-4 h-4 text-body" />
          <input
            type="text"
            placeholder="Search by ID or customer..."
            className="bg-transparent border-none outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search orders"
          />
        </div>
        <select
          className="px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm text-body"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          {Object.keys(statusColors).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <p className="text-body">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-body bg-surface-50 border-b border-surface-200">
                  <th scope="col" className="py-3 px-4 font-medium">Order ID</th>
                  <th scope="col" className="py-3 px-4 font-medium">Customer</th>
                  <th scope="col" className="py-3 px-4 font-medium">Card</th>
                  <th scope="col" className="py-3 px-4 font-medium">Status</th>
                  <th scope="col" className="py-3 px-4 font-medium">Amount</th>
                  <th scope="col" className="py-3 px-4 font-medium">Date</th>
                  <th scope="col" className="py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-primary">{order.id?.slice(0, 8)}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-heading">{order.profiles?.full_name ?? "—"}</p>
                      <p className="text-xs text-body">{order.profiles?.email}</p>
                    </td>
                    <td className="py-3 px-4 text-body">{order.card_products?.name ?? "—"}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] ?? "bg-surface-200 text-body"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-heading">{order.amount ? `${order.amount} USDC` : "—"}</td>
                    <td className="py-3 px-4 text-body text-xs">
                      {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="relative group">
                          <button className="p-1.5 rounded-lg hover:bg-surface-100 text-body transition-colors flex items-center gap-1">
                            <ChevronDown className="w-4 h-4" />
                            <span className="text-xs">Status</span>
                          </button>
                          <div className="absolute right-0 top-full mt-1 bg-white border border-surface-200 rounded-lg shadow-lg py-1 min-w-[140px] hidden group-hover:block z-10">
                            {(validTransitions[order.status] ?? []).map((nextStatus) => (
                              <button
                                key={nextStatus}
                                onClick={() => handleStatusChange(order.id, nextStatus)}
                                disabled={updating === order.id}
                                className="block w-full text-left px-3 py-1.5 text-sm text-body hover:bg-surface-100"
                              >
                                {nextStatus}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button className="p-1.5 rounded-lg hover:bg-surface-100 text-body transition-colors" aria-label="View order">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
