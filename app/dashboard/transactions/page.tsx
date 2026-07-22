"use client";

import { useState, useMemo } from "react";
import { ArrowLeftRight, ExternalLink, Copy, Check, Clock, Loader2, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { getTransactions } from "@/features/dashboard/server/actions";
import { formatAddress } from "@/utils";
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
  expired: { color: "text-surface-500", icon: Clock },
  refunded: { color: "text-error", icon: RotateCcw },
};

interface Transaction {
  id: string;
  amount: number;
  status: string;
  confirmations: number | null;
  tx_hash: string | null;
  network_id: string | null;
  created_at: string;
  verified_at: string | null;
  order_id: string | null;
  card_orders: { order_number: string } | null;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [page, setPage] = useState(0);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const perPage = 10;

  useMemo(() => {
    getTransactions().then((result) => {
      if (result.error) {
        setError(result.error);
      } else {
        setTransactions(result.data ?? []);
      }
      setLoading(false);
    });
  }, []);

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

  const copyHash = async (hash: string) => {
    await navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const explorerUrl = (tx: Transaction) => {
    if (!tx.tx_hash) return null;
    return `https://etherscan.io/tx/${tx.tx_hash}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-white">Transactions</h1><p className="mt-1 text-sm text-surface-400">Your verified crypto payment history.</p></div>
        <Card><CardHeader><CardTitle>Transaction History</CardTitle></CardHeader><CardContent className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</CardContent></Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-white">Transactions</h1><p className="mt-1 text-sm text-surface-400">Your verified crypto payment history.</p></div>
        <Alert variant="error"><p>Failed to load transactions. Please try again.</p></Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="mt-1 text-sm text-surface-400">Your verified crypto payment history.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Button variant="outline" size="sm" onClick={() => setShowDateDropdown(!showDateDropdown)}>
            {DATE_RANGES.find((d) => d.value === dateRange)?.label}
          </Button>
          {showDateDropdown && (
            <div className="absolute left-0 top-full z-10 mt-1 w-40 rounded-md border border-surface-700 bg-surface-900 p-1 shadow-lg">
              {DATE_RANGES.map((range) => (
                <button
                  key={range.value}
                  className={cn(
                    "w-full rounded-sm px-2 py-1.5 text-left text-sm text-surface-300 hover:bg-surface-800",
                    dateRange === range.value && "text-brand-400",
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
              onClick={() => { setStatusTab(tab.value); setPage(0); }}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1 text-sm transition-colors",
                statusTab === tab.value
                  ? "bg-brand-600/20 text-brand-400"
                  : "text-surface-400 hover:text-surface-200",
              )}
            >
              {tab.label}
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
              description={statusTab !== "all" ? "No transactions match the selected filter." : "Your payment history will appear here after your first order."}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-lg border border-surface-800 md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-800 bg-surface-900/50">
                  <th className="px-4 py-3 text-left font-medium text-surface-400">Transaction Hash</th>
                  <th className="px-4 py-3 text-left font-medium text-surface-400">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-surface-400">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-surface-400">Date</th>
                  <th className="px-4 py-3 text-right font-medium text-surface-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((tx) => {
                  const statusConfig = (STATUS_CONFIG[tx.status] || STATUS_CONFIG.pending)!;
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr key={tx.id} className="border-b border-surface-800 transition-colors hover:bg-surface-800/50">
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm text-surface-200">
                          {tx.tx_hash ? formatAddress(tx.tx_hash, 10) : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono tabular-nums text-white">{tx.amount} USDC</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex items-center gap-1 text-xs font-medium", statusConfig.color)}>
                          <StatusIcon className={cn("h-3.5 w-3.5", tx.status === "confirming" && "animate-spin")} />
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-surface-400">
                        {new Date(tx.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {tx.tx_hash && (
                            <>
                              <button
                                onClick={() => copyHash(tx.tx_hash!)}
                                className="rounded p-1 text-surface-500 hover:bg-surface-700 hover:text-white"
                                aria-label="Copy transaction hash"
                              >
                                {copiedHash === tx.tx_hash ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                              </button>
                              <a
                                href={explorerUrl(tx)!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded p-1 text-surface-500 hover:bg-surface-700 hover:text-white"
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
                      <span className="font-mono text-sm text-surface-200">{tx.tx_hash ? formatAddress(tx.tx_hash, 10) : "—"}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono tabular-nums text-white">{tx.amount} USDC</span>
                        <span className={cn("inline-flex items-center gap-1 text-xs font-medium", statusConfig.color)}>
                          <StatusIcon className={cn("h-3 w-3", tx.status === "confirming" && "animate-spin")} />
                          {tx.status}
                        </span>
                      </div>
                      <p className="text-xs text-surface-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                    {tx.tx_hash && (
                      <div className="flex gap-1">
                        <button onClick={() => copyHash(tx.tx_hash!)} className="rounded p-1.5 text-surface-500 hover:bg-surface-700 hover:text-white">
                          {copiedHash === tx.tx_hash ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                        </button>
                        <a href={explorerUrl(tx)!} target="_blank" rel="noopener noreferrer" className="rounded p-1.5 text-surface-500 hover:bg-surface-700 hover:text-white">
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
    </div>
  );
}
