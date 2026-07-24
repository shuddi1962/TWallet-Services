"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function OrderConfirmationPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Not authenticated"); return; }
      const { data, error: err } = await supabase
        .from("card_orders")
        .select("*, card_products(*), payment_transactions(*), shipping_addresses(*)")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();
      if (err) { setError(err.message); return; }
      setOrder(data);
    }
    load();
  }, [id]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Order Not Found</h1>
          <p className="mt-2 text-surface-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    );
  }

  const cardProducts = order.card_products as Record<string, unknown> | null;

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10">
          <CheckCircle2 className="h-8 w-8 text-success" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-white">Order Placed!</h1>
        <p className="mt-2 text-surface-400">
          Your order <span className="font-semibold text-surface-200">{order.order_number as string}</span> has been created.
        </p>

        <Card className="mt-8 text-left">
          <CardHeader>
            <CardTitle className="text-white">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-surface-400">Product</span>
              <span className="text-surface-200">{cardProducts?.name as string ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">Amount</span>
              <span className="font-semibold text-brand-400">{order.amount_usdc as string} USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">Status</span>
              <span className="capitalize text-surface-200">{order.status as string}</span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 space-y-3">
          <p className="text-sm text-surface-400">Proceed to payment to complete your order.</p>
          <Button fullWidth asChild>
            <Link href={`/dashboard/orders/${order.id}/payment`}>
              Go to Payment
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button variant="outline" fullWidth asChild>
            <Link href={`/dashboard/orders/${order.id}`}>View Order Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}