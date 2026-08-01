import { getPaymentDetails } from "@/features/payments/server/actions";
import { PaymentForm } from "./payment-form";

export default async function PaymentPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const { data, error } = await getPaymentDetails(id);

  if (error || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Order Not Found</h1>
          <p className="mt-2 text-slate-500">{error ?? "Could not load payment details."}</p>
        </div>
      </div>
    );
  }

  return (
    <PaymentForm
      orderId={id}
      order={data.order}
      networks={data.networks}
      receivingWallets={data.receivingWallets}
      tokens={data.tokens}
      existingTx={data.paymentTx}
    />
  );
}