import { LegalPage } from "@/components/legal/legal-page";

export const metadata = {
  title: "Cookie Policy | TWallet",
  description: "How TWallet uses cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      subtitle="How we use cookies and similar technologies."
      updated="August 1, 2026"
      sections={[
        {
          heading: "What Are Cookies",
          paragraphs: [
            "Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and understand how you use it.",
            "We also use similar technologies such as local storage and session storage for the same purposes.",
          ],
        },
        {
          heading: "Essential Cookies",
          paragraphs: [
            "Essential cookies are required for the Service to function. They enable authentication, session management, and security features.",
            "Without these cookies, you would not be able to sign in, place orders, or access your dashboard. They are set automatically and cannot be disabled.",
          ],
        },
        {
          heading: "Preference Cookies",
          paragraphs: [
            "Preference cookies remember your settings, such as theme choice and language preferences, so you don't have to set them every visit.",
          ],
        },
        {
          heading: "Analytics Cookies",
          paragraphs: [
            "We use analytics cookies (e.g., PostHog, Vercel Analytics) to understand how visitors use the Service, which pages are most popular, and where improvements are needed.",
            "This data is aggregated and does not directly identify you as an individual.",
          ],
        },
        {
          heading: "Third-Party Cookies",
          paragraphs: [
            "Some features, such as wallet connection services (WalletConnect) and payment verification, may set cookies from third-party providers.",
            "These providers have their own privacy policies, and we recommend reviewing them.",
          ],
        },
        {
          heading: "Managing Cookies",
          paragraphs: [
            "You can control and delete cookies through your browser settings. Most browsers allow you to block all cookies, block third-party cookies only, or be notified when a cookie is set.",
            "Please note that blocking essential cookies may prevent you from using key features of the Service.",
          ],
        },
        {
          heading: "Updates to This Policy",
          paragraphs: [
            "We may update this Cookie Policy as our use of cookies and technologies evolves. Any changes will be reflected on this page.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [
            "If you have questions about our use of cookies, please contact us through the support page.",
          ],
        },
      ]}
    />
  );
}
