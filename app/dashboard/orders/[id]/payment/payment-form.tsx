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

  const network = networks.find((n) => n.name.toLowerCase() === order.network.toLowerCase());
  const wallet = receivingWallets.find((w) => w.network_id === network?.id);
  const token = tokens.find((t) => t.symbol === order.token.toUpperCase() && t.network_id === network?.id);

  const copyAddress = useCallback(() => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
          <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 p-3 text-sm text-blue-400" role="alert">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending transaction...
          </div>
        );
      case "submitted":
      case "verifying":
        return (
          <div className="flex items-center gap-2 rounded-lg bg-yellow-500/10 p-3 text-sm text-yellow-400" role="alert">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {verificationMessage || "Waiting for verification..."}
          </div>
        );
      case "verified":
        return (
          <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-400" role="alert">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {verificationMessage}
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400" role="alert">
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
            <p className="mt-2 text-surface-400">Your payment for order {order.order_number} has been confirmed on-chain.</p>
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
            <p className="mt-1 text-sm text-surface-400">
              Connect a wallet to pay for order {order.order_number}
            </p>
          </div>
        </div>
        <Card className="overflow-hidden border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/15 ring-1 ring-brand-500/25">
              <Smartphone className="h-6 w-6 text-brand-300" />
            </div>
            <p className="font-medium text-white">Wallet required</p>
            <p className="mt-2 max-w-sm text-sm text-surface-400">
              Use the Connect Wallet button in the header (MetaMask, Trust Wallet, or WalletConnect).
            </p>
            <Button className="mt-6 rounded-full" asChild>
              <Link href="/dashboard/wallet">Open wallet page</Link>
            </Button>
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
          <p className="mt-1 text-sm text-surface-400">
            Send crypto to complete order <span className="font-medium text-surface-200">{order.order_number}</span>
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
            <CardTitle>Pay Using Trust Wallet</CardTitle>
            <CardDescription>Send the exact amount to the address below using Trust Wallet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-4">
              <p className="mb-1 text-xs text-surface-500">Amount to Pay</p>
              <p className="text-2xl font-bold text-white">
                {order.amount_usdc} {order.token.toUpperCase()}
              </p>
              <p className="text-sm text-surface-400">≈ ${order.amount_usdc.toFixed(2)} USD</p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-surface-800 bg-surface-900/50 p-4">
              <Smartphone className="h-5 w-5 text-brand-400" />
              <div>
                <p className="text-sm font-medium text-surface-50">Trust Wallet</p>
                <p className="text-xs text-surface-400">Connected Wallet</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs text-surface-500">Network</p>
              <div className="flex items-center gap-2 rounded-lg border border-surface-800 bg-surface-900/50 px-4 py-3">
                <div className="h-2 w-2 rounded-full bg-[#627EEA]" />
                <span className="text-sm text-white">{network?.name ?? order.network}</span>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs text-surface-500">Receiving Address</p>
              <div className="flex items-center gap-2 rounded-lg border border-surface-800 bg-surface-900/50 px-4 py-3">
                <code className="flex-1 break-all font-mono text-xs text-surface-300">
                  {wallet?.address ?? "No address available"}
                </code>
                {wallet?.address && (
                  <button
                    onClick={copyAddress}
                    className="shrink-0 rounded-md p-1.5 text-surface-500 hover:bg-surface-800 hover:text-white"
                    aria-label="Copy receiving address"
                  >
                    {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>

            {txHash && (
              <div>
                <p className="mb-2 text-xs text-surface-500">Transaction Hash</p>
                <div className="rounded-lg border border-surface-800 bg-surface-900/50 px-4 py-3">
                  <code className="break-all font-mono text-xs text-surface-300">{txHash}</code>
                </div>
              </div>
            )}

            {wallet?.address && network && verificationStatus === "idle" && (
              <Button
                fullWidth
                className="bg-gradient-to-r from-brand-500 to-brand-700 text-white"
                onClick={handleSendPayment}
                disabled={verificationStatus !== "idle" || !isConnected || isPending}
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Send Payment with Trust Wallet
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-surface-400">
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-400" aria-hidden="true">1</span>
              <p>Click <strong className="text-white">Send Payment with Trust Wallet</strong> to open Trust Wallet on your phone.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-400" aria-hidden="true">2</span>
              <p>Review the transaction details and confirm in Trust Wallet. Use the <strong className="text-white">{network?.name ?? order.network}</strong> network.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-400" aria-hidden="true">3</span>
              <p>The system will automatically verify the transaction on-chain once sent.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-400" aria-hidden="true">4</span>
              <p>Your order status will update once payment is confirmed. This page refreshes automatically.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
