import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/layout/page-hero";
import { Shield, Globe, Users, Zap } from "lucide-react";

const values = [
  { icon: Shield, title: "Non-Custodial", description: "You retain full control of your private keys. We never access or store your recovery phrases." },
  { icon: Globe, title: "Global Access", description: "Cards work worldwide with online and in-store acceptance at millions of merchants." },
  { icon: Users, title: "Community-Driven", description: "Built by the crypto community for the crypto community. Transparent and open." },
  { icon: Zap, title: "Instant Verification", description: "On-chain payment verification in minutes, not days. No waiting for bank approvals." },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface-950">
        <PageHero
          badge="About"
          title="About TWallet"
          subtitle="Bridging crypto and everyday spending."
        />
        <section className="mx-auto max-w-4xl px-4 pb-20">
          <div className="mt-16 space-y-8">
            <div className="rounded-2xl border border-surface-800 bg-surface-900/50 p-8">
              <h2 className="text-2xl font-bold text-surface-50">Our Mission</h2>
              <p className="mt-4 text-surface-400 leading-relaxed">
                TWallet makes it simple to spend your crypto in the real world. We believe that self-custody 
                and financial freedom should not come at the cost of convenience. Our platform lets you 
                fund a card directly from your own wallet — no accounts to fund, no KYC bottlenecks, 
                no central authority holding your assets.
              </p>
            </div>

            <div className="rounded-2xl border border-surface-800 bg-surface-900/50 p-8">
              <h2 className="text-2xl font-bold text-surface-50">How We Are Different</h2>
              <p className="mt-4 text-surface-400 leading-relaxed">
                Unlike traditional card issuers, we never take custody of your funds. Every transaction 
                is verified independently on-chain before an order is marked paid. Our smart contract 
                integrations ensure transparency and trust without intermediaries.
              </p>
            </div>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="rounded-2xl border border-surface-800 bg-surface-900/50 p-6 transition hover:border-brand-500/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10">
                  <value.icon className="h-6 w-6 text-brand-400" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-surface-50">{value.title}</h3>
                <p className="mt-2 text-sm text-surface-400">{value.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}