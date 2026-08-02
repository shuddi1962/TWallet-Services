"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, useChainId, useSwitchChain, useSendTransaction, useWriteContract } from "wagmi";
import { erc20Abi } from "viem";
import { submitPaymentTx } from "@/features/payments/server/actions";
import { createClient } from "@/lib/supabase/client";
import { formatPaymentError } from "@/lib/payment-errors";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Copy, Check, Loader2, AlertCircle, CheckCircle2, Smartphone } from "lucide-react";
import Link from "next/link";
import { AddressQR } from "@/components/ui/address-qr";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { toast } from "sonner";

type Order = {
  id: string;
  order_number: string;
  amount_usdc: number;
  status: string;
  network: string;
  token: string;
};

type Network = {
  id: string;
  name: string;
  chain_id: number;
  currency: string;
  explorer_url: string;
};

type Wallet = {
  id: string;
  network_id: string;
  address: string;
  label: string;
};

type Token = {
  id: string;
  network_id: string;
  symbol: string;
  contract_address: string | null;
  decimals: number;
};

type PaymentTx = {
  id: string;
  tx_hash: string | null;
  status: string;
  amount: number;
  from_address: string | null;
  to_address: string | null;
  confirmations: number;
} | null;

type VerificationStatus = "idle" | "sending" | "submitted" | "verifying" | "verified" | "failed";

interface PaymentFormProps {
  orderId: string;
  order: Order;
  networks: Network[];
  receivingWallets: Wallet[];
  tokens: Token[];
  existingTx: PaymentTx;
}

