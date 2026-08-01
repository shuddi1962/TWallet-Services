import { LegalPage } from "@/components/legal/legal-page";

export const metadata = {
  title: "Privacy Policy | TWallet",
  description: "How TWallet collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your information."
      updated="August 1, 2026"
      sections={[
        {
          heading: "Overview",
          paragraphs: [
            "This Privacy Policy explains how TWallet Services (\"we\", \"us\", or \"our\") collects, uses, discloses, and protects your information when you use our platform.",
            "We are committed to protecting your privacy and maintaining transparency about our data practices. This policy applies to all users of the Service.",
          ],
        },
        {
          heading: "Information We Collect",
          paragraphs: [
            "Account Information: your email address, name, and authentication data when you create an account.",
            "Order Information: card orders, shipping addresses, order status, and payment-related records.",
            "Wallet Information: your public wallet address and connected network identifiers. We never collect or store private keys or seed phrases.",
            "Usage Information: analytics on how you interact with the Service, including pages visited and features used.",
            "Device Information: browser type, operating system, and general location data (IP address).",
          ],
        },
        {
          heading: "How We Use Your Information",
          paragraphs: [
            "To provide and maintain the Service, including processing orders and verifying on-chain payments.",
            "To send transactional emails such as order confirmations, payment receipts, and shipping updates.",
            "To improve our Service through analytics, security monitoring, and fraud prevention.",
            "To communicate with you about your account and respond to support requests.",
          ],
        },
        {
          heading: "Cryptocurrency and Blockchain Data",
          paragraphs: [
            "TWallet is non-custodial. We never have access to your private keys or the ability to move your funds.",
            "Blockchain transactions are public by nature. When you make a payment, the transaction details (addresses, amounts) are visible on the public ledger of the relevant network.",
            "We use this on-chain data to verify payments and confirm orders, in line with our operational requirements.",
          ],
        },
        {
          heading: "Cookies and Tracking",
          paragraphs: [
            "We use cookies and similar technologies to maintain session state, remember preferences, and collect analytics. See our Cookie Policy for details.",
            "You can control cookies through your browser settings, but disabling them may affect the functionality of the Service.",
          ],
        },
        {
          heading: "Data Sharing",
          paragraphs: [
            "We do not sell your personal information.",
            "We may share data with service providers who help us operate the platform (hosting, email delivery, analytics), under appropriate confidentiality obligations.",
            "We may disclose information where required by law, regulation, or legal process, or to protect the rights, property, and safety of TWallet, our users, or others.",
          ],
        },
        {
          heading: "Data Retention",
          paragraphs: [
            "We retain your account information for as long as your account is active and for a reasonable period afterward to comply with legal obligations.",
            "You may request deletion of your account and associated data, subject to legal retention requirements.",
          ],
        },
        {
          heading: "Your Rights",
          paragraphs: [
            "Depending on your jurisdiction, you may have the right to access, correct, delete, or restrict processing of your personal data.",
            "To exercise these rights, contact us through the support channels. We will respond within the timeframe required by applicable law.",
          ],
        },
        {
          heading: "Security",
          paragraphs: [
            "We implement appropriate technical and organizational measures to protect your information, including encryption in transit and at rest, and access controls.",
            "No method of transmission over the Internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.",
          ],
        },
        {
          heading: "Children's Privacy",
          paragraphs: [
            "The Service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.",
          ],
        },
        {
          heading: "Changes to This Policy",
          paragraphs: [
            "We may update this Privacy Policy periodically. We will notify you of material changes by posting the updated policy on this page and, where appropriate, by email.",
          ],
        },
        {
          heading: "Contact Us",
          paragraphs: [
            "If you have questions about this Privacy Policy or our data practices, please contact us through the support page.",
          ],
        },
      ]}
    />
  );
}
