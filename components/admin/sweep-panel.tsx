"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { ExternalLink, Loader2, Send, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSweepRequest, updateSweepStatus } from "@/lib/admin/actions";
import type { ReceivingWalletRecord } from "@/lib/admin/actions";
import { useRealtime } from "@/lib/hooks/use-realtime";

type SweepRecord = {
  id: string;
  admin_id: string | null;
  from_network_id: string;
  from_address: string;
  to_address: string;
  amount: string;
  token_symbol: string;
  status: string;
  tx_hash: string | null;
  error_message: string | null;
  created_at: string;
  confirmed_at: string | null;
  admins?: { profile_id: string; profiles: { full_name: string; email: string } } | null;
};

type SweepPayload = {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new?: Partial<SweepRecord> | null;
  old?: Partial<SweepRecord> | null;
};

const SWEEP_STATUSES = ["pending", "signed", "broadcast", "confirmed", "failed"] as const;

export function AdminSweepPanel({ wallets, recentSweeps }: { wallets: ReceivingWalletRecord[]; recentSweeps: SweepRecord[] }) {
  const router = useRouter();
  const [selectedWallet, setSelectedWallet] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [, startTransition] = useTransition();

  const [sweeps, setSweeps] = useState<SweepRecord[]>(recentSweeps);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [hashDrafts, setHashDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    setSweeps(recentSweeps);
  }, [recentSweeps]);

  const handleRealtime = useCallback((payload: SweepPayload) => {
    setSweeps((prev) => {
      if (payload.eventType === "INSERT" && payload.new?.id) {
        if (prev.some((s) => s.id === payload.new!.id)) return prev;
        return [payload.new as SweepRecord, ...prev];
      }
      if (payload.eventType === "UPDATE" && payload.new?.id) {
        return prev.map((s) => (s.id === payload.new!.id ? { ...s, ...payload.new } : s));
      }
      if (payload.eventType === "DELETE" && payload.old?.id) {
        return prev.filter((s) => s.id !== payload.old!.id);
      }
      return prev;
    });
  }, []);

  useRealtime<SweepPayload>("admin-sweeps-live", "*", "sweep_transactions", handleRealtime);

  const activeWallets = wallets.filter((w) => w.active);

  const handleSweep = () => {
    if (!selectedWallet || !toAddress || !amount) return;
    startTransition(async () => {
      const res = await createSweepRequest(selectedWallet, toAddress, amount);
      if (res.success) {
        toast.success("Sweep request created — sign & broadcast it with your wallet");
        setAmount("");
        setToAddress("");
        setSelectedWallet("");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleStatusChange = (sweepId: string, status: string) => {
    setUpdatingId(sweepId);
    startTransition(async () => {
      const res = await updateSweepStatus(sweepId, status, hashDrafts[sweepId] ?? "");
      setUpdatingId(null);
      if (res.success) {
        toast.success(`Sweep marked ${status}`);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };

  const saveTxHash = (sweep: SweepRecord) => {
    const hash = (hashDrafts[sweep.id] ?? "").trim();
    if (!hash) return;
    setUpdatingId(sweep.id);
    startTransition(async () => {
      const res = await updateSweepStatus(sweep.id, sweep.status, hash);
      setUpdatingId(null);
      if (res.success) {
        toast.success("Transaction hash saved");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };

    return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>New Sweep</CardTitle>
          <CardDescription>Move funds from a receiving wallet to your treasury</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wallet">From Wallet</Label>
            <select
              id="wallet"
              value={selectedWallet}
              onChange={(e) => setSelectedWallet(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Select a wallet...</option>
              {activeWallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.network_name} — {w.address.slice(0, 6)}...{w.address.slice(-4)} (${Number(w.total_received).toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="toAddress">Treasury Address</Label>
            <Input
              id="toAddress"
              placeholder="0x..."
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <Button
            fullWidth
            className="bg-gradient-to-r from-brand-500 to-brand-700 text-white"
            onClick={handleSweep}
            disabled={!selectedWallet || !toAddress || !amount}
          >
            <Send className="h-4 w-4" /> Initiate Sweep
          </Button>

          <p className="text-xs text-slate-400">
            This creates a sweep request. You must sign and broadcast the transaction using your wallet.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sweeps</CardTitle>
          <CardDescription>
            Last {sweeps.length} transaction{sweeps.length !== 1 ? "s" : ""} · updates live
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sweeps.length === 0 ? (
            <p className="text-sm text-slate-400">No sweep transactions yet.</p>
          ) : (
            sweeps.slice(0, 10).map((s) => (
              <div key={s.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-700">{s.amount} {s.token_symbol}</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={s.status}
                      disabled={updatingId === s.id}
                      onChange={(e) => handleStatusChange(s.id, e.target.value)}
                      aria-label={`Update status of sweep ${s.id.slice(0, 8)}`}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 outline-none transition focus:border-brand-500 disabled:opacity-50"
                    >
                      {SWEEP_STATUSES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                    {updatingId === s.id && <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-500" aria-hidden="true" />}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Wallet className="h-3 w-3" />
                  <span className="font-mono">{s.from_address.slice(0, 6)}...{s.from_address.slice(-4)}</span>
                  <span>→</span>
                  <span className="font-mono">{s.to_address.slice(0, 6)}...{s.to_address.slice(-4)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2 text-xs text-slate-400">
                  <span>{formatDistanceToNow(new Date(s.created_at), { addSuffix: true })}</span>
                  {s.tx_hash ? (
                    <a
                      href={`https://etherscan.io/tx/${s.tx_hash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-brand-600 hover:text-brand-700"
                    >
                      <ExternalLink className="h-3 w-3" /> View
                    </a>
                  ) : s.status === "confirmed" || s.status === "broadcast" ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={hashDrafts[s.id] ?? ""}
                        onChange={(e) => setHashDrafts((d) => ({ ...d, [s.id]: e.target.value }))}
                        placeholder="tx hash"
                        aria-label={`Transaction hash for sweep ${s.id.slice(0, 8)}`}
                        className="w-40 rounded-md border border-slate-200 bg-white px-2 py-0.5 font-mono text-[11px] text-slate-700 outline-none focus:border-brand-500"
                      />
                      <button
                        type="button"
                        onClick={() => saveTxHash(s)}
                        disabled={updatingId === s.id || !(hashDrafts[s.id] ?? "").trim()}
                        className="rounded-md bg-slate-900 px-2 py-0.5 text-[11px] font-medium text-white transition hover:bg-slate-700 disabled:opacity-40"
                      >
                        Save
                      </button>
                    </div>
                  ) : null}
                </div>
                {s.error_message && (
                  <p className="mt-1 text-xs text-red-600">{s.error_message}</p>
                )}
                {s.admins?.profiles?.full_name && (
                  <p className="mt-1 text-[11px] text-slate-400">
                    by {s.admins.profiles.full_name}
                  </p>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
