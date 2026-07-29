"use client";

import { useAccount, useBalance, useChainId } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Loader2, Copy, Check, ExternalLink, LogOut } from "lucide-react";
import { useState } from "react";
import { useWalletConnect } from "@/lib/hooks/use-wallet-connect";

const CHAIN_NAMES: Record<number, string> = {
  1: "Ethereum",
  11155111: "Sepolia",
  137: "Polygon",
  8453: "Base",
  42161: "Arbitrum",
  10: "Optimism",
};

export function WalletConnect() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const { openWallet, disconnect, connecting } = useWalletConnect();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="overflow-hidden border-white/10 bg-gradient-to-br from-surface-900 via-surface-900 to-brand-950/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">
              {isConnected ? "Wallet Connected" : "Connect Wallet"}
            </CardTitle>
            <CardDescription className="mt-1">
              {isConnected
                ? "Ready to pay on-chain to the platform receiving address"
                : "WalletConnect QR · MetaMask · Trust · Binance · 300+ wallets"}
            </CardDescription>
          </div>
          {isConnected && (
            <Badge variant="success" className="gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Live
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 ring-1 ring-brand-500/30">
              <Wallet className="h-7 w-7 text-brand-300" />
            </div>
            <h3 className="text-base font-semibold text-white">No wallet connected</h3>
            <p className="mt-2 max-w-sm text-sm text-surface-400">
              Connect to order cards and send USDC. You keep your keys — we never custody funds.
            </p>
            <Button
              className="mt-6 rounded-full px-8"
              onClick={() => void openWallet()}
              disabled={connecting}
            >
              {connecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wallet className="h-4 w-4" />
              )}
              {connecting ? "Connecting…" : "Connect Wallet"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-accent-700 p-5 text-white">
              <p className="text-xs font-medium uppercase tracking-wider text-white/70">Balance</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {balance
                  ? `${(Number(balance.value) / 10 ** balance.decimals).toLocaleString(undefined, { maximumFractionDigits: 4 })} ${balance.symbol}`
                  : "—"}
              </p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-mono text-white/80">
                  {address?.slice(0, 6)}…{address?.slice(-4)}
                </span>
                <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs">
                  {CHAIN_NAMES[chainId] ?? `Chain ${chainId}`}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => void copy()}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                Copy
              </Button>
              <Button variant="outline" size="sm" asChild>
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
                onClick={() => void disconnect()}
                className="text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="h-3.5 w-3.5" />
                Disconnect
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}