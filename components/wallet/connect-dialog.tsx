"use client";

import { useEffect, useState } from "react";
import { X, Wallet, ShieldCheck, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ManualValidation } from "./manual-validation";

export function ConnectDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"choose" | "web3" | "manual">("choose");
  const [web3Busy, setWeb3Busy] = useState(false);
  const [showWeb3Details, setShowWeb3Details] = useState(false);

  useEffect(() => {
    if (open) {
      setMode("choose");
      setWeb3Busy(false);
      setShowWeb3Details(false);
    }
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

        {mode === "choose" && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setMode("web3")}
              className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-slate-300"
              aria-label="Connect wallet automatically with Web3"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
                <Wallet className="h-5 w-5 text-brand-600" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">Connect Wallet (Web3)</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  WalletConnect QR · MetaMask · Trust Wallet · 300+ wallets
                </p>
              </div>
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
          </div>
        )}

        {mode === "web3" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Temporarily unavailable</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Browser wallet connections are currently unavailable on TWallet. Use manual wallet
                    validation instead — our team verifies your wallet details and activates it for you.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-4 w-full rounded-xl text-slate-400"
                onClick={() => setShowWeb3Details((v) => !v)}
                disabled={web3Busy}
              >
                {web3Busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {showWeb3Details ? "Hide details" : "Why is this unavailable?"}
              </Button>
              {showWeb3Details && (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 w-full rounded-xl"
                  onClick={() => void handleWeb3()}
                >
                  {web3Busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Wallet className="h-4 w-4" aria-hidden="true" />
                  )}
                  Try web3 connect
                </Button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMode("choose")}
              className="w-full text-center text-xs font-medium text-slate-400 transition hover:text-slate-600"
            >
              ← Back to options
            </button>
          </div>
        )}

        {mode === "manual" && (
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
