"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Wallet, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAssignedWallet } from "@/lib/hooks/use-assigned-wallet";
import { openConnectDialog } from "@/lib/utils/connect";

export function WalletOverview() {
  const { wallet: assignedWallet } = useAssignedWallet();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!assignedWallet) return;
    try {
      await navigator.clipboard.writeText(assignedWallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Wallet</h3>
          <p className="text-xs text-slate-500">Connect to pay for cards</p>
        </div>
        {assignedWallet && (
          <Badge variant="success" className="gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Connected
          </Badge>
        )}
      </div>

      <div className="p-5">
        {!assignedWallet ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 ring-1 ring-neutral-200">
              <Wallet className="h-6 w-6 text-black" />
            </div>
            <p className="font-medium text-slate-900">No wallet connected</p>
            <p className="mt-1 max-w-xs text-sm text-slate-500">
              Use Connect in the top bar to scan a QR or pick a browser wallet.
            </p>
            <Button
              type="button"
              className="mt-5 rounded-full"
              onClick={() => openConnectDialog()}
            >
              <Wallet className="h-4 w-4" />
              Connect
            </Button>
            <p className="mt-3 text-xs text-slate-400">
              Web3 connections temporarily unavailable — manual validation instead.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-black via-neutral-800 to-neutral-900 p-5 text-white">
              <p className="text-[11px] font-medium uppercase tracking-wider text-white/70">
                Assigned wallet
              </p>
              <p className="mt-2 truncate font-mono text-sm text-white/90">
                {assignedWallet.address}
              </p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => void handleCopy()}
                  className="inline-flex items-center gap-1.5 font-mono text-white/85"
                >
                  {assignedWallet.address.slice(0, 6)}…{assignedWallet.address.slice(-4)}
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs">
                  {assignedWallet.network || "Verified"}
                </span>
              </div>
              <p className="mt-2 text-xs text-white/60">
                {assignedWallet.label} · verified by TWallet
              </p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl" asChild>
              <a href="/dashboard/wallet">
                <ExternalLink className="h-3.5 w-3.5" />
                Manage wallet
              </a>
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}