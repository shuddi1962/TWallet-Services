import { PaymentCheckout } from "@/components/payment/payment-checkout";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PaymentCheckout
      orderId={id}
      orderNumber="TW-PENDING"
      amountUsdc={25}
      receivingAddress="0x0000000000000000000000000000000000000000"
      networkName="Ethereum"
      tokenSymbol="USDC"
    />
  );
}
