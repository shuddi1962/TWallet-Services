import { LegalPage } from "@/components/legal/legal-page";

export const metadata = {
  title: "Disclaimer | TWallet",
  description: "Legal disclaimer for TWallet card services.",
};

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      subtitle="Important legal notices about TWallet Services."
      updated="August 1, 2026"
      sections={[
        {
          heading: "No Financial Advice",
          paragraphs: [
            "TWallet Services does not provide financial, investment, legal, or tax advice. Content on this platform, including documentation, blog posts, and marketing materials, is for informational purposes only.",
            "You are solely responsible for your financial decisions, including the use of cryptocurrency and any associated risks.",
          ],
        },
        {
          heading: "Non-Custodial Nature",
          paragraphs: [
            "TWallet is a non-custodial platform. We never hold, escrow, or control customer funds. All cryptocurrency remains under your exclusive control until you choose to send it to the receiving address displayed at checkout.",
            "We cannot reverse, recover, or intercept blockchain transactions. You must verify all addresses and amounts carefully before sending any payment.",
          ],
        },
        {
          heading: "Cryptocurrency Risk",
          paragraphs: [
            "Cryptocurrency markets are volatile. The value of your assets can fluctuate significantly. There is inherent risk in holding and transacting in cryptocurrency.",
            "We are not liable for losses arising from market volatility, network congestion, failed transactions, or your use of third-party wallets and services.",
          ],
        },
        {
          heading: "Third-Party Services",
          paragraphs: [
            "The Service integrates with third-party tools including wallet providers, payment networks, and analytics services. We are not responsible for the operation, availability, or security of third-party services.",
            "Your use of third-party services is governed by their respective terms and policies.",
          ],
        },
        {
          heading: "No Warranty",
          paragraphs: [
            "The Service is provided on an \"as is\" and \"as available\" basis without warranties of any kind, whether express or implied.",
            "We do not warrant that the Service will be uninterrupted, error-free, or free of harmful components.",
          ],
        },
        {
          heading: "Limitation of Liability",
          paragraphs: [
            "To the fullest extent permitted by law, TWallet and its affiliates shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of the Service, including loss of profits, data, or cryptocurrency.",
          ],
        },
        {
          heading: "Regulatory Compliance",
          paragraphs: [
            "The availability of card products and services may vary by jurisdiction due to local regulations. It is your responsibility to ensure compliance with the laws of your jurisdiction.",
            "TWallet may restrict or discontinue services in certain jurisdictions at any time.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [
            "If you have questions about this disclaimer, please contact our support team.",
          ],
        },
      ]}
    />
  );
}
