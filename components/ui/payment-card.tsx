"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export interface PaymentCardProps {
  payment: {
    id: string;
    txHash: string;
    amount: number;
    network: string;
    status: string;
    createdAt: string;
    explorerUrl?: string;
  };
  className?: string;
}

const STATUS_VARIANT: Record<string, "outline" | "info" | "success" | "warning" | "error"> = {
  pending: "warning",
  confirming: "info",
  confirmed: "success",
  failed: "error",
  expired: "outline",
};

export function PaymentCard({ payment, className }: PaymentCardProps) {
  const [copied, setCopied] = useState(false);

  const copyHash = () => {
    navigator.clipboard?.writeText(payment.txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortHash = `${payment.txHash.slice(0, 10)}...${payment.txHash.slice(-8)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-2xl border border-surface-800 bg-surface-900 p-5 transition-colors",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-surface-500">Transaction Hash</p>
          <div className="mt-1 flex items-center gap-2">
            <code className="truncate font-mono text-sm text-surface-200">{shortHash}</code>
            <button
              onClick={copyHash}
              className="shrink-0 rounded p-1 text-surface-400 hover:text-surface-200"
              aria-label="Copy transaction hash"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-400" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            </button>
          </div>
        </div>
        <Badge variant={STATUS_VARIANT[payment.status] ?? "outline"} className="capitalize">
          {payment.status}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-surface-500">Amount</p>
          <p className="mt-1 text-lg font-bold text-white">
            ${Number(payment.amount).toFixed(2)} <span className="text-xs font-normal text-surface-400">USDC</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-surface-500">Network</p>
          <p className="mt-1 text-sm font-medium text-surface-200 capitalize">{payment.network}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-surface-500">
          {new Date(payment.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
        </p>
        {payment.explorerUrl && (
          <Button variant="ghost" size="sm" asChild>
            <a href={payment.explorerUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3" aria-hidden="true" /> View on Explorer
            </a>
          </Button>
        )}
      </div>
    </motion.div>
  );
}