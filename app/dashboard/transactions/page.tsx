"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { ArrowLeftRight, ExternalLink, Copy, Check, Clock, Loader2, CheckCircle2, XCircle, RotateCcw, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { getTransactions } from "@/features/dashboard/server/actions";
import { formatAddress } from "@/utils";
import { useRealtime } from "@/lib/hooks/use-realtime";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";

const DATE_RANGES = [
  { label: "All Time", value: "all" },
  { label: "Today", value: "today" },
  { label: "7 Days", value: "7days" },
  { label: "30 Days", value: "30days" },
] as const;

const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirming", value: "confirming" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Failed", value: "failed" },
] as const;

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
  pending: { color: "text-warning", icon: Clock },
  confirming: { color: "text-info", icon: Loader2 },
  confirmed: { color: "text-success", icon: CheckCircle2 },
  failed: { color: "text-error", icon: XCircle },
  expired: { color: "text-slate-400", icon: Clock },
  refunded: { color: "text-error", icon: RotateCcw },
};

const FUNDING_STATUS: Record<string, string> = {
  pending: "pending",
  verifying: "confirming",
  verified: "confirmed",
  failed: "failed",
};

interface Transaction {
  id: string;
  kind: "payment" | "funding";
  amount: number;
  status: string;
  confirmations: number | null;
  tx_hash: string | null;
  network_id: string | null;
  created_at: string;
  verified_at: string | null;
  order_number: string | null;
}

type TxPayload = {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new?: Record<string, unknown> | null;
  old?: Record<string, unknown> | null;
};

