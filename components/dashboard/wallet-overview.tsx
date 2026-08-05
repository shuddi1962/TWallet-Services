"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAccount, useBalance, useChainId } from "wagmi";
import { Copy, Check, Wallet, Plug, ExternalLink } from "lucide-react";
import { trackWalletDisconnected } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWalletConnect } from "@/lib/hooks/use-wallet-connect";
import { openConnectDialog } from "@/lib/utils/connect";

const CHAIN_NAMES: Record<number, string> = {
  1: "Ethereum",
  11155111: "Sepolia",
  137: "Polygon",
  8453: "Base",
  42161: "Arbitrum",
  10: "Optimism",
};

export function WalletOverview() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useWalletConnect();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
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
        {isConnected && (
          <Badge variant="success" className="gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Connected
          </Badge>
        )}
      </div>

      <div className="p-5">
        {!isConnected || !address ? (
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
                Native balance
              </p>
              <p className="mt-2 text-2xl font-bold">
                {balance
                  ? `${(Number(balance.value) / 10 ** balance.decimals).toLocaleString(undefined, { maximumFractionDigits: 5 })} ${balance.symbol}`
                  : "—"}
              </p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => void handleCopy()}
                  className="inline-flex items-center gap-1.5 font-mono text-white/85"
                >
                  {address.slice(0, 6)}…{address.slice(-4)}
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs">
                  {CHAIN_NAMES[chainId] ?? `Chain ${chainId}`}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button variant="outline" size="sm" className="rounded-xl" asChild>
                <a
                  href={`https://etherscan.io/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Explorer
                </a>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => {
                  trackWalletDisconnected();
                  void disconnect();
                }}
              >
                <Plug className="h-3.5 w-3.5" />
                Disconnect
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}