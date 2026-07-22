"use client";

import { useState } from "react";
import { submitPaymentTx } from "@/features/payments/server/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, AlertCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface PaymentCheckoutProps {
  orderId: string;
  orderNumber: string;
  amountUsdc: number;
  receivingAddress: string;
  networkName: string;
  tokenSymbol: string;
}

export function PaymentCheckout({
  orderId,
  orderNumber,
  amountUsdc,
  receivingAddress,
  networkName,
  tokenSymbol,
}: PaymentCheckoutProps) {
  const [txHash, setTxHash] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(receivingAddress);
    setCopied(true);
    toast.success("Address copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.set("orderId", orderId);
    formData.set("txHash", txHash);
    formData.set("fromAddress", fromAddress);

    const result = await submitPaymentTx(null, formData);

    if (result?.error) {
      toast.error(result.error);
      setSubmitting(false);
    } else if (result?.success) {
      toast.success(result.message);
      window.location.href = "/dashboard/orders";
    } else {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payment Checkout</h1>
        <p className="mt-1 text-sm text-surface-400">
          Order #{orderNumber} — Pay with crypto
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>
            Send the exact amount to the receiving address below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-brand-500/10 ring-1 ring-brand-500/20 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-400">Amount Due</span>
              <span className="text-2xl font-bold text-brand-400">
                {amountUsdc} {tokenSymbol}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-white/5 bg-surface-800/50 p-4">
            <p className="text-xs font-medium text-surface-500">
              Receiving Address ({networkName})
            </p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="break-all font-mono text-sm text-white">
                {receivingAddress}
              </p>
              <button
                onClick={copyAddress}
                className="shrink-0 rounded-md p-2 text-surface-500 transition-colors hover:bg-white/5 hover:text-white"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/5 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <div className="text-sm text-surface-300">
              <p className="font-medium text-warning">Important:</p>
              <ul className="mt-1 list-inside list-disc space-y-1 text-surface-400">
                <li>Send only {tokenSymbol} on {networkName} to this address</li>
                <li>Send the exact amount: {amountUsdc} {tokenSymbol}</li>
                <li>Payment expires in 48 hours</li>
                <li>Verification requires 12 confirmations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submit Transaction</CardTitle>
          <CardDescription>
            After sending the payment, paste your transaction hash below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromAddress">Your Wallet Address</Label>
              <Input
                id="fromAddress"
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
                placeholder="0x..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="txHash">Transaction Hash</Label>
              <Input
                id="txHash"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="0x..."
                required
              />
            </div>

            <Button type="submit" fullWidth loading={submitting}>
              Submit for Verification
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center">
        <Link
          href="/dashboard/orders"
          className="text-sm text-surface-500 hover:text-brand-400"
        >
          Cancel and return to orders
        </Link>
      </div>
    </div>
  );
}
