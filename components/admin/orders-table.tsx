"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Eye, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { updateOrderStatus, getOrders, getOrderDetails, type ActionResult } from "@/lib/admin/actions";
import { toast } from "sonner";
import { useRealtime } from "@/lib/hooks/use-realtime";

interface Order {
  id: string;
  order_number?: string | null;
  status: string;
  amount?: number;
  created_at: string;
  profiles?: { full_name: string; email: string } | null;
  card_products?: { name: string; type: string } | null;
}

type OrderDetail = Record<string, unknown> & {
  id: string;
  order_number?: string | null;
  status?: string;
  amount_usdc?: number | string | null;
  paid_usdc?: number | string | null;
  network?: string | null;
  token?: string | null;
  tx_hash?: string | null;
  tracking_number?: string | null;
  carrier?: string | null;
  admin_note?: string | null;
  created_at?: string;
  paid_at?: string | null;
  profiles?: { full_name?: string; email?: string; phone?: string | null; country?: string | null } | null;
  card_products?: { name?: string; type?: string; price_usdc?: number | string | null } | null;
  payment_transactions?: {
    id: string;
    tx_hash?: string | null;
    amount?: number | string | null;
    status?: string | null;
    from_address?: string | null;
    to_address?: string | null;
    created_at?: string | null;
  }[];
};

interface OrderRow {
  id: string;
  order_number?: string | null;
  status: string;
  amount_usdc?: number | null;
  amount?: number | null;
  tx_hash?: string | null;
  tracking_number?: string | null;
  created_at: string;
  profiles?: Order["profiles"] | null;
  card_products?: Order["card_products"] | null;
}

type OrderPayload = {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new?: OrderRow | null;
  old?: OrderRow | null;
};

const toOrder = (row: OrderRow): Order => ({
  id: row.id,
  order_number: row.order_number,
  status: row.status,
  amount: row.amount_usdc ?? row.amount ?? undefined,
  created_at: row.created_at,
  profiles: row.profiles ?? null,
  card_products: row.card_products ?? null,
});

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

