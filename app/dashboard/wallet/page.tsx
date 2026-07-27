"use client";

import { WalletConnect } from "@/components/wallet/wallet-connect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone } from "lucide-react";

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Trust Wallet</h1>
        <p className="mt-1 text-sm text-surface-400">
          Connect your Trust Wallet to make crypto payments
        </p>
      </div>

      <WalletConnect />

      <Card>
        <CardHeader>
          <CardTitle>About Trust Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center rounded-xl border border-white/5 bg-surface-900/50 p-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10 ring-1 ring-brand-500/20">
              <Smartphone className="h-8 w-8 text-brand-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Trust Wallet</h3>
            <p className="mt-2 max-w-md text-sm text-surface-400">
              Trust Wallet is the official recommended wallet for TWallet Services. Connect securely using WalletConnect technology to order cards and make crypto payments.
            </p>
            <p className="mt-4 text-xs text-surface-500">
              Securely connected via WalletConnect
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
