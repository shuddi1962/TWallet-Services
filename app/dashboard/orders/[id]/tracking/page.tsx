"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, MapPin, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function OrderTrackingPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/orders/${order.id}`}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">Track Order</h1>
          <p className="mt-1 text-sm text-surface-400">{order.order_number}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Truck className="h-5 w-5" aria-hidden="true" />Shipping Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center py-8 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-500/10">
                <Package className="h-10 w-10 text-brand-400" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-surface-50 capitalize">{order.status}</h3>
              <p className="mt-1 text-sm text-surface-400">
                {order.status === "shipped"
                  ? "Your card is on its way!"
                  : order.status === "delivered"
                  ? "Your card has been delivered."
                  : order.status === "cancelled"
                  ? "This order was cancelled."
                  : "Your order is being processed."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MapPin className="h-5 w-5" aria-hidden="true" />Shipping Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-surface-400">Order</span>
              <span className="text-surface-200">{order.order_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">Status</span>
              <Badge variant="info" className="capitalize">{order.status}</Badge>
            </div>
            {order.tracking_number && (
              <div className="flex justify-between">
                <span className="text-surface-400">Tracking</span>
                <span className="text-surface-200">{order.tracking_number}</span>
              </div>
            )}
            {order.shipped_at && (
              <div className="flex justify-between">
                <span className="text-surface-400">Shipped</span>
                <span className="text-surface-200">{new Date(order.shipped_at).toLocaleDateString()}</span>
              </div>
            )}
            {order.delivered_at && (
              <div className="flex justify-between">
                <span className="text-surface-400">Delivered</span>
                <span className="text-surface-200">{new Date(order.delivered_at).toLocaleDateString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}