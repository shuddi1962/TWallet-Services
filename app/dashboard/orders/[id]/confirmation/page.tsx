import { getOrder } from "@/features/orders/server/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const { data: order, error } = await getOrder(id);

  if (error || !order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Order Not Found</h1>
          <p className="mt-2 text-surface-400">{error ?? "Could not load order."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10">
          <CheckCircle2 className="h-8 w-8 text-success" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-white">Order Placed!</h1>
        <p className="mt-2 text-surface-400">
          Your order <span className="font-semibold text-surface-200">{order.order_number}</span> has been created.
        </p>

        <Card className="mt-8 text-left">
          <CardHeader>
            <CardTitle className="text-white">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-surface-400">Product</span>
              <span className="text-surface-200">{order.card_products?.name ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">Amount</span>
              <span className="font-semibold text-brand-400">{order.amount_usdc} USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">Status</span>
              <span className="capitalize text-surface-200">{order.status}</span>
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