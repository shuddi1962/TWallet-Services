import { LegalPage } from "@/components/legal/legal-page";

export const metadata = {
  title: "Terms of Service | TWallet",
  description: "Terms of Service governing the use of TWallet card services.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      subtitle="The terms that govern your use of TWallet Services."
      updated="August 1, 2026"
      sections={[
        {
          heading: "Acceptance of Terms",
          paragraphs: [
            "By accessing or using TWallet Services (the \"Service\"), you agree to be bound by these Terms of Service (\"Terms\"). If you do not agree to these Terms, you may not use the Service.",
            "TWallet is a non-custodial, crypto-funded card platform. We provide the software, infrastructure, and operational support to help you order and manage cards funded directly from your own cryptocurrency wallet.",
          ],
        },
        {
          heading: "Eligibility",
          paragraphs: [
            "You must be at least 18 years old and capable of entering into a binding contract to use the Service. By using the Service, you represent and warrant that you meet these requirements.",
            "You are solely responsible for ensuring that your use of the Service complies with all laws and regulations applicable in your jurisdiction.",
          ],
        },
        {
          heading: "Non-Custodial Wallet Usage",
          paragraphs: [
            "TWallet never takes custody of your cryptocurrency. All wallet connections use standard protocols including WalletConnect v2, MetaMask, Coinbase Wallet, and Trust Wallet. We never request or store your private keys, seed phrases, or recovery data.",
            "You retain full control of your funds at all times. The platform verifies on-chain transactions and never signs or broadcasts transactions on your behalf.",
            "Customer funds flow directly to the configured receiving wallet address. TWallet verifies payment on-chain but does not escrow user balances.",
          ],
        },
        {
          heading: "Ordering and Payment",
          paragraphs: [
            "Card orders are placed through the dashboard. Payment is made by sending the exact amount in a supported cryptocurrency to the receiving address displayed at checkout.",
            "An order is marked as paid only after independent on-chain verification of the correct address, amount, chain, and sufficient confirmations.",
            "Card prices are displayed in USDC/USDT equivalents. Network gas fees for sending cryptocurrency are your responsibility.",
          ],
        },
        {
          heading: "Card Delivery and Issuance",
          paragraphs: [
            "Virtual cards are typically available immediately after payment confirmation. Physical cards are shipped within 5-7 business days after payment confirmation, subject to stock availability and your shipping destination.",
            "Shipping times are estimates and may vary. TWallet is not responsible for delays caused by customs, courier issues, or events outside our reasonable control.",
          ],
        },
        {
          heading: "Prohibited Activities",
          paragraphs: [
            "You agree not to use the Service for any unlawful purpose, including money laundering, fraud, terrorist financing, or any activity prohibited by applicable law.",
            "You may not attempt to manipulate the payment verification process, submit false information, or use the Service in any way that could damage, disable, or impair the Service.",
          ],
        },
        {
          heading: "Limitation of Liability",
          paragraphs: [
            "To the maximum extent permitted by law, TWallet shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service.",
            "The Service is provided \"as is\" and \"as available\" without warranties of any kind, either express or implied, including fitness for a particular purpose.",
          ],
        },
        {
          heading: "Termination",
          paragraphs: [
            "We may suspend or terminate your access to the Service for violations of these Terms, fraudulent activity, or conduct that threatens the security of the platform.",
            "Upon termination, you remain responsible for any outstanding obligations. Provisions of these Terms that by their nature should survive termination will survive.",
          ],
        },
        {
          heading: "Changes to Terms",
          paragraphs: [
            "We may update these Terms from time to time. Material changes will be communicated through the Service or by email. Continued use of the Service after changes constitutes acceptance of the revised Terms.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [
            "If you have questions about these Terms, please contact us through the support page or email.",
          ],
        },
      ]}
    />
  );
}
