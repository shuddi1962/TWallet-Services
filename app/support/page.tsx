import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/layout/page-hero";

const faqs = [
  { q: "How do I order a card?", a: "Connect Trust Wallet (or any WalletConnect-compatible wallet), choose a card type, enter your shipping address, and pay with crypto." },
  { q: "Which wallet is recommended?", a: "Trust Wallet is the official recommended wallet for TWallet Services. All connections use WalletConnect technology." },
  { q: "How long does delivery take?", a: "Physical cards ship within 5-7 business days. Virtual cards are available immediately." },
  { q: "What chains are supported for payment?", a: "Ethereum, Polygon, Arbitrum, Optimism, Base, Avalanche, and BNB Smart Chain." },
  { q: "How is payment verified?", a: "Each transaction is verified on-chain for correct address, amount, chain, and confirmations." },
  { q: "Can I cancel my order?", a: "Orders can be cancelled while in 'pending' status. Contact support for assistance." },
];

export default function SupportPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface-950">
        <PageHero
          badge="Support"
          title="Support"
          subtitle="Find answers to common questions or get in touch with our team."
        />
        <section className="mx-auto max-w-3xl px-4 pb-20">
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <Link href="/contact" className="rounded-2xl border border-surface-800 bg-surface-900 p-6 transition hover:border-brand-500/50">
              <h2 className="text-xl font-semibold text-surface-50">Contact Us</h2>
              <p className="mt-2 text-surface-400">Send us a message and we&apos;ll respond within 24 hours.</p>
            </Link>
            <Link href="/faq" className="rounded-2xl border border-surface-800 bg-surface-900 p-6 transition hover:border-brand-500/50">
              <h2 className="text-xl font-semibold text-surface-50">FAQ</h2>
              <p className="mt-2 text-surface-400">Browse frequently asked questions.</p>
            </Link>
          </div>

          <h2 className="mt-16 text-2xl font-bold text-surface-50">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="rounded-2xl border border-surface-800 bg-surface-900">
                <summary className="cursor-pointer px-6 py-4 text-surface-200 font-medium">{faq.q}</summary>
                <p className="px-6 pb-4 text-surface-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
