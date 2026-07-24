"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAccount, useBalance, useDisconnect, useChainId } from "wagmi";
import { Copy, Check, Wallet, Plug, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

const CHAIN_NAMES: Record<number, string> = {
  1: "Ethereum",
  5: "Goerli",
  11155111: "Sepolia",
  137: "Polygon",
  8453: "Base",
  42161: "Arbitrum",
  10: "Optimism",
};

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletOverview() {
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  if (!isConnected || !address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Wallet}
            title="No wallet connected"
            description="Connect your crypto wallet to manage payments and track your balance."
            action={
              <Button asChild>
                <a href="/dashboard/wallet">Connect Wallet</a>
              </Button>
            }
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Wallet</CardTitle>
            <Badge variant="success" className="gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
              Connected
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Provider & Address */}
          <div className="flex items-center gap-3 rounded-xl border border-surface-800 bg-surface-950/50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 ring-1 ring-brand-500/20">
              {connector?.icon ? (
                <img
                  src={connector.icon}
                  alt={connector.name ?? "Wallet provider"}
                  className="h-5 w-5"
                />
              ) : (
                <Wallet className="h-5 w-5 text-brand-400" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-surface-50">
                {connector?.name ?? "Wallet"}
              </p>
              <p className="mt-0.5 font-mono text-xs text-surface-400">
                {shortenAddress(address)}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-400 transition-colors hover:bg-surface-800 hover:text-surface-50"
              aria-label={copied ? "Copied" : "Copy address"}
            >
              {copied ? (
                <Check className="h-4 w-4 text-success" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Network Badge */}
          <div className="flex items-center justify-between rounded-xl border border-surface-800 bg-surface-950/50 px-4 py-3">
            <span className="text-sm text-surface-400">Network</span>
            <Badge variant="outline" className="font-mono text-xs">
              {CHAIN_NAMES[chainId] ?? `Chain ${chainId}`}
            </Badge>
          </div>

          {/* Balance */}
          <div className="rounded-xl border border-surface-800 bg-surface-950/50 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-400">Balance</span>
              <span className="text-lg font-bold text-surface-50">
                {balance ? `${Number(balance.value).toFixed(4)} ${balance.symbol}` : "—"}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button variant="primary" size="sm" fullWidth asChild>
              <a
                href={`https://etherscan.io/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                View on Explorer
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={() => disconnect()}
              className="border border-surface-800 text-surface-400 hover:bg-surface-800 hover:text-error"
            >
              <Plug className="h-3.5 w-3.5" aria-hidden="true" />
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
