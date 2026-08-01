import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirect=/dashboard");

  const { data: order } = await supabase
    .from("card_orders")
    .select("id, order_number, status, amount_usdc, paid_usdc, card_products(name, type)")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!order) {
    redirect("/dashboard/orders");
  }

  const needsPayment = order.status === "pending";

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
          <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">Order Placed!</h1>
        <p className="mt-2 text-slate-500">
          Your <span className="font-medium text-slate-700">{order.card_products?.name ?? "card"}</span> order
          ({order.order_number}) was created successfully.
        </p>
        <div className="mx-auto mt-4 flex max-w-xs items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm">
          <span className="text-slate-500">Amount due</span>
          <span className="font-semibold text-slate-900">
            ${Number(order.amount_usdc).toFixed(2)} USDC
          </span>
        </div>
        <div className="mt-8 space-y-3">
          {needsPayment && (
            <Button className="w-full" asChild>
              <Link href={`/dashboard/orders/${order.id}/payment`}>Go to Payment</Link>
            </Button>
          )}
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/dashboard/orders/${order.id}`}>View Order Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
