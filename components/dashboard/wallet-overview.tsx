"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAccount, useBalance, useDisconnect, useChainId } from "wagmi";
import { Copy, Check, Wallet, Plug, ExternalLink, Loader2 } from "lucide-react";
import { trackWalletDisconnected } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWalletConnect } from "@/lib/hooks/use-wallet-connect";
import { WalletSelectModal } from "@/components/wallet/wallet-select-modal";

const CHAIN_NAMES: Record<number, string> = {
  1: "Ethereum",
  11155111: "Sepolia",
  137: "Polygon",
  8453: "Base",
  42161: "Arbitrum",
  10: "Optimism",
};

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function WalletOverview() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const { openWallet, connectWith, connecting, connectors, selectOpen, setSelectOpen } =
    useWalletConnect();
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
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-surface-900/90 to-[#0a1220]"
      >
        <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-white">Wallet</h3>
            <p className="text-xs text-surface-500">Non-custodial connection</p>
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
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/15 ring-1 ring-brand-500/25">
                <Wallet className="h-6 w-6 text-brand-300" />
              </div>
              <p className="font-medium text-white">No wallet connected</p>
              <p className="mt-1 max-w-xs text-sm text-surface-400">
                Connect MetaMask, Trust Wallet, or any WalletConnect wallet to pay for cards.
              </p>
              <Button className="mt-5 rounded-full" onClick={() => openWallet()} disabled={connecting}>
                {connecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Connecting…
                  </>
                ) : (
                  "Connect Wallet"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-indigo-700 to-violet-800 p-5 text-white shadow-lg shadow-brand-600/20">
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/70">Native balance</p>
                <p className="mt-2 text-2xl font-bold">
                  {balance
                    ? `${(Number(balance.value) / 10 ** balance.decimals).toLocaleString(undefined, { maximumFractionDigits: 5 })} ${balance.symbol}`
                    : "—"}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => void handleCopy()}
                    className="inline-flex items-center gap-1.5 font-mono text-white/85 hover:text-white"
                  >
                    {shortenAddress(address)}
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs">
                    {CHAIN_NAMES[chainId] ?? `Chain ${chainId}`}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
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
                  className="rounded-xl border border-white/10 text-surface-400 hover:bg-red-500/10 hover:text-red-300"
                  onClick={() => {
                    trackWalletDisconnected();
                    disconnect();
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

      <WalletSelectModal
        open={selectOpen}
        onClose={() => setSelectOpen(false)}
        connectors={connectors}
        onSelect={(c) => void connectWith(c.uid || c.id)}
      />
    </>
  );
}
