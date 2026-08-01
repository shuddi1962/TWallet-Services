"use client";

import { useEffect, useState } from "react";
import { X, Wallet, ShieldCheck, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ManualValidation } from "./manual-validation";
import { cn } from "@/lib/utils/cn";

export function ConnectDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"choose" | "manual">("choose");
  const [web3Busy, setWeb3Busy] = useState(false);

  useEffect(() => {
    if (open) setMode("choose");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleWeb3 = () => {
    setWeb3Busy(true);
    setTimeout(() => setWeb3Busy(false), 1600);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Connect wallet"
        className="relative z-10 w-full max-w-md rounded-t-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          aria-label="Close"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white shadow-sm">
            <Wallet className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Connect your wallet</h2>
            <p className="text-xs text-slate-500">Choose how you want to link your wallet</p>
          </div>
        </div>

        {mode === "choose" ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => void handleWeb3()}
              disabled={web3Busy}
              className={cn(
                "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition",
                "border-slate-200 bg-slate-50 opacity-70",
              )}
              aria-label="Connect wallet with WalletConnect (unavailable)"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
                <Wallet className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-700">Connect Wallet (Web3)</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  WalletConnect QR · MetaMask · Trust Wallet · 300+ wallets
                </p>
              </div>
              {web3Busy ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" aria-hidden="true" />
              ) : (
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                  <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                  Unavailable
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMode("manual")}
              className="flex w-full items-center gap-4 rounded-2xl border border-neutral-300 bg-neutral-50 p-4 text-left transition hover:border-black"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-white shadow-sm">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-black">Manual Wallet Validation</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Submit your wallet details for manual verification
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-black px-2.5 py-1 text-[10px] font-semibold text-white">
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                Recommended
              </span>
            </button>

            <p className="pt-1 text-center text-[11px] text-slate-400">
              Web3 browser connections are temporarily unavailable. Please use manual validation.
            </p>
          </div>
        ) : (
          <div>
            <ManualValidation compact onSaved={onClose} />
            <button
              type="button"
              onClick={() => setMode("choose")}
              className="mt-4 w-full text-center text-xs font-medium text-slate-400 transition hover:text-slate-600"
            >
              ← Back to options
            </button>
          </div>
        )}

        <Button
          type="button"
          variant="ghost"
          className="mt-4 w-full text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
