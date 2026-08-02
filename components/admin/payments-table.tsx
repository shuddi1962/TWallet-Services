"use client";

import { useState, useRef, useCallback } from "react";
import { Search, ExternalLink, Eye, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getPaymentDetails } from "@/lib/admin/actions";
import { useRealtime } from "@/lib/hooks/use-realtime";

interface Payment {
  id: string;
  tx_hash?: string;
  amount?: number;
  status: string;
  created_at: string;
  supported_networks?: { name: string } | null;
  card_orders?: { order_number?: string } | null;
}

type PaymentDetail = Record<string, unknown> & {
  id: string;
  tx_hash?: string | null;
  amount?: number | string | null;
  status?: string | null;
  confirmations?: number | null;
  from_address?: string | null;
  to_address?: string | null;
  block_number?: number | null;
  verified_at?: string | null;
  created_at?: string | null;
  error_message?: string | null;
  supported_networks?: { name?: string; explorer_url?: string; chain_id?: number } | null;
  supported_tokens?: { symbol?: string } | null;
  supported_wallet_addresses?: { address?: string } | null;
  card_orders?: { order_number?: string; user_id?: string } | null;
};

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  confirming: "bg-info/10 text-info",
  confirmed: "bg-success/10 text-success",
  failed: "bg-danger/10 text-danger",
  flagged: "bg-danger/10 text-danger",
  refunded: "bg-info/10 text-info",
};

function explorerUrl(detail: PaymentDetail, hash?: string): string | null {
  const base = detail.supported_networks?.explorer_url;
  if (!base || !hash) return null;
  return `${base}/tx/${hash}`;
}

