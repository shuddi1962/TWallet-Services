"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { ArrowLeft, Clock, CheckCircle2, Truck, XCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_CONFIG: Record<string, { label: string; color: "warning" | "success" | "info" | "error" | "default"; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "warning", icon: Clock },
  paid: { label: "Paid", color: "info", icon: CheckCircle2 },
  processing: { label: "Processing", color: "info", icon: AlertCircle },
  shipped: { label: "Shipped", color: "info", icon: Truck },
  delivered: { label: "Delivered", color: "success", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "error", icon: XCircle },
};

const TIMELINE_STEPS = ["pending", "paid", "processing", "shipped", "delivered"];

export default function OrderDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function loadOrder() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("card_orders")
        .select("*, card_products(name, type)")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        setError(error?.message ?? "Order not found");
      } else {
        setOrder(data);
      }
      setLoading(false);
    }

    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Order Not Found</h1>
          <p className="mt-2 text-surface-400">{error ?? "Could not load order."}</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/dashboard/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = (STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending)!;
  const StatusIcon = statusConfig.icon;
  const currentStepIndex = TIMELINE_STEPS.indexOf(order.status);

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
          <h1 className="text-2xl font-bold text-white">Order {order.order_number}</h1>
          <p className="mt-1 text-sm text-surface-400">
            Placed {new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Badge variant={statusConfig.color} className="ml-auto">
          <StatusIcon className="mr-1 h-3 w-3" aria-hidden="true" />
          {statusConfig.label}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Order Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-0">
              {TIMELINE_STEPS.map((step, i) => {
                const cfg = (STATUS_CONFIG[step] ?? STATUS_CONFIG.pending)!;
                const StepIcon = cfg.icon;
                const isComplete = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;
                return (
                  <div key={step} className="relative flex gap-4 pb-8 last:pb-0">
                    {i < TIMELINE_STEPS.length - 1 && (
                      <div className={`absolute left-[15px] top-8 h-full w-px ${isComplete ? "bg-brand-500" : "bg-surface-800"}`} aria-hidden="true" />
                    )}
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isComplete ? (isCurrent ? "bg-brand-500" : "bg-brand-500/20") : "bg-surface-800"
                    }`}>
                      <StepIcon className={`h-4 w-4 ${isComplete ? "text-white" : "text-surface-500"}`} aria-hidden="true" />
                    </div>
                    <div className="pt-1">
                      <p className={`text-sm font-medium ${isComplete ? "text-surface-50" : "text-surface-500"}`}>
                        {cfg.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-surface-400">Product</span>
                <span className="text-surface-200">{order.card_products?.name ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-400">Type</span>
                <span className="text-surface-200">{order.card_products?.type ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-400">Network</span>
                <span className="text-surface-200 capitalize">{order.network}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-400">Amount</span>
                <span className="font-semibold text-brand-400">{order.amount_usdc} USDC</span>
              </div>
              {order.tx_hash && (
                <div className="flex justify-between">
                  <span className="text-surface-400">Tx Hash</span>
                  <span className="max-w-[160px] truncate font-mono text-xs text-surface-300">{order.tx_hash}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {order.status === "pending" && (
            <Button fullWidth asChild>
              <Link href={`/dashboard/orders/${order.id}/payment`}>Pay Now</Link>
            </Button>
          )}
          {order.status === "shipped" && order.tracking_number && (
            <Button fullWidth variant="outline" asChild>
              <Link href={`/dashboard/orders/${order.id}/tracking`}>Track Shipment</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}