"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Loader2, Send, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ReceivingWalletRecord } from "@/lib/admin/actions";

type SweepRecord = {
  id: string;
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

export function AdminSweepPanel({ wallets, recentSweeps }: { wallets: ReceivingWalletRecord[]; recentSweeps: SweepRecord[] }) {
  const [selectedWallet, setSelectedWallet] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [sweeping, setSweeping] = useState(false);

  const activeWallets = wallets.filter((w) => w.active);

  const handleSweep = async () => {
    if (!selectedWallet || !toAddress || !amount) return;
    setSweeping(true);
    try {
      const formData = new FormData();
      formData.set("walletId", selectedWallet);
      formData.set("toAddress", toAddress);
      formData.set("amount", amount);
      // Calls server action to record sweep request
      const res = await fetch("/api/admin/sweep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletId: selectedWallet, toAddress, amount }),
      });
      if (!res.ok) throw new Error("Sweep request failed");
      setAmount("");
      setToAddress("");
    } catch (err) {
      console.error(err);
    } finally {
      setSweeping(false);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { variant: "success" | "warning" | "error" | "info"; label: string }> = {
      pending: { variant: "info", label: "Pending" },
      signed: { variant: "warning", label: "Signed" },
      broadcast: { variant: "warning", label: "Broadcast" },
      confirmed: { variant: "success", label: "Confirmed" },
      failed: { variant: "error", label: "Failed" },
    };
    const s = map[status] ?? { variant: "info", label: status };
    return <Badge variant={s.variant} className="text-xs">{s.label}</Badge>;
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
              className="flex h-10 w-full rounded-lg border border-surface-800 bg-surface-950 px-3 py-2 text-sm text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
            disabled={!selectedWallet || !toAddress || !amount || sweeping}
          >
            {sweeping ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
            ) : (
              <><Send className="h-4 w-4" /> Initiate Sweep</>
            )}
          </Button>

          <p className="text-xs text-surface-500">
            This creates a sweep request. You must sign and broadcast the transaction using your wallet.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sweeps</CardTitle>
          <CardDescription>Last {recentSweeps.length} transactions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentSweeps.length === 0 ? (
            <p className="text-sm text-surface-500">No sweep transactions yet.</p>
          ) : (
            recentSweeps.slice(0, 10).map((s) => (
              <div key={s.id} className="rounded-lg border border-surface-800 bg-surface-900/50 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-surface-200">{s.amount} {s.token_symbol}</span>
                  {statusBadge(s.status)}
                </div>
                <div className="flex items-center gap-2 text-xs text-surface-500">
                  <Wallet className="h-3 w-3" />
                  <span className="font-mono">{s.from_address.slice(0, 6)}...{s.from_address.slice(-4)}</span>
                  <span>→</span>
                  <span className="font-mono">{s.to_address.slice(0, 6)}...{s.to_address.slice(-4)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-surface-500">
                  <span>{formatDistanceToNow(new Date(s.created_at), { addSuffix: true })}</span>
                  {s.tx_hash && (
                    <button
                      onClick={() => window.open(`https://etherscan.io/tx/${s.tx_hash}`, "_blank")}
                      className="flex items-center gap-1 text-brand-400 hover:text-brand-300"
                    >
                      <ExternalLink className="h-3 w-3" /> View
                    </button>
                  )}
                </div>
                {s.error_message && (
                  <p className="mt-1 text-xs text-red-400">{s.error_message}</p>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}