export function AdminOrdersTable({ orders: initialOrders }: { orders: Order[]; count: number }) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const prevStatuses = useRef<Record<string, string>>({});
  const ownUpdateAt = useRef<Record<string, number>>({});

  useEffect(() => {
    const map: Record<string, string> = {};
    for (const o of initialOrders) map[o.id] = o.status;
    prevStatuses.current = map;
    setOrders(initialOrders);
  }, [initialOrders]);

  // Live updates: new orders and status changes (payment verified, cancelled by
  // user, etc.) appear instantly without a page refresh.
  const handleRealtime = useCallback((payload: OrderPayload) => {
    const incoming = payload.new;

    if (payload.eventType === "DELETE") {
      setOrders((prev) => prev.filter((o) => o.id !== payload.old?.id));
      return;
    }
    if (!incoming) return;

    if (payload.eventType === "UPDATE") {
      const prevStatus = prevStatuses.current[incoming.id];
      if (prevStatus && prevStatus !== incoming.status) {
        const ownAt = ownUpdateAt.current[incoming.id] ?? 0;
        if (Date.now() - ownAt > 4000) {
          toast.info(`Order ${incoming.order_number ?? incoming.id.slice(0, 8)} is now ${incoming.status}`);
        }
      }
    }

    if (payload.eventType === "INSERT") {
      toast.info(`New order ${incoming.order_number ?? incoming.id.slice(0, 8)} created`);
      getOrders({}).then((result) => {
        setOrders((prev) => {
          const byId = new Map(prev.map((o) => [o.id, o]));
          for (const o of result.orders) byId.set(o.id, o);
          return Array.from(byId.values())
            .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
            .slice(0, 200);
        });
      });
    }

    setOrders((prev) => {
      const idx = prev.findIndex((o) => o.id === incoming.id);
      if (idx === -1) return [toOrder(incoming), ...prev].slice(0, 200);
      return prev.map((o, i) =>
        i === idx
          ? {
              ...o,
              ...toOrder(incoming),
              profiles: incoming.profiles ?? o.profiles,
              card_products: incoming.card_products ?? o.card_products,
            }
          : o,
      );
    });

    // Keep the detail drawer live when the selected order changes.
    setSelected((prevSel) =>
      prevSel && prevSel.id === incoming.id
        ? { ...prevSel, ...toOrder(incoming) }
        : prevSel,
    );
    setDetail((prevDetail) =>
      prevDetail && prevDetail.id === incoming.id
        ? { ...prevDetail, status: incoming.status, tx_hash: incoming.tx_hash ?? prevDetail.tx_hash, tracking_number: incoming.tracking_number ?? prevDetail.tracking_number }
        : prevDetail,
    );

    prevStatuses.current[incoming.id] = incoming.status;
  }, []);

  useRealtime<OrderPayload>("admin-orders-live", "*", "card_orders", handleRealtime);

  const filtered = orders.filter((o) => {
    const q = search.trim().toLowerCase();
    if (q &&
      !o.id?.toLowerCase().includes(q) &&
      !o.order_number?.toLowerCase().includes(q) &&
      !o.profiles?.full_name?.toLowerCase().includes(q) &&
      !o.profiles?.email?.toLowerCase().includes(q)) return false;
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    return true;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    ownUpdateAt.current[orderId] = Date.now();
    const result: ActionResult = await updateOrderStatus(orderId, newStatus);
    setUpdating(null);
    if (result.success) {
      toast.success(`Order ${newStatus}`);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  const openDetails = async (order: Order) => {
    setSelected(order);
    setDetail({ ...(order as unknown as OrderDetail) });
    setDetailLoading(true);
    try {
      const res = await getOrderDetails(order.id);
      if (res) setDetail({ ...(order as unknown as OrderDetail), ...(res as OrderDetail) });
    } catch {
      /* keep row fallback */
    } finally {
      setDetailLoading(false);
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
        <span
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success"
          title="Orders update in real time"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          Live
        </span>
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
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs text-primary">{order.order_number ?? order.id.slice(0, 8)}</span>
                    </td>
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
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === order.id ? null : order.id)}
                            aria-expanded={openMenuId === order.id}
                            aria-haspopup="menu"
                            className="p-1.5 rounded-lg hover:bg-surface-100 text-body transition-colors flex items-center gap-1"
                          >
                            <span className="text-xs font-medium">Status</span>
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          {openMenuId === order.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} aria-hidden="true" />
                              <div
                                role="menu"
                                className="absolute right-0 top-full mt-1 z-20 bg-white border border-surface-200 rounded-lg shadow-lg py-1 min-w-[140px]"
                              >
                                {(validTransitions[order.status] ?? []).length === 0 ? (
                                  <div className="px-3 py-1.5 text-sm text-body/60">No further transitions</div>
                                ) : (
                                  (validTransitions[order.status] ?? []).map((nextStatus) => (
                                    <button
                                      key={nextStatus}
                                      role="menuitem"
                                      onClick={() => {
                                        setOpenMenuId(null);
                                        handleStatusChange(order.id, nextStatus);
                                      }}
                                      disabled={updating === order.id}
                                      className="block w-full text-left px-3 py-1.5 text-sm text-body hover:bg-surface-100 disabled:opacity-50"
                                    >
                                      {nextStatus}
                                    </button>
                                  ))
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        <button onClick={() => openDetails(order)} className="p-1.5 rounded-lg hover:bg-surface-100 text-body transition-colors" aria-label="View order">
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

      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setSelected(null)} aria-hidden="true" />
          <div
            className="fixed inset-y-0 right-0 z-50 w-full max-w-lg border-l border-slate-200 bg-white shadow-xl overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label={`Order ${selected.order_number ?? selected.id.slice(0, 8)} details`}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Order {selected.order_number ?? selected.id.slice(0, 8)}
                </h2>
                <p className="text-xs text-body">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[detail?.status ?? selected.status] ?? "bg-surface-200 text-body"}`}>
                    {detail?.status ?? selected.status}
                  </span>
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-lg p-2 text-slate-400 hover:text-slate-800" aria-label="Close drawer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-6">
              {detailLoading ? (
                <p className="text-sm text-body">Loading details...</p>
              ) : (
                <>
                  <section>
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Customer</h3>
                    <div className="text-slate-700 text-sm space-y-1">
                      <p><span className="text-slate-400">Name:</span> {detail?.profiles?.full_name ?? "—"}</p>
                      <p><span className="text-slate-400">Email:</span> {detail?.profiles?.email ?? "—"}</p>
                      <p><span className="text-slate-400">Phone:</span> {detail?.profiles?.phone ?? "—"}</p>
                      <p><span className="text-slate-400">Country:</span> {detail?.profiles?.country ?? "—"}</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Card</h3>
                    <div className="text-slate-700 text-sm space-y-1">
                      <p><span className="text-slate-400">Product:</span> {detail?.card_products?.name ?? "—"}</p>
                      <p><span className="text-slate-400">Type:</span> {detail?.card_products?.type ?? "—"}</p>
                      <p><span className="text-slate-400">Price:</span> {detail?.card_products?.price_usdc ? `${detail.card_products.price_usdc} USDC` : "—"}</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Payment</h3>
                    {detail?.payment_transactions?.length ? (
                      <div className="space-y-2">
                        {detail.payment_transactions.map((tx) => (
                          <div key={tx.id} className="text-slate-700 text-sm space-y-1 rounded-lg bg-surface-50 p-3">
                            <p><span className="text-slate-400">Status:</span> {tx.status ?? "—"}</p>
                            <p><span className="text-slate-400">Amount:</span> {tx.amount ?? "—"}</p>
                            <p className="font-mono text-xs break-all"><span className="text-slate-400">Hash:</span> {tx.tx_hash ?? "—"}</p>
                            <p className="font-mono text-xs break-all"><span className="text-slate-400">From:</span> {tx.from_address ?? "—"}</p>
                            <p className="font-mono text-xs break-all"><span className="text-slate-400">To:</span> {tx.to_address ?? "—"}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm">No payment transaction recorded</p>
                    )}
                    <div className="text-slate-700 text-sm space-y-1 mt-2">
                      <p><span className="text-slate-400">Paid:</span> {detail?.paid_usdc ? `${detail.paid_usdc} USDC` : "—"}</p>
                      <p><span className="text-slate-400">Network:</span> {detail?.network ?? "—"}</p>
                      <p><span className="text-slate-400">Token:</span> {detail?.token ?? "—"}</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Shipping</h3>
                    <div className="text-slate-700 text-sm space-y-1">
                      <p><span className="text-slate-400">Tracking:</span> {detail?.tracking_number ?? "—"}</p>
                      <p><span className="text-slate-400">Carrier:</span> {detail?.carrier ?? "—"}</p>
                      <p><span className="text-slate-400">Admin note:</span> {detail?.admin_note ?? "—"}</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Dates</h3>
                    <div className="text-slate-700 text-sm space-y-1">
                      <p><span className="text-slate-400">Created:</span> {detail?.created_at ? new Date(detail.created_at).toLocaleString() : "—"}</p>
                      <p><span className="text-slate-400">Paid:</span> {detail?.paid_at ? new Date(detail.paid_at).toLocaleString() : "—"}</p>
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
