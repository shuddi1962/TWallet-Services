"use client";

import { motion } from "framer-motion";
import { Package, Truck, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export interface OrderCardProps {
  order: {
    id: string;
    orderNumber: string;
    productName: string;
    status: string;
    createdAt: string;
    amountUsdc: number;
    trackingNumber?: string | null;
  };
  onView?: (id: string) => void;
  onTrack?: (id: string) => void;
  className?: string;
}

const STATUS_VARIANT: Record<string, "outline" | "info" | "success" | "warning" | "error"> = {
  pending: "warning",
  paid: "success",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
  refunded: "outline",
};

export function OrderCard({ order, onView, onTrack, className }: OrderCardProps) {
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
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10">
            <Package className="h-5 w-5 text-brand-400" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-mono text-surface-500">#{order.orderNumber}</p>
            <h3 className="text-sm font-semibold text-white">{order.productName}</h3>
          </div>
        </div>
        <Badge variant={STATUS_VARIANT[order.status] ?? "outline"} className="capitalize">
          {order.status}
        </Badge>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-surface-500">{new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
          <p className="mt-1 text-lg font-bold text-white">${Number(order.amountUsdc).toFixed(2)} <span className="text-xs font-normal text-surface-400">USDC</span></p>
        </div>
        {order.trackingNumber && (
          <div className="text-right">
            <p className="text-xs text-surface-500">Tracking</p>
            <p className="text-xs font-mono text-surface-300">{order.trackingNumber}</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onView?.(order.id)}>
          View Order <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Button>
        {order.trackingNumber && (
          <Button variant="ghost" size="sm" onClick={() => onTrack?.(order.id)}>
            <Truck className="h-3 w-3" aria-hidden="true" /> Track
          </Button>
        )}
      </div>
    </motion.div>
  );
}