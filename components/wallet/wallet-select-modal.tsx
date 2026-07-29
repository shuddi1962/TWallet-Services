"use client";

import { useEffect } from "react";
import { type Connector } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, Smartphone, Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  connectors: readonly Connector[];
  onSelect: (connector: Connector | "walletconnect") => void;
  busyId?: string | null;
}

export function WalletSelectModal({ open, onClose, connectors, onSelect, busyId }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const injected = connectors.filter(
    (c) => c && c.id !== "safe" && c.id !== "walletConnect",
  );

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[10000] flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-t-3xl border border-white/10 bg-[#0b1220] p-6 shadow-2xl sm:rounded-3xl"
            role="dialog"
            aria-modal="true"
            aria-label="Connect wallet"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">Connect Your Wallet</h2>
                <p className="mt-1 text-sm text-surface-400">
                  Pick a wallet. You pay on-chain — funds go to the platform receiving address.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-surface-400 hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              {/* WalletConnect — always shown */}
              <button
                type="button"
                disabled={!!busyId}
                onClick={() => onSelect("walletconnect")}
                className="group flex w-full items-center gap-3 rounded-2xl border border-brand-500/30 bg-brand-500/[0.06] px-4 py-3.5 text-left transition hover:border-brand-500/50 hover:bg-brand-500/15 disabled:opacity-60"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/25 to-accent-500/15 ring-1 ring-white/10">
                  {busyId === "walletconnect" ? (
                    <Loader2 className="h-5 w-5 animate-spin text-brand-300" />
                  ) : (
                    <Smartphone className="h-5 w-5 text-brand-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">WalletConnect</p>
                    <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-semibold text-brand-300">
                      Recommended
                    </span>
                  </div>
                  <p className="truncate text-xs text-surface-400">
                    Trust, MetaMask Mobile, Rainbow, Binance & 300+ wallets — QR code
                  </p>
                </div>
              </button>

              {/* Injected browser wallets */}
              {injected.map((c) => {
                const busy = busyId === c.uid || busyId === c.id;
                return (
                  <button
                    key={c.uid || c.id}
                    type="button"
                    disabled={!!busyId}
                    onClick={() => onSelect(c)}
                    className="group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-left transition hover:border-brand-500/40 hover:bg-brand-500/10 disabled:opacity-60"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/25 to-accent-500/15 ring-1 ring-white/10">
                      {busy ? (
                        <Loader2 className="h-5 w-5 animate-spin text-brand-300" />
                      ) : (
                        <Wallet className="h-5 w-5 text-brand-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white">
                        {c.name === "Injected" ? "Browser Wallet" : c.name}
                      </p>
                      <p className="truncate text-xs text-surface-400">
                        MetaMask, Rabby, Coinbase extension, Brave…
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="mt-5 text-center text-[11px] leading-relaxed text-surface-500">
              We never ask for seed phrases or private keys. Powered by WalletConnect.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
