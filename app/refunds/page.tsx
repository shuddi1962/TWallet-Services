import { LegalPage } from "@/components/legal/legal-page";

export const metadata = {
  title: "Refund Policy | TWallet",
  description: "TWallet refund and cancellation policy for card orders.",
};

export default function RefundsPage() {
  return (
    <LegalPage
      title="Refund Policy"
      subtitle="Our policy on cancellations and refunds for card orders."
      updated="August 1, 2026"
      sections={[
        {
          heading: "Order Cancellation",
          paragraphs: [
            "Orders may be cancelled without penalty while they are in pending status (before payment has been confirmed on-chain).",
            "To cancel a pending order, contact support or use the dashboard. No crypto has been received at this stage, so no refund is required.",
          ],
        },
        {
          heading: "Refundable Situations",
          paragraphs: [
            "If your payment was confirmed on-chain but the card cannot be issued due to product unavailability, a full refund will be issued to the original funding address.",
            "If you receive a defective or incorrect card product, we will replace it at no cost or issue a refund at your request, within 30 days of delivery.",
          ],
        },
        {
          heading: "Non-Refundable Situations",
          paragraphs: [
            "Once a virtual card has been issued, it cannot be refunded, as the card has been provisioned and its cost incurred.",
            "Physical cards that have been shipped cannot be refunded unless they arrive defective or damaged.",
            "Loss or theft of a physical card is not refundable, though replacement cards may be available for an additional fee.",
          ],
        },
        {
          heading: "Refund Process",
          paragraphs: [
            "Approved refunds are sent back to the cryptocurrency address from which the original payment was made.",
            "Refund processing time depends on the network used for the original payment. Most refunds are broadcast within 1-3 business days of approval.",
            "You will receive a notification with the refund transaction hash once it has been broadcast.",
          ],
        },
        {
          heading: "How to Request a Refund",
          paragraphs: [
            "Submit a refund request through the support page or by opening a ticket in your dashboard. Include your order number and the reason for the request.",
            "Our team reviews refund requests within 2-3 business days and will notify you of the outcome.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [
            "For questions about this refund policy, please contact our support team.",
          ],
        },
      ]}
    />
  );
}