const normalize = (
  kind: "payment" | "funding",
  row: Record<string, unknown>,
): Transaction => ({
  id: `${kind === "payment" ? "pay" : "fund"}_${String(row.id)}`,
  kind,
  amount: Number(kind === "payment" ? (row.amount as number | null) : (row.amount_usdc as number | null)),
  status: kind === "funding" ? (FUNDING_STATUS[String(row.status)] ?? String(row.status)) : String(row.status),
  confirmations: (row.confirmations as number | null) ?? null,
  tx_hash: (row.tx_hash as string | null) ?? null,
  network_id: (row.network_id as string | null) ?? null,
  created_at: row.created_at as string,
  verified_at: (row.verified_at as string | null) ?? null,
  order_number: null,
});

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [page, setPage] = useState(0);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const prevStatuses = useRef<Record<string, string>>({});
  const perPage = 10;

  useEffect(() => {
    getTransactions().then((result) => {
      if (result.error) {
        setError(result.error);
      } else {
        setTransactions(result.data ?? []);
        const map: Record<string, string> = {};
        for (const tx of result.data ?? []) map[tx.id] = tx.status;
        prevStatuses.current = map;
      }
      setLoading(false);
    });
  }, []);

  // Live updates: new payments and card top-ups appear instantly; statuses
  // move pending → confirming → confirmed as verification completes.
  const applyRealtime = useCallback(
    (kind: "payment" | "funding") =>
      (payload: TxPayload) => {
        const row = payload.new;
        if (payload.eventType === "DELETE") {
          const id = `${kind === "payment" ? "pay" : "fund"}_${String(payload.old?.id)}`;
          setTransactions((prev) => (prev ? prev.filter((t) => t.id !== id) : prev));
          return;
        }
        if (!row) return;

        const tx = normalize(kind, row);
        const prevStatus = prevStatuses.current[tx.id];

        if (payload.eventType === "UPDATE" && prevStatus && prevStatus !== tx.status) {
          toast.success(
            `${tx.kind === "payment" ? "Payment" : "Card top-up"} ${tx.amount} USDC is now ${tx.status}`,
          );
        }
        if (payload.eventType === "INSERT") {
          toast.info(`${tx.kind === "payment" ? "New payment" : "Card top-up"} detected — ${tx.amount} USDC`);
        }

        setTransactions((prev) => {
          if (!prev) return prev;
          const exists = prev.some((t) => t.id === tx.id);
          const next = exists
            ? prev.map((t) => (t.id === tx.id ? { ...t, ...tx } : t))
            : [tx, ...prev];
          return next
            .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
            .slice(0, 100);
        });
        prevStatuses.current[tx.id] = tx.status;
      },
    [],
  );

  useRealtime<TxPayload>("transactions-live", "*", "payment_transactions", applyRealtime("payment"));
  useRealtime<TxPayload>("card-funding-live", "*", "card_funding", applyRealtime("funding"));

  const filtered = useMemo(() => {
    if (!transactions) return [];
    let list = [...transactions];

    if (statusTab !== "all") {
      list = list.filter((tx) => tx.status === statusTab);
    }

    if (dateRange !== "all") {
      const now = Date.now();
      const cutoff =
        dateRange === "today"
          ? new Date().toISOString().split("T")[0]
          : dateRange === "7days"
            ? new Date(now - 7 * 86400000).toISOString()
            : new Date(now - 30 * 86400000).toISOString();
      list = list.filter((tx) => tx.created_at >= cutoff!);
    }

    return list;
  }, [transactions, statusTab, dateRange]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice(page * perPage, (page + 1) * perPage);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: transactions?.length ?? 0 };
    for (const tx of transactions ?? []) {
      counts[tx.status] = (counts[tx.status] ?? 0) + 1;
    }
    return counts;
  }, [transactions]);

  const copyHash = async (hash: string) => {
    await navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const explorerUrl = (tx: Transaction) => {
    if (!tx.tx_hash) return null;
    const explorers: Record<string, string> = {
      ethereum: "https://etherscan.io/tx/",
      sepolia: "https://sepolia.etherscan.io/tx/",
      polygon: "https://polygonscan.com/tx/",
      base: "https://basescan.org/tx/",
      arbitrum: "https://arbiscan.io/tx/",
      optimism: "https://optimistic.etherscan.io/tx/",
    };
    const base = (tx.network_id && explorers[tx.network_id]) || "https://etherscan.io/tx/";
    return `${base}${tx.tx_hash}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-slate-900">Transactions</h1><p className="mt-1 text-sm text-slate-500">Your verified crypto payment history.</p></div>
        <Card><CardHeader><CardTitle>Transaction History</CardTitle></CardHeader><CardContent className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</CardContent></Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-slate-900">Transactions</h1><p className="mt-1 text-sm text-slate-500">Your verified crypto payment history.</p></div>
        <Alert variant="error"><p>Failed to load transactions. Please try again.</p></Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
          <p className="mt-1 text-sm text-slate-500">Your verified crypto payment history.</p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600"
          title="Transactions update in real time"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          Live
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Button variant="outline" size="sm" onClick={() => setShowDateDropdown(!showDateDropdown)}>
            {DATE_RANGES.find((d) => d.value === dateRange)?.label}
          </Button>
          {showDateDropdown && (
            <div className="absolute left-0 top-full z-10 mt-1 w-40 rounded-md border border-slate-200 bg-white p-1 shadow-lg">
              {DATE_RANGES.map((range) => (
                <button
                  key={range.value}
                  className={cn(
                    "w-full rounded-sm px-2 py-1.5 text-left text-sm text-slate-600 hover:bg-slate-100",
                    dateRange === range.value && "text-brand-600",
                  )}
                  onClick={() => { setDateRange(range.value); setPage(0); setShowDateDropdown(false); }}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-1 overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => { setStatusTab(tab.value); setPage(0); }}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1 text-sm transition-colors",
                "cursor-pointer",
                statusTab === tab.value
                  ? "bg-black text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800",
              )}
            >
              {tab.label}
              {(statusCounts[tab.value] ?? 0) > 0 && (
                <span
                  className={cn(
                    "ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-semibold",
                    statusTab === tab.value ? "bg-white text-black" : "bg-slate-100 text-slate-500",
                  )}
                >
                  {statusCounts[tab.value]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {paged.length === 0 ? (
        <Card>
          <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
          <CardContent>
            <EmptyState
              icon={ArrowLeftRight}
              title="No transactions found"
              description={statusTab !== "all" ? "No transactions match the selected filter." : "Your verified crypto payments and card top-ups will appear here."}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-lg border border-slate-200 md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Transaction Hash</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Date</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((tx) => {
                  const statusConfig = (STATUS_CONFIG[tx.status] || STATUS_CONFIG.pending)!;
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr key={tx.id} className="border-b border-slate-200 transition-colors hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm text-slate-700">
                          {tx.tx_hash ? formatAddress(tx.tx_hash, 10) : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          {tx.kind === "funding" ? (
                            <><Wallet className="h-3.5 w-3.5" aria-hidden="true" /> Card top-up</>
                          ) : (
                            <><ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" /> Payment</>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono tabular-nums text-slate-900">{tx.amount} USDC</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex items-center gap-1 text-xs font-medium", statusConfig.color)}>
                          <StatusIcon className={cn("h-3.5 w-3.5", tx.status === "confirming" && "animate-spin")} />
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(tx.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {tx.tx_hash && (
                            <>
                              <button
                                onClick={() => copyHash(tx.tx_hash!)}
                                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
                                aria-label="Copy transaction hash"
                              >
                                {copiedHash === tx.tx_hash ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                              </button>
                              <a
                                href={explorerUrl(tx)!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
                                aria-label="View on explorer"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {paged.map((tx) => {
              const statusConfig = (STATUS_CONFIG[tx.status] || STATUS_CONFIG.pending)!;
              const StatusIcon = statusConfig.icon;
              return (
                <Card key={tx.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="font-mono text-sm text-slate-700">{tx.tx_hash ? formatAddress(tx.tx_hash, 10) : "—"}</span>
                      <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        {tx.kind === "funding" ? (
                          <><Wallet className="h-3 w-3" aria-hidden="true" /> Card top-up</>
                        ) : (
                          <><ArrowLeftRight className="h-3 w-3" aria-hidden="true" /> Payment</>
                        )}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="font-mono tabular-nums text-slate-900">{tx.amount} USDC</span>
                        <span className={cn("inline-flex items-center gap-1 text-xs font-medium", statusConfig.color)}>
                          <StatusIcon className={cn("h-3 w-3", tx.status === "confirming" && "animate-spin")} />
                          {tx.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                    {tx.tx_hash && (
                      <div className="flex gap-1">
                        <button onClick={() => copyHash(tx.tx_hash!)} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900">
                          {copiedHash === tx.tx_hash ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                        </button>
                        <a href={explorerUrl(tx)!} target="_blank" rel="noopener noreferrer" className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {pageCount > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
              {[...Array(pageCount)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={cn(
                    "h-8 w-8 rounded-md text-sm transition-colors",
                    page === i ? "bg-black text-white" : "text-slate-400 hover:bg-slate-100",
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
    </div>
  );
}
