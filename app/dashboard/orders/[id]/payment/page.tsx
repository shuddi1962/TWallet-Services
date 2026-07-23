"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PaymentPage() {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText("0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">Complete Payment</h1>
          <p className="mt-1 text-sm text-surface-400">Send crypto to complete your order</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Send the exact amount to the address below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-4">
              <p className="text-xs text-surface-500 mb-1">Amount to Pay</p>
              <p className="text-2xl font-bold text-white">50 USDT</p>
              <p className="text-sm text-surface-400">≈ $50.00 USD</p>
            </div>

            <div>
              <p className="text-xs text-surface-500 mb-2">Network</p>
              <div className="flex items-center gap-2 rounded-lg border border-surface-800 bg-surface-900/50 px-4 py-3">
                <div className="h-2 w-2 rounded-full bg-[#627EEA]" />
                <span className="text-sm text-white">Ethereum</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-surface-500 mb-2">Receiving Address</p>
              <div className="flex items-center gap-2 rounded-lg border border-surface-800 bg-surface-900/50 px-4 py-3">
                <code className="flex-1 text-xs text-surface-300 break-all font-mono">
                  0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18
                </code>
                <button
                  onClick={copyAddress}
                  className="shrink-0 rounded-md p-1.5 text-surface-500 hover:bg-surface-800 hover:text-white"
                >
                  {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button fullWidth className="bg-gradient-to-r from-brand-500 to-brand-700 text-white border-0">
              <ExternalLink className="h-4 w-4" />
              Open in Wallet
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-surface-400">
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-400">1</span>
              <p>Send the exact amount shown above to the receiving address.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-400">2</span>
              <p>Use the same network shown above (sending on a different network may result in loss of funds).</p>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-400">3</span>
              <p>Once sent, the system will automatically verify the transaction on-chain.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-400">4</span>
              <p>Your order status will update once payment is confirmed (typically within minutes).</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
