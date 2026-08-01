"use client";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/layout/page-hero";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Rocket, CreditCard, Truck, ShieldCheck, MessageCircle, ArrowRight, LifeBuoy, Mail } from "lucide-react";

const categories = [
  {
    id: "getting-started",
    icon: Rocket,
    label: "Getting Started",
    items: [
      { q: "How do I order a card?", a: "Sign up for an account, verify your email, connect Trust Wallet, choose a card design, and pay with crypto. Your card will be issued once the payment is confirmed on-chain." },
      { q: "Why Trust Wallet?", a: "Trust Wallet offers a simple and secure way to connect and pay using cryptocurrency. It is the official recommended wallet for TWallet Services, providing a seamless experience for ordering cards and making crypto payments." },
      { q: "Why does the platform use WalletConnect?", a: "WalletConnect is the secure connection technology that allows Trust Wallet to communicate safely with TWallet Services. You only interact with Trust Wallet while WalletConnect works behind the scenes." },
    ],
  },
  {
    id: "payments",
    icon: CreditCard,
    label: "Payments & Cards",
    items: [
      { q: "What cryptocurrencies can I use to pay?", a: "We accept USDC and USDT on all supported networks. The exact amount will be displayed at checkout based on the card price and current conversion rates." },
      { q: "How is my payment verified?", a: "Our system monitors the blockchain for your transaction. It verifies the correct receiving address, exact amount, correct chain, and sufficient confirmations before marking the order as paid." },
      { q: "What fees are involved?", a: "Card prices are displayed upfront in USDC/USDT. Network gas fees apply when sending crypto from your wallet. There are no hidden monthly fees for active cards." },
      { q: "Can I cancel my order?", a: "Orders can be cancelled while in pending status. Once payment is confirmed on-chain, cancellations are subject to our refund policy. Contact support for assistance." },
    ],
  },
  {
    id: "delivery",
    icon: Truck,
    label: "Delivery & Shipping",
    items: [
      { q: "How long does delivery take?", a: "Virtual cards are available immediately after payment confirmation. Physical cards ship within 5-7 business days and tracking information is provided." },
      { q: "Which countries are supported?", a: "Cards are available in over 120 countries. Some regions may have restrictions due to local regulations. Check availability during the ordering process." },
    ],
  },
  {
    id: "security",
    icon: ShieldCheck,
    label: "Security & Custody",
    items: [
      { q: "Is my private key safe?", a: "Absolutely. We never request or store your private keys or recovery phrases. All wallet connections use WalletConnect and you sign transactions locally in Trust Wallet." },
      { q: "Do you hold my funds?", a: "No. TWallet is non-custodial — funds flow directly from your wallet to the receiving address. We verify payments on-chain but never escrow, hold, or touch your balances." },
      { q: "How do I contact support?", a: "Open a support ticket through your dashboard, email us, or use the contact form. Our team typically responds within 24 hours." },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface-950">
        <PageHero
          badge="FAQ"
          title={
            <>
              Frequently asked <span className="text-gradient-blue">questions</span>
            </>
          }
          subtitle="Everything you need to know about TWallet — cards, payments, delivery, and security."
        />

        <section className="mx-auto max-w-4xl px-4 pb-20">
          <div className="mt-4 space-y-10">
            {categories.map((category) => (
              <div key={category.id}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/25 to-accent-500/20 ring-1 ring-brand-400/30">
                    <category.icon className="h-5 w-5 text-brand-300" aria-hidden="true" />
                  </div>
                  <h2 className="text-xl font-bold text-white">{category.label}</h2>
                </div>

                <Accordion type="single" collapsible className="space-y-3">
                  {category.items.map((item) => (
                    <AccordionItem
                      key={item.q}
                      value={item.q}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors data-[state=open]:border-brand-500/40 data-[state=open]:bg-white/[0.05]"
                    >
                      <AccordionTrigger className="px-5 py-4 text-left text-[15px] font-semibold text-surface-100">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="px-5 text-[15px] leading-relaxed text-surface-400">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          <div className="relative mt-12 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/15 blur-3xl" aria-hidden="true" />
            <div className="relative grid gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-500/15 ring-1 ring-brand-400/30">
                  <LifeBuoy className="h-5 w-5 text-brand-300" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Still have questions?</h3>
                  <p className="mt-1 text-sm text-surface-400">Our team responds within 24 hours — usually much faster.</p>
                  <Link href="/contact" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 transition hover:text-brand-200">
                    Contact support
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-500/15 ring-1 ring-accent-400/30">
                  <Mail className="h-5 w-5 text-accent-300" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Prefer to browse?</h3>
                  <p className="mt-1 text-sm text-surface-400">Explore the Support Center for guides, tracking, and self-service tools.</p>
                  <Link href="/support" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-300 transition hover:text-accent-200">
                    Visit Support Center
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-surface-600">
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Chat available in your dashboard, 24/7
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
