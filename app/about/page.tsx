import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/layout/page-hero";
import { Shield, Globe, Users, Zap, Target, Layers, ArrowRight } from "lucide-react";

const values = [
  { icon: Shield, title: "Non-Custodial", description: "You retain full control of your private keys. We never access or store your recovery phrases." },
  { icon: Globe, title: "Global Access", description: "Cards work worldwide with online and in-store acceptance at millions of merchants." },
  { icon: Users, title: "Community-Driven", description: "Built by the crypto community for the crypto community. Transparent and open." },
  { icon: Zap, title: "Instant Verification", description: "On-chain payment verification in minutes, not days. No waiting for bank approvals." },
];

const highlights = [
  { value: "120+", label: "Countries supported" },
  { value: "50K+", label: "Cards issued" },
  { value: "99.9%", label: "Success rate" },
  { value: "24/7", label: "Human support" },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface-950">
        <PageHero
          badge="About"
          title={
            <>
              Bridging crypto &amp; <span className="text-gradient-blue">everyday spending</span>
            </>
          }
          subtitle="We believe self-custody and convenience should not be a trade-off. TWallet lets you fund a card straight from your own wallet — no custody, no lock-in."
        >
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {highlights.map((h) => (
              <div key={h.label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-sm">
                <p className="text-xl font-bold text-white sm:text-2xl">{h.value}</p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-surface-500">{h.label}</p>
              </div>
            ))}
          </div>
        </PageHero>

        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-8 shadow-2xl shadow-black/30">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl" aria-hidden="true" />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-600/30">
                  <Target className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-2xl font-bold text-white">Our Mission</h2>
                <p className="mt-4 leading-relaxed text-surface-400">
                  TWallet makes it simple to spend your crypto in the real world. We believe that
                  self-custody and financial freedom should not come at the cost of convenience. Our
                  platform lets you fund a card directly from your own wallet — no accounts to fund,
                  no KYC bottlenecks, no central authority holding your assets.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Self-custody first", "No hidden fees", "On-chain verified"].map((tag) => (
                    <span key={tag} className="rounded-full border border-brand-500/25 bg-brand-500/10 px-3 py-1 text-[11px] font-medium text-brand-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-8 shadow-2xl shadow-black/30">
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-accent-500/20 blur-3xl" aria-hidden="true" />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 shadow-lg shadow-accent-600/30">
                  <Layers className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-2xl font-bold text-white">How We Are Different</h2>
                <p className="mt-4 leading-relaxed text-surface-400">
                  Unlike traditional card issuers, we never take custody of your funds. Every
                  transaction is verified independently on-chain before an order is marked paid. Our
                  smart contract integrations ensure transparency and trust without intermediaries.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Funds flow wallet-to-wallet, never through our accounts",
                    "Every payment independently verified on-chain",
                    "You sign locally in your own wallet — always",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm text-surface-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-brand-400 to-accent-400" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:bg-white/[0.05] hover:shadow-xl hover:shadow-brand-500/10"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-500/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/25 to-accent-500/20 ring-1 ring-brand-400/30 transition-transform duration-300 group-hover:scale-110">
                  <value.icon className="h-6 w-6 text-brand-300" aria-hidden="true" />
                </div>
                <h3 className="relative mt-5 text-lg font-semibold text-white">{value.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-surface-400">{value.description}</p>
              </div>
            ))}
          </div>

          <div className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-700 p-8 shadow-2xl shadow-brand-950/40 sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)" }} aria-hidden="true" />
            <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Ready to spend your crypto your way?</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">
                  Join thousands of holders paying straight from their own wallet — no custody, no lock-in, no barriers.
                </p>
              </div>
              <Link
                href="/auth/register"
                className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-brand-700 shadow-lg shadow-black/20 transition hover:bg-slate-100"
              >
                Get started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
