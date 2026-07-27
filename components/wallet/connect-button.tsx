"use client";

import { useState, useRef, useEffect } from "react";
import { useAccount, useBalance, useDisconnect, useChainId } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { formatUnits } from "viem";
import { Smartphone, ChevronDown, Copy, Check, ExternalLink, LogOut, Loader2 } from "lucide-react";
import { useWalletConnect } from "@/lib/hooks/use-wallet-connect";

const CHAIN_NAMES: Record<number, string> = {
  1: "Ethereum", 11155111: "Sepolia", 137: "Polygon",
  8453: "Base", 42161: "Arbitrum", 10: "Optimism",
};

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const { openWallet, connecting } = useWalletConnect();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const handleDisconnect = () => {
    disconnect();
    setOpenDropdown(false);
  };

  if (!isConnected || !address) {
    return (
      <button
        onClick={() => openWallet()}
        disabled={connecting}
        className="flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
      >
        {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />}
        <span className="hidden sm:inline">{connecting ? "Connecting..." : "Connect Trust Wallet"}</span>
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpenDropdown(!openDropdown)}
        className="flex items-center gap-2 rounded-lg border border-surface-700 bg-surface-800 px-3 py-2 text-sm text-surface-50 transition-colors hover:bg-surface-700"
      >
        <span className="hidden sm:inline">{shortenAddress(address)}</span>
        <span className="sm:hidden text-xs">{shortenAddress(address)}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-surface-400 transition-transform ${openDropdown ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {openDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-surface-700 bg-surface-900 p-3 shadow-2xl shadow-black/40"
          >
            <div className="flex items-center gap-3 rounded-lg bg-surface-800/50 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 ring-1 ring-brand-500/20">
                <Smartphone className="h-5 w-5 text-brand-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-surface-50">Trust Wallet</p>
                <p className="truncate font-mono text-xs text-surface-400">{address}</p>
              </div>
              <button
                onClick={handleCopy}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-surface-400 transition-colors hover:bg-surface-700 hover:text-surface-50"
                aria-label={copied ? "Copied" : "Copy address"}
              >
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between rounded-lg bg-surface-800/50 px-3 py-2">
              <span className="text-xs text-surface-400">Network</span>
              <span className="text-xs font-medium text-surface-200">
                {CHAIN_NAMES[chainId] ?? `Chain ${chainId}`}
              </span>
            </div>

            <div className="mt-1 flex items-center justify-between rounded-lg bg-surface-800/50 px-3 py-2">
              <span className="text-xs text-surface-400">Balance</span>
              <span className="text-xs font-medium text-surface-200">
                {balance ? `${formatUnits(balance.value, balance.decimals).slice(0, 8)} ${balance.symbol}` : "—"}
              </span>
            </div>

            <div className="mt-3 flex gap-2">
              <a
                href={`https://etherscan.io/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-surface-700 py-2 text-xs text-surface-400 transition-colors hover:bg-surface-800 hover:text-surface-50"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Explorer
              </a>
              <button
                onClick={handleDisconnect}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-surface-700 py-2 text-xs text-surface-400 transition-colors hover:bg-surface-800 hover:text-error"
              >
                <LogOut className="h-3.5 w-3.5" />
                Disconnect
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
