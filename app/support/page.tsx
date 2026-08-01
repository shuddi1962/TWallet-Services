import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/layout/page-hero";
import { MessageSquare, BookOpen, Mail, Truck, Search, ArrowRight, Headphones } from "lucide-react";
const channels = [
  { icon: MessageSquare, title: "Contact Us", description: "Send us a message and we'll respond within 24 hours.", href: "/contact", accent: "from-brand-500 to-brand-700" },
  { icon: BookOpen, title: "Browse FAQ", description: "Quick answers to the most common questions.", href: "/faq", accent: "from-accent-500 to-accent-700" },
  { icon: Truck, title: "Track Order", description: "Follow your card from production to your door.", href: "/dashboard/orders", accent: "from-indigo-500 to-indigo-700" },
  { icon: Mail, title: "Email Us", description: "support@twalletservices.com for detailed inquiries.", href: "mailto:support@twalletservices.com", accent: "from-emerald-500 to-emerald-700" },
];

const quickFaqs = [
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
          badge="Support Center"
          title={
            <>
              How can we <span className="text-gradient-blue">help you?</span>
            </>
          }
          subtitle="Find answers, track your card, or talk to a real human — whatever you need, we've got you covered."
        >
          <div className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
            <Search className="h-4 w-4 shrink-0 text-surface-500" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search for answers…"
              className="w-full bg-transparent text-sm text-white placeholder:text-surface-500 focus:outline-none"
            />
          </div>
        </PageHero>

        <section className="mx-auto max-w-5xl px-4 pb-20">
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((channel) => (
              <Link
                key={channel.title}
                href={channel.href}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-xl hover:shadow-brand-500/10"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-500/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
                <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${channel.accent} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                  <channel.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <h2 className="relative mt-5 text-lg font-semibold text-white">{channel.title}</h2>
                <p className="relative mt-1.5 text-sm leading-relaxed text-surface-400">{channel.description}</p>
                <span className="relative mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-300 transition group-hover:gap-2">
                  Get help
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-14">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Popular questions</h2>
              <Link href="/faq" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-300 transition hover:text-brand-200">
                View all FAQs
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {quickFaqs.map((faq) => (
                <div key={faq.q} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20">
                  <h3 className="text-[15px] font-semibold text-white">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-surface-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-12 overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-700 p-8 shadow-2xl shadow-brand-950/40 sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)" }} aria-hidden="true" />
            <div className="relative grid gap-8 lg:grid-cols-3 lg:items-center">
              <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-white">
                  <Headphones className="h-3 w-3" aria-hidden="true" />
                  Human support, always
                </div>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">Need a hand? Talk to our team.</h2>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/70">
                  Average response time under 24 hours. Real humans, real answers — no bots, no runaround.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-brand-700 shadow-lg shadow-black/20 transition hover:bg-slate-100"
                >
                  Contact support
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Open a ticket
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
