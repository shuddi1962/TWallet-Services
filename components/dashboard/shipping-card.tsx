"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Truck, PackageCheck, MapPin, ArrowRight, Hash } from "lucide-react";
import { OrderTracking } from "@/components/dashboard/order-tracking";
import { cn } from "@/lib/utils/cn";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  paid: "bg-sky-50 text-sky-700 ring-sky-200",
  processing: "bg-violet-50 text-violet-700 ring-violet-200",
  shipped: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
};

const STATUS_PROGRESS: Record<string, number> = {
  pending: 8,
  paid: 25,
  processing: 50,
  shipped: 75,
  delivered: 100,
  cancelled: 0,
};

const ETA_LABEL: Record<string, string> = {
  pending: "Awaiting payment confirmation",
  paid: "Card enters production within 24 hours",
  processing: "Ships in 3–5 business days",
  shipped: "On its way — arrives in 3–5 business days",
  delivered: "Delivered",
};

interface ShippingCardProps {
  order: {
    id: string;
    order_number: string;
    status: string;
    tracking_number: string | null;
    carrier: string | null;
  };
  trackingHref?: string;
  className?: string;
}

export function ShippingCard({ order, trackingHref, className }: ShippingCardProps) {
  const progress = STATUS_PROGRESS[order.status] ?? 0;
  const statusStyle = STATUS_STYLE[order.status] ?? STATUS_STYLE.pending;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl" />

      <div className="relative mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 ring-1 ring-indigo-200">
            <Truck className="h-4 w-4 text-indigo-600" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Shipping &amp; Tracking</p>
            <p className="text-[11px] text-slate-500">{ETA_LABEL[order.status] ?? "Track your card"}</p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1",
            statusStyle,
          )}
        >
          {order.status}
        </span>
      </div>

      <div className="relative">
        <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-slate-500">
          <span>Progress</span>
          <span className="text-slate-700">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500"
          />
        </div>
      </div>

      {(order.tracking_number || order.carrier) && (
        <div className="relative mt-3 flex flex-wrap gap-2">
          {order.carrier && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700">
              <PackageCheck className="h-3 w-3 text-slate-400" aria-hidden="true" />
              {order.carrier}
            </span>
          )}
          {order.tracking_number && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700">
              <Hash className="h-3 w-3 text-slate-400" aria-hidden="true" />
              <span className="font-mono">{order.tracking_number}</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700">
            <MapPin className="h-3 w-3 text-slate-400" aria-hidden="true" />
            International
          </span>
        </div>
      )}

      <OrderTracking status={order.status} className="relative mt-4" />

      <div className="relative mt-3 flex items-center justify-between">
        <p className="font-mono text-[11px] text-slate-400">#{order.order_number}</p>
        <Link
          href={trackingHref ?? `/dashboard/orders/${order.id}/tracking`}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 transition hover:text-brand-700"
        >
          View full tracking
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
