"use client";

import { motion } from "framer-motion";
import { ClipboardCheck, ShieldCheck, Factory, Truck, PackageCheck, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const STEPS = [
  { key: "placed", label: "Order placed", hint: "Order confirmed", icon: ClipboardCheck },
  { key: "paid", label: "Payment verified", hint: "On-chain confirmed", icon: ShieldCheck },
  { key: "processing", label: "In production", hint: "Card being made", icon: Factory },
  { key: "shipped", label: "Shipped", hint: "On its way", icon: Truck },
  { key: "delivered", label: "Delivered", hint: "Arrived", icon: PackageCheck },
] as const;

const STATUS_INDEX: Record<string, number> = {
  pending: 0,
  paid: 1,
  processing: 2,
  shipped: 3,
  delivered: 4,
};

interface OrderTrackingProps {
  status: string;
  className?: string;
}

export function OrderTracking({ status, className }: OrderTrackingProps) {
  const currentIndex = STATUS_INDEX[status];

  if (currentIndex === undefined) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3",
          className,
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-red-700 capitalize">{status}</p>
          <p className="text-xs text-red-500">
            {status === "cancelled"
              ? "This order was cancelled. Contact support if you have questions."
              : "This order is no longer in transit."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-start">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const done = i < currentIndex;
          const active = i === currentIndex;

          return (
            <div key={step.key} className="relative flex-1 first:flex-none">
              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.06, duration: 0.25 }}
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-2 transition-colors sm:h-10 sm:w-10",
                    done && "bg-brand-500 text-white ring-brand-200",
                    active && "bg-brand-500 text-white ring-brand-300 shadow-md shadow-brand-500/30",
                    !done && !active && "bg-slate-100 text-slate-400 ring-slate-200",
                  )}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </motion.div>
                <p
                  className={cn(
                    "mt-2 hidden text-[11px] font-medium leading-tight sm:block",
                    active || done ? "text-slate-900" : "text-slate-400",
                  )}
                >
                  {step.label}
                </p>
                <p
                  className={cn(
                    "mt-0.5 hidden text-[10px] leading-tight sm:block",
                    active ? "text-brand-600" : "text-slate-400",
                  )}
                >
                  {active && currentIndex < STEPS.length - 1 ? "In progress" : step.hint}
                </p>
              </div>

              {i < STEPS.length - 1 && (
                <div
                  className="absolute left-1/2 top-[17px] h-1 -translate-y-1/2 rounded-full sm:top-[19px]"
                  style={{ width: "calc(100% - 2.5rem)" }}
                >
                  <div
                    className={cn(
                      "h-full rounded-full transition-colors duration-500",
                      i < currentIndex ? "bg-brand-500" : "bg-slate-200",
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs text-slate-400 sm:hidden">
        {STEPS[currentIndex]?.label}
      </p>
    </div>
  );
}
