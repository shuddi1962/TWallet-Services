"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { ShoppingCart, Search, X, Eye, Package, ChevronRight, Clock, CheckCircle2, AlertCircle, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { getOrders } from "@/features/orders/server/actions";

const STATUS_TABS = [
  { label: "All Orders", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  paid: "bg-success/10 text-success border-success/20",
  processing: "bg-info/10 text-info border-info/20",
  shipped: "bg-info/10 text-info border-info/20",
  delivered: "bg-success/10 text-success border-success/20",
  cancelled: "bg-error/10 text-error border-error/20",
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  pending: Clock,
  paid: CheckCircle2,
  processing: AlertCircle,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: X,
};

interface Order {
  id: string;
  order_number: string;
  status: string;
  amount_usdc: number;
  network: string;
  token: string;
  tx_hash: string | null;
  created_at: string;
  paid_at: string | null;
  product_id: string | null;
  card_products: { name: string; type: string } | null;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const perPage = 9;

  useEffect(() => {
    getOrders().then((result) => {
      if (result.error) {
        setError(result.error);
      } else {
        setOrders(result.data ?? []);
      }
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (!orders) return [];
    let list = [...orders];

    if (statusTab !== "all") {
      list = list.filter((o) => o.status === statusTab);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          (o.tx_hash && o.tx_hash.toLowerCase().includes(q)),
      );
    }

    return list;
  }, [orders, statusTab, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice(page * perPage, (page + 1) * perPage);

  const statusCounts = useMemo(() => {
    if (!orders) return {} as Record<string, number>;
    const counts: Record<string, number> = {};
    for (const o of orders) {
      counts[o.status] = (counts[o.status] || 0) + 1;
    }
    return counts;
  }, [orders]);

  useEffect(() => {
    setPage(0);
  }, [statusTab, search]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-white">Orders</h1><p className="mt-1 text-sm text-surface-400">Track your card orders from payment to delivery.</p></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-white">Orders</h1><p className="mt-1 text-sm text-surface-400">Track your card orders from payment to delivery.</p></div>
        <Alert variant="error"><p>Failed to load orders. Please try again.</p></Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Orders</h1>
        <p className="mt-1 text-sm text-surface-400">Track your card orders from payment to delivery.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
        <input
          ref={searchRef}
          type="text"
          placeholder="Search by order number or tx hash..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-surface-700 bg-surface-900 py-2 pl-10 pr-10 text-sm text-surface-100 placeholder-surface-500 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          aria-label="Search orders"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => {
          const count = tab.value === "all" ? orders?.length : statusCounts[tab.value];
          return (
            <button
              key={tab.value}
              onClick={() => setStatusTab(tab.value)}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors",
                statusTab === tab.value
                  ? "border-brand-500 text-brand-400"
                  : "border-transparent text-surface-500 hover:border-surface-600 hover:text-surface-300",
              )}
              role="tab"
              aria-selected={statusTab === tab.value}
            >
              {tab.label}
              {count !== undefined && count > 0 && (
                <span className="rounded-full bg-surface-800 px-2 py-0.5 text-xs text-surface-400">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {paged.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title={search ? `No orders match "${search}"` : statusTab !== "all" ? `No ${statusTab} orders` : "No orders yet"}
          description={search ? "Try a different search term." : "When you place a card order, it will appear here."}
          action={!search && statusTab === "all" ? <Link href="/dashboard/cards"><Button>Order a Card</Button></Link> : undefined}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paged.map((order) => {
              const StatusIcon = STATUS_ICONS[order.status] || Clock;
              return (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="group relative flex flex-col rounded-xl border border-surface-800 bg-surface-900/50 p-5 text-left transition-all hover:border-surface-700 hover:bg-surface-900"
                  aria-label={`Order ${order.order_number}, status: ${order.status}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-sm font-semibold text-white">{order.order_number}</p>
                      {order.card_products && (
                        <Badge variant={order.card_products.type === "virtual" ? "info" : "default"} className="mt-1">
                          {order.card_products.name}
                        </Badge>
                      )}
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 text-surface-600 transition-colors group-hover:text-surface-400" />
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium", STATUS_STYLES[order.status] || "")}>
                      <StatusIcon className="h-3 w-3" />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <div className="mt-auto pt-4 text-xs text-surface-500">
                    <p>{new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    <p className="mt-0.5 font-mono text-sm text-surface-200">{order.amount_usdc} {order.token}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {pageCount > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
              {[...Array(pageCount)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={cn(
                    "h-8 w-8 rounded-md text-sm transition-colors",
                    page === i ? "bg-brand-600 text-white" : "text-surface-400 hover:bg-surface-800",
                  )}
                  aria-current={page === i ? "page" : undefined}
                >
                  {i + 1}
                </button>
              ))}
              <Button variant="outline" size="sm" disabled={page >= pageCount - 1} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </>
      )}

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label={`Order details: ${selectedOrder.order_number}`}
        >
          <div className="absolute inset-0 bg-surface-950/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative z-10 flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-surface-800 bg-surface-950 shadow-xl animate-in slide-in-from-right">
            <div className="flex items-center justify-between border-b border-surface-800 px-6 py-4">
              <div>
                <p className="font-mono text-sm font-semibold text-white">{selectedOrder.order_number}</p>
                <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium mt-1", STATUS_STYLES[selectedOrder.status] || "")}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="rounded-md p-2 text-surface-500 hover:bg-surface-800 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-6 px-6 py-6">
              <section aria-label="Order Information">
                <h3 className="mb-3 text-sm font-medium text-surface-500 uppercase tracking-wider">Order Information</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between"><dt className="text-surface-400">Product</dt><dd className="text-white">{selectedOrder.card_products?.name || "—"}</dd></div>
                  <div className="flex justify-between"><dt className="text-surface-400">Amount</dt><dd className="font-mono text-white">{selectedOrder.amount_usdc} {selectedOrder.token}</dd></div>
                  <div className="flex justify-between"><dt className="text-surface-400">Network</dt><dd className="text-white">{selectedOrder.network}</dd></div>
                  <div className="flex justify-between"><dt className="text-surface-400">Date</dt><dd className="text-white">{new Date(selectedOrder.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</dd></div>
                </dl>
              </section>

              {selectedOrder.tx_hash && (
                <section aria-label="Payment Information">
                  <h3 className="mb-3 text-sm font-medium text-surface-500 uppercase tracking-wider">Payment</h3>
                  <div className="rounded-lg bg-surface-900/50 p-4">
                    <p className="text-xs text-surface-500">Transaction Hash</p>
                    <p className="mt-1 break-all font-mono text-sm text-surface-200">{selectedOrder.tx_hash}</p>
                  </div>
                </section>
              )}

              <section aria-label="Tracking Timeline">
                <h3 className="mb-3 text-sm font-medium text-surface-500 uppercase tracking-wider">Timeline</h3>
                <div className="space-y-0">
                  {["pending", "paid", "processing", "shipped", "delivered"].map((step, i) => {
                    const statuses = ["pending", "paid", "processing", "shipped", "delivered"];
                    const currentIdx = statuses.indexOf(selectedOrder.status);
                    const isCompleted = i < currentIdx;
                    const isCurrent = i === currentIdx;
                    return (
                      <div key={step} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                            isCompleted ? "bg-brand-600" : isCurrent ? "border-2 border-brand-500" : "border-2 border-surface-700",
                          )}>
                            {isCompleted && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                            {isCurrent && <div className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />}
                          </div>
                          {i < statuses.length - 1 && (
                            <div className={cn("h-8 w-px", isCompleted ? "bg-brand-600" : "bg-surface-700")} />
                          )}
                        </div>
                        <div className="pb-6">
                          <p className={cn(
                            "text-sm font-medium capitalize",
                            isCompleted ? "text-white" : isCurrent ? "text-brand-400" : "text-surface-500",
                          )}>
                            {step}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="border-t border-surface-800 px-6 py-4">
              <div className="flex gap-3">
                <Button fullWidth onClick={() => setSelectedOrder(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