export function AdminPaymentsTable({ payments: initial }: { payments: Payment[]; count: number }) {
  const [payments, setPayments] = useState<Payment[]>(initial);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Payment | null>(null);
  const [detail, setDetail] = useState<PaymentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const prevStatuses = useRef<Record<string, string>>({});

  const handleRealtime = useCallback((payload: { eventType: string; new?: Payment | null; old?: Payment | null }) => {
    if (payload.eventType === "DELETE") {
      setPayments((prev) => prev.filter((p) => p.id !== payload.old?.id));
      return;
    }
    const incoming = payload.new;
    if (!incoming) return;

    if (payload.eventType === "UPDATE") {
      const prev = prevStatuses.current[incoming.id];
      if (prev && prev !== incoming.status) {
        // status changed externally (e.g. verification result)
      }
    }

    setPayments((prev) => {
      const idx = prev.findIndex((p) => p.id === incoming.id);
      if (idx === -1) return [incoming, ...prev];
      return prev.map((p, i) => (i === idx ? { ...p, ...incoming } : p));
    });
    prevStatuses.current[incoming.id] = incoming.status;

    setSelected((s) => (s && s.id === incoming.id ? { ...s, ...incoming } : s));
  }, []);

  useRealtime<{ eventType: string; new?: Payment | null; old?: Payment | null }>(
    "admin-payments-live", "*", "payment_transactions", handleRealtime,
  );

  const openDetails = async (payment: Payment) => {
    setSelected(payment);
    setDetail(null);
    setDetailLoading(true);
    try {
      const res = await getPaymentDetails(payment.id);
      setDetail((res ?? null) as PaymentDetail | null);
    } catch {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const filtered = payments.filter((p) => {
    if (search && !p.tx_hash?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm flex-1 max-w-sm">
          <Search className="w-4 h-4 text-body" />
          <input
            type="text"
            placeholder="Search by tx hash..."
            className="bg-transparent border-none outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search payments"
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
          title="Payments update in real time"
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
          <p className="text-body">No payments found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-body bg-surface-50 border-b border-surface-200">
                  <th scope="col" className="py-3 px-4 font-medium">Tx Hash</th>
                  <th scope="col" className="py-3 px-4 font-medium">Order</th>
                  <th scope="col" className="py-3 px-4 font-medium">Amount</th>
                  <th scope="col" className="py-3 px-4 font-medium">Network</th>
                  <th scope="col" className="py-3 px-4 font-medium">Status</th>
                  <th scope="col" className="py-3 px-4 font-medium">Date</th>
                  <th scope="col" className="py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((payment) => (
                  <tr key={payment.id} className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-primary">
                      {payment.tx_hash ? `${payment.tx_hash.slice(0, 10)}...` : "—"}
                    </td>
                    <td className="py-3 px-4 text-body">{payment.card_orders?.order_number ?? "—"}</td>
                    <td className="py-3 px-4 font-medium text-heading">{payment.amount ? `${payment.amount} USDC` : "—"}</td>
                    <td className="py-3 px-4 text-body">{payment.supported_networks?.name ?? "—"}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[payment.status] ?? "bg-surface-200 text-body"}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-body text-xs">
                      {formatDistanceToNow(new Date(payment.created_at), { addSuffix: true })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {payment.tx_hash && (
                          <a
                            href={`https://etherscan.io/tx/${payment.tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg hover:bg-surface-100 text-body inline-flex transition-colors"
                            aria-label={`View transaction on explorer`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => openDetails(payment)}
                          className="p-1.5 rounded-lg hover:bg-surface-100 text-body transition-colors"
                          aria-label="View payment details"
                        >
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
            aria-label="Payment details"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Payment</h2>
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
              ) : detail ? (
                <>
                  <section>
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Transaction</h3>
                    <div className="text-slate-700 text-sm space-y-1">
                      <p className="break-all font-mono text-xs"><span className="text-slate-400">Hash:</span> {detail.tx_hash ?? "—"}</p>
                      <p className="break-all font-mono text-xs"><span className="text-slate-400">From:</span> {detail.from_address ?? "—"}</p>
                      <p className="break-all font-mono text-xs"><span className="text-slate-400">To:</span> {detail.to_address ?? "—"}</p>
                      {detail.block_number != null && <p><span className="text-slate-400">Block:</span> {String(detail.block_number)}</p>}
                      {detail.confirmations != null && <p><span className="text-slate-400">Confirmations:</span> {String(detail.confirmations)}</p>}
                      {detail.error_message && <p className="text-danger"><span className="text-slate-400">Error:</span> {detail.error_message}</p>}
                      {explorerUrl(detail, detail.tx_hash ?? undefined) && (
                        <a
                          href={explorerUrl(detail, detail.tx_hash ?? undefined) ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                          View on explorer
                        </a>
                      )}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Details</h3>
                    <div className="text-slate-700 text-sm space-y-1">
                      <p><span className="text-slate-400">Amount:</span> {detail.amount != null ? `${detail.amount} ${detail.supported_tokens?.symbol ?? "USDC"}` : "—"}</p>
                      <p><span className="text-slate-400">Network:</span> {detail.supported_networks?.name ?? "—"}</p>
                      <p><span className="text-slate-400">Chain:</span> {detail.supported_networks?.chain_id ?? "—"}</p>
                      <p><span className="text-slate-400">Receiving wallet:</span> <span className="font-mono text-xs break-all">{detail.supported_wallet_addresses?.address ?? "—"}</span></p>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Order</h3>
                    <div className="text-slate-700 text-sm space-y-1">
                      <p><span className="text-slate-400">Order:</span> {detail.card_orders?.order_number ?? "—"}</p>
                      <p><span className="text-slate-400">User:</span> <span className="font-mono text-xs break-all">{detail.card_orders?.user_id ?? "—"}</span></p>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Dates</h3>
                    <div className="text-slate-700 text-sm space-y-1">
                      <p><span className="text-slate-400">Created:</span> {detail.created_at ? new Date(detail.created_at).toLocaleString() : "—"}</p>
                      <p><span className="text-slate-400">Verified:</span> {detail.verified_at ? new Date(detail.verified_at).toLocaleString() : "—"}</p>
                    </div>
                  </section>
                </>
              ) : (
                <p className="text-sm text-body">No details available</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}