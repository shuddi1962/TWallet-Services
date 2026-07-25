"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, useChainId, useSwitchChain, useSendTransaction } from "wagmi";
import { submitPaymentTx } from "@/features/payments/server/actions";
import { createClient } from "@/lib/supabase/client";
import { formatPaymentError } from "@/lib/payment-errors";
import {
  trackPaymentInitiated,
  trackPaymentVerified,
  trackPaymentFailed,
  trackWalletAddressCopied,
} from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

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

export function PaymentForm({
  orderId,
  order,
  networks,
  receivingWallets,
  tokens,
  existingTx,
}: PaymentFormProps) {
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

  const [submitState, setSubmitState] = useState<{
    error?: string;
    success?: boolean;
    message?: string;
  } | null>(null);
  const [isPending, setIsPending] = useState(false);

  const network = networks.find((n) => n.name.toLowerCase() === order.network.toLowerCase());
  const wallet = receivingWallets.find((w) => w.network_id === network?.id);
  const token = tokens.find(
    (t) => t.symbol === order.token.toUpperCase() && t.network_id === network?.id,
  );

  const copyAddress = useCallback(() => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackWalletAddressCopied();
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
    trackPaymentInitiated(String(order.amount_usdc), order.network);

    try {
      const tx = await sendTransactionAsync({
        to: wallet.address as `0x${string}`,
        value: BigInt(Math.floor(order.amount_usdc * 10 ** (token?.decimals ?? 6))),
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
      trackPaymentFailed(formatted.message);
    }
  }, [
    wallet,
    network,
    address,
    chainId,
    switchChainAsync,
    sendTransactionAsync,
    order,
    token,
    orderId,
  ]);

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
          trackPaymentVerified(orderId);
          clearInterval(interval);
        } else if (data.confirmations && data.confirmations > 0) {
          setVerificationMessage(
            `Waiting for confirmations (${data.confirmations}/${data.required_confirmations ?? 6})`,
          );
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
          <div
            className="flex items-center gap-2 rounded-lg bg-blue-500/10 p-3 text-sm text-blue-400"
            role="alert"
          >
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending transaction...
          </div>
        );
      case "submitted":
      case "verifying":
        return (
          <div
            className="flex items-center gap-2 rounded-lg bg-yellow-500/10 p-3 text-sm text-yellow-400"
            role="alert"
          >
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {verificationMessage || "Waiting for verification..."}
          </div>
        );
      case "verified":
        return (
          <div
            className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-400"
            role="alert"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {verificationMessage}
          </div>
        );
      case "failed":
        return (
          <div
            className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400"
            role="alert"
          >
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
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle2 className="h-8 w-8 text-green-400" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-white">Payment Verified!</h2>
            <p className="text-surface-400 mt-2">
              Your payment for order {order.order_number} has been confirmed on-chain.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/dashboard/orders">View My Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isConnected) {
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
            <p className="text-surface-400 mt-1 text-sm">
              Connect your wallet to pay for order {order.order_number}
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-surface-400">Please connect your wallet to proceed with payment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <p className="text-surface-400 mt-1 text-sm">
            Send crypto to complete order{" "}
            <span className="text-surface-200 font-medium">{order.order_number}</span>
          </p>
        </div>
      </div>

      {renderStatusBadge()}

      {submitState?.error && (
        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400" role="alert">
          {formatPaymentError(submitState.error).message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Send the exact amount to the address below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-surface-800 bg-surface-900/50 rounded-xl border p-4">
              <p className="text-surface-500 mb-1 text-xs">Amount to Pay</p>
              <p className="text-2xl font-bold text-white">
                {order.amount_usdc} {order.token.toUpperCase()}
              </p>
              <p className="text-surface-400 text-sm">≈ ${order.amount_usdc.toFixed(2)} USD</p>
            </div>

            <div>
              <p className="text-surface-500 mb-2 text-xs">Network</p>
              <div className="border-surface-800 bg-surface-900/50 flex items-center gap-2 rounded-lg border px-4 py-3">
                <div className="h-2 w-2 rounded-full bg-[#627EEA]" />
                <span className="text-sm text-white">{network?.name ?? order.network}</span>
              </div>
            </div>

            <div>
              <p className="text-surface-500 mb-2 text-xs">Receiving Address</p>
              <div className="border-surface-800 bg-surface-900/50 flex items-center gap-2 rounded-lg border px-4 py-3">
                <code className="text-surface-300 flex-1 font-mono text-xs break-all">
                  {wallet?.address ?? "No address available"}
                </code>
                {wallet?.address && (
                  <button
                    onClick={copyAddress}
                    className="text-surface-500 hover:bg-surface-800 shrink-0 rounded-md p-1.5 hover:text-white"
                    aria-label="Copy receiving address"
                  >
                    {copied ? (
                      <Check className="text-success h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {txHash && (
              <div>
                <p className="text-surface-500 mb-2 text-xs">Transaction Hash</p>
                <div className="border-surface-800 bg-surface-900/50 rounded-lg border px-4 py-3">
                  <code className="text-surface-300 font-mono text-xs break-all">{txHash}</code>
                </div>
              </div>
            )}

            {wallet?.address && network && verificationStatus === "idle" && (
              <Button
                fullWidth
                className="from-brand-500 to-brand-700 bg-gradient-to-r text-white"
                onClick={handleSendPayment}
                disabled={verificationStatus !== "idle" || !isConnected || isPending}
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Send Payment with Wallet
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="text-surface-400 space-y-4 text-sm">
            <div className="flex gap-3">
              <span
                className="bg-brand-500/20 text-brand-400 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                aria-hidden="true"
              >
                1
              </span>
              <p>
                Click <strong className="text-white">Send Payment with Wallet</strong> to open your
                connected wallet.
              </p>
            </div>
            <div className="flex gap-3">
              <span
                className="bg-brand-500/20 text-brand-400 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                aria-hidden="true"
              >
                2
              </span>
              <p>
                Review the transaction details and confirm in your wallet. Use the{" "}
                <strong className="text-white">{network?.name ?? order.network}</strong> network.
              </p>
            </div>
            <div className="flex gap-3">
              <span
                className="bg-brand-500/20 text-brand-400 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                aria-hidden="true"
              >
                3
              </span>
              <p>The system will automatically verify the transaction on-chain once sent.</p>
            </div>
            <div className="flex gap-3">
              <span
                className="bg-brand-500/20 text-brand-400 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                aria-hidden="true"
              >
                4
              </span>
              <p>
                Your order status will update once payment is confirmed. This page refreshes
                automatically.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
