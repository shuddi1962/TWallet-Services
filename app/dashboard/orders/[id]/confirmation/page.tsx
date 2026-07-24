import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
          <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-white">Order Placed!</h1>
        <p className="mt-2 text-gray-400">Your order has been created successfully.</p>
        <div className="mt-8 space-y-3">
          <Link href={`/dashboard/orders/${id}/payment`} className="block w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 transition">
            Go to Payment
          </Link>
          <Link href={`/dashboard/orders/${id}`} className="block w-full rounded-xl border border-gray-700 px-4 py-3 font-semibold text-gray-200 hover:border-gray-600 transition">
            View Order Details
          </Link>
        </div>
      </div>
    </div>
  );
}