export function PaymentForm({ orderId, order, networks, receivingWallets, tokens, existingTx }: PaymentFormProps) {
  const [copied, setCopied] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(
    existingTx?.tx_hash ? "verifying" : "idle",
  );
  const [verificationMessage, setVerificationMessage] = useState("");
  const [txHash, setTxHash] = useState(existingTx?.tx_hash ?? "");
  const supabase = createClient();

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();

  const [submitState, setSubmitState] = useState<{ error?: string; success?: boolean; message?: string } | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [manualHash, setManualHash] = useState("");
  const [manualFrom, setManualFrom] = useState("");

  const network = networks.find((n) => n.name.toLowerCase() === order.network.toLowerCase());
  const wallet = receivingWallets.find((w) => w.network_id === network?.id);
  const token = tokens.find((t) => t.symbol === order.token.toUpperCase() && t.network_id === network?.id);

  const copyAddress = useCallback(async () => {
    if (!wallet?.address) return;
    const ok = await copyToClipboard(wallet.address);
    if (ok) {
      setCopied(true);
      toast.success("Address copied");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Could not copy address");
    }
  }, [wallet]);

  const handleSendPayment = useCallback(async () => {
    if (!wallet || !network || !address) return;

    if (chainId !== network.chain_id && switchChainAsync) {
      try {
        await switchChainAsync({ chainId: network.chain_id });
      } catch {
        setVerificationStatus("failed");
        setVerificationMessage("Failed to switch network. Please switch manually in your wallet.");
        return;
      }
    }

    setVerificationStatus("sending");
    setVerificationMessage("");

    try {
      const tokenDecimals = token?.decimals ?? 6;
      const rawAmount = BigInt(Math.floor(order.amount_usdc * 10 ** tokenDecimals));
      const isErc20 = token?.contract_address && token.contract_address.length > 0;

      const tx = isErc20 && writeContractAsync
        ? await writeContractAsync({
            address: token!.contract_address as `0x${string}`,
            abi: erc20Abi,
            functionName: "transfer",
            args: [wallet.address as `0x${string}`, rawAmount],
          })
        : await sendTransactionAsync({
            to: wallet.address as `0x${string}`,
            value: rawAmount,
          });

      setTxHash(tx);
      setVerificationStatus("submitted");
      setIsPending(true);

      const formData = new FormData();
      formData.set("orderId", orderId);
      formData.set("txHash", tx);
      formData.set("fromAddress", address);
      const result = await submitPaymentTx(null, formData);
      setSubmitState(result);
      setIsPending(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Transaction failed";
      const formatted = formatPaymentError(msg);
      setVerificationStatus("failed");
      setVerificationMessage(formatted.message);
    }
  }, [wallet, network, address, chainId, switchChainAsync, sendTransactionAsync, order, token, orderId]);

  const handleManualSubmit = useCallback(async () => {
    const hash = manualHash.trim();
    if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) {
      setVerificationStatus("failed");
      setVerificationMessage("Enter a valid transaction hash (0x + 64 hex characters).");
      return;
    }

    setVerificationStatus("submitted");
    setVerificationMessage("");
    setIsPending(true);
    setTxHash(hash);

    try {
      const formData = new FormData();
      formData.set("orderId", orderId);
      formData.set("txHash", hash);
      formData.set("fromAddress", manualFrom.trim());
      const result = await submitPaymentTx(null, formData);
      setSubmitState(result);
      if (result?.error) {
        setVerificationStatus("failed");
        setVerificationMessage(result.error);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment submission failed";
      const formatted = formatPaymentError(msg);
      setVerificationStatus("failed");
      setVerificationMessage(formatted.message);
    } finally {
      setIsPending(false);
    }
  }, [manualHash, manualFrom, orderId]);

  useEffect(() => {
    if (verificationStatus !== "submitted" && verificationStatus !== "verifying") return;
    if (!txHash) return;

    setVerificationStatus("verifying");

    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: {
            tx_hash: txHash,
            expected_amount: order.amount_usdc.toString(),
            expected_address: wallet?.address ?? "",
            chain_id: network?.chain_id ?? 1,
            token_address: token?.contract_address ?? null,
          },
        });

        if (error) {
          setVerificationMessage("Verification check failed. Retrying...");
          return;
        }

        if (data.verified) {
          setVerificationStatus("verified");
          setVerificationMessage("Payment verified on-chain!");
          clearInterval(interval);
        } else if (data.confirmations && data.confirmations > 0) {
          setVerificationMessage(`Waiting for confirmations (${data.confirmations}/${data.required_confirmations ?? 6})`);
        } else {
          setVerificationMessage("Checking transaction...");
        }
      } catch {
        setVerificationMessage("Verification check failed. Retrying...");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [verificationStatus, txHash, supabase, order.amount_usdc, wallet, network, token]);

  const renderStatusBadge = () => {
    switch (verificationStatus) {
      case "sending":
        return (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-600" role="alert">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending transaction...
          </div>
        );
      case "submitted":
      case "verifying":
        return (
          <div className="flex items-center gap-2 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700" role="alert">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {verificationMessage || "Waiting for verification..."}
          </div>
        );
      case "verified":
        return (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-600" role="alert">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {verificationMessage}
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600" role="alert">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            {verificationMessage}
          </div>
        );
      default:
        return null;
    }
  };

  if (verificationStatus === "verified") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/orders">
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="h-8 w-8 text-green-600" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Payment Verified!</h2>
            <p className="mt-2 text-slate-500">Your payment for order {order.order_number} has been confirmed on-chain.</p>
            <Button className="mt-6" asChild>
              <Link href="/dashboard/orders">View My Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Complete Payment</h1>
          <p className="mt-1 text-sm text-slate-500">
            Send crypto to complete order <span className="font-medium text-slate-700">{order.order_number}</span>
          </p>
        </div>
      </div>

      {renderStatusBadge()}

      {submitState?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600" role="alert">
          {formatPaymentError(submitState.error).message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pay Using Trust Wallet</CardTitle>
            <CardDescription>Send the exact amount to the address below using Trust Wallet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-1 text-xs text-slate-400">Amount to Pay</p>
              <p className="text-2xl font-bold text-slate-900">
                {order.amount_usdc} {order.token.toUpperCase()}
              </p>
              <p className="text-sm text-slate-500">≈ ${order.amount_usdc.toFixed(2)} USD</p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <Smartphone className="h-5 w-5 text-brand-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">Trust Wallet</p>
                <p className="text-xs text-slate-500">
                  {isConnected ? "Connected Wallet" : "Send from any wallet, then verify below"}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs text-slate-400">Network</p>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="h-2 w-2 rounded-full bg-[#627EEA]" />
                <span className="text-sm text-slate-900">{network?.name ?? order.network}</span>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs text-slate-400">Receiving Address</p>
              {wallet?.address && (
                <div className="mb-3 flex justify-center rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <AddressQR
                    value={wallet.address}
                    size={180}
                    label="Scan to pay with your wallet"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <code className="flex-1 break-all font-mono text-xs text-slate-600">
                  {wallet?.address ?? "No address available"}
                </code>
                {wallet?.address && (
                  <button
                    type="button"
                    onClick={copyAddress}
                    className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
                    aria-label="Copy receiving address"
                  >
                    {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>

            {txHash && (
              <div>
                <p className="mb-2 text-xs text-slate-400">Transaction Hash</p>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <code className="break-all font-mono text-xs text-slate-600">{txHash}</code>
                </div>
              </div>
            )}

            {wallet?.address && network && verificationStatus === "idle" && (
              <Button
                fullWidth
                className="bg-black text-white hover:bg-neutral-800"
                onClick={handleSendPayment}
                disabled={verificationStatus !== "idle" || !isConnected || isPending}
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Send Payment with Trust Wallet
              </Button>
            )}

            <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">Already sent the crypto?</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Sent the exact amount from any wallet? Paste your transaction hash to verify it on-chain.
                </p>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={manualHash}
                  onChange={(e) => {
                    setManualHash(e.target.value);
                    setSubmitState(null);
                  }}
                  placeholder="Transaction hash (0x…)"
                  aria-label="Transaction hash"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
                <input
                  type="text"
                  value={manualFrom}
                  onChange={(e) => setManualFrom(e.target.value)}
                  placeholder="Sending wallet address (optional)"
                  aria-label="Sending wallet address"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <Button
                fullWidth
                variant="outline"
                onClick={() => void handleManualSubmit()}
                disabled={verificationStatus !== "idle" && verificationStatus !== "failed" && verificationStatus !== "submitted"}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                )}
                I&apos;ve sent — Verify payment
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-500">
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600" aria-hidden="true">1</span>
              <p>Send the exact amount ({order.amount_usdc} {order.token.toUpperCase()}) to the address from any wallet. Use the <strong className="text-slate-900">{network?.name ?? order.network}</strong> network.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600" aria-hidden="true">2</span>
              <p>Connected a wallet? Use <strong className="text-slate-900">Send Payment with Trust Wallet</strong> to send in one click.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600" aria-hidden="true">3</span>
              <p>Paid manually? Paste the transaction hash under <strong className="text-slate-900">Already sent the crypto?</strong> and click <strong className="text-slate-900">Verify payment</strong>.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600" aria-hidden="true">4</span>
              <p>The system verifies the transaction on-chain and your order status updates automatically.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
