"use client";

import { useEffect, useRef } from "react";
import { type Connector } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, Smartphone, Globe } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  connectors: readonly Connector[];
  onSelect: (connector: Connector) => void;
}

function connectorMeta(c: Connector) {
  const id = (c.id || c.name || "").toLowerCase();
  if (id.includes("walletconnect") || id === "walletconnect") {
    return {
      title: "WalletConnect",
      subtitle: "Trust, Rainbow, MetaMask Mobile & more",
      icon: Smartphone,
    };
  }
  if (id.includes("injected") || id.includes("metaMask") || id.includes("metamask")) {
    return {
      title: c.name === "Injected" ? "Browser Wallet" : c.name,
      subtitle: "MetaMask, Coinbase, Brave, Rabby…",
      icon: Wallet,
    };
  }
  return { title: c.name || "Wallet", subtitle: "Connect securely", icon: Globe };
}

export function WalletSelectModal({ open, onClose, connectors, onSelect }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const list = connectors.filter((c) => c.id !== "safe");

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-surface-900 to-surface-950 p-6 shadow-2xl shadow-brand-500/10"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Connect Wallet</h2>
                <p className="mt-1 text-sm text-surface-400">Non-custodial. You always control your keys.</p>
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-surface-400 transition hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              {list.length === 0 ? (
                <p className="py-8 text-center text-sm text-surface-400">
                  No wallet connectors available. Set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID.
                </p>
              ) : (
                list.map((c) => {
                  const meta = connectorMeta(c);
                  const Icon = meta.icon;
                  return (
                    <button
                      key={c.uid ?? c.id}
                      onClick={() => onSelect(c)}
                      className="group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-left transition hover:border-brand-500/40 hover:bg-brand-500/10"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 ring-1 ring-white/10 transition group-hover:scale-105">
                        <Icon className="h-5 w-5 text-brand-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white">{meta.title}</p>
                        <p className="truncate text-xs text-surface-400">{meta.subtitle}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <p className="mt-5 text-center text-[11px] leading-relaxed text-surface-500">
              By connecting you agree we never request seed phrases or private keys.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
