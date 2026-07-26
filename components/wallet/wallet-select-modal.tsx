"use client";

import { useEffect, useRef } from "react";
import { type Connector } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet } from "lucide-react";

const CONNECTOR_ICONS: Record<string, string> = {
  MetaMask: "https://registry.walletconnect.com/api/v2/logo/md/0c405f3b-1482-4e3e-9a58-d8b2c3e2c2b1",
  WalletConnect: "https://registry.walletconnect.com/api/v2/logo/md/0c405f3b-1482-4e3e-9a58-d8b2c3e2c2b1",
  "Coinbase Wallet": "https://registry.walletconnect.com/api/v2/logo/md/0c405f3b-1482-4e3e-9a58-d8b2c3e2c2b1",
};

interface Props {
  open: boolean;
  onClose: () => void;
  connectors: readonly Connector[];
  onSelect: (connector: Connector) => void;
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

  if (connectors.length === 0) return null;

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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-sm rounded-2xl border border-surface-700 bg-surface-900 p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-surface-50">Connect Wallet</h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-400 transition-colors hover:bg-surface-800 hover:text-surface-50"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              {connectors.map((c) => (
                <button
                  key={c.uid ?? c.name}
                  onClick={() => onSelect(c)}
                  className="flex w-full items-center gap-3 rounded-xl border border-surface-700 bg-surface-800/50 px-4 py-3 text-left transition-colors hover:border-surface-600 hover:bg-surface-800"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-700">
                    {c.icon ? (
                      <img src={c.icon} alt="" className="h-6 w-6" />
                    ) : CONNECTOR_ICONS[c.name] ? (
                      <img src={CONNECTOR_ICONS[c.name]} alt="" className="h-6 w-6" />
                    ) : (
                      <Wallet className="h-5 w-5 text-surface-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-surface-50">{c.name}</p>
                    <p className="text-xs text-surface-400">
                      {c.name === "MetaMask"
                        ? "Browser extension"
                        : c.name === "WalletConnect"
                          ? "Scan QR with mobile wallet"
                          : "Connect your wallet"}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <p className="mt-4 text-center text-xs text-surface-500">
              By connecting, you agree to our Terms of Service.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
