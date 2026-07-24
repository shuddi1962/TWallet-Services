import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const faqItems = [
  {
    q: "How do I order a card?",
    a: "Sign up for an account, verify your email, connect your wallet, choose a card design, and pay with crypto. Your card will be issued once the payment is confirmed on-chain.",
  },
  {
    q: "Which wallets are supported?",
    a: "MetaMask, Coinbase Wallet, Trust Wallet, and any WalletConnect v2 compatible wallet. We support 7 EVM chains including Ethereum, Polygon, Arbitrum, Optimism, Base, Avalanche, and BNB Smart Chain.",
  },
  {
    q: "How long does delivery take?",
    a: "Virtual cards are available immediately after payment confirmation. Physical cards ship within 5–7 business days and tracking information is provided.",
  },
  {
    q: "What cryptocurrencies can I use to pay?",
    a: "We accept USDC and USDT on all supported networks. The exact amount will be displayed at checkout based on the card price and current conversion rates.",
  },
  {
    q: "How is my payment verified?",
    a: "Our system monitors the blockchain for your transaction. It verifies the correct receiving address, exact amount, correct chain, and sufficient confirmations before marking the order as paid.",
  },
  {
    q: "Is my private key safe?",
    a: "Absolutely. We never request or store your private keys or recovery phrases. All wallet connections use standard protocols (WalletConnect v2) and you sign transactions locally.",
  },
  {
    q: "Can I cancel my order?",
    a: "Orders can be cancelled while in pending status. Once payment is confirmed on-chain, cancellations are subject to our refund policy. Contact support for assistance.",
  },
  {
    q: "What fees are involved?",
    a: "Card prices are displayed upfront in USDC/USDT. Network gas fees apply when sending crypto from your wallet. There are no hidden monthly fees for active cards.",
  },
  {
    q: "Which countries are supported?",
    a: "Cards are available in over 120 countries. Some regions may have restrictions due to local regulations. Check availability during the ordering process.",
  },
  {
    q: "How do I contact support?",
    a: "Open a support ticket through your dashboard, email us, or use the contact form. Our team typically responds within 24 hours.",
  },
];

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface-950 pt-24">
        <section className="mx-auto max-w-3xl px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-surface-50">Frequently Asked Questions</h1>
            <p className="mt-4 text-lg text-surface-400">Everything you need to know about TWallet.</p>
          </div>

          <div className="mt-12 space-y-4">
            {faqItems.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-surface-800 bg-surface-900 transition hover:border-surface-700">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-surface-200 font-medium">
                  {item.q}
                  <span className="ml-4 shrink-0 text-surface-500 transition group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="px-6 pb-4 text-surface-400 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-surface-400">Still have questions?</p>
            <Link href="/contact" className="mt-2 inline-block font-semibold text-brand-400 hover:text-brand-300">
              Contact Support
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}