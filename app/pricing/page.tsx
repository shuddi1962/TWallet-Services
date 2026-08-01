import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/layout/page-hero";
import { Check, Sparkles, ShieldCheck } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for getting started with crypto cards.",
    features: ["1 virtual card", "Basic support", "Standard delivery", "Single network"],
    cta: "Get Started",
    href: "/auth/register",
    featured: false,
  },
  {
    name: "Premium",
    price: "$49",
    period: "per year",
    description: "For frequent users who want the best experience.",
    features: ["3 cards (virtual + physical)", "Priority support", "Express delivery", "Multi-network", "Lower fees"],
    cta: "Choose Premium",
    href: "/auth/register",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "tailored to you",
    description: "For businesses and high-volume users.",
    features: ["Unlimited cards", "Dedicated support", "Instant delivery", "All networks", "Custom integrations", "API access"],
    cta: "Contact Sales",
    href: "/contact",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface-950">
        <PageHero
          badge="Pricing"
          title={
            <>
              Simple pricing. <span className="text-gradient-blue">No hidden fees.</span>
            </>
          }
          subtitle="Pay once per card in crypto. No monthly surprises, no custodial accounts — just your card, funded from your wallet."
        />

        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="mt-4 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col overflow-hidden rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1 ${
                  plan.featured
                    ? "border-brand-500/60 bg-gradient-to-b from-brand-500/[0.15] to-white/[0.03] shadow-2xl shadow-brand-500/15"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                }`}
              >
                {plan.featured && (
                  <>
                    <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl" aria-hidden="true" />
                    <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg shadow-brand-600/40">
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      Most Popular
                    </span>
                  </>
                )}

                <div className="relative">
                  <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                  <p className="mt-1 text-sm text-surface-400">{plan.description}</p>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className={`text-4xl font-bold tracking-tight ${plan.featured ? "text-gradient-blue" : "text-white"}`}>
                      {plan.price}
                    </span>
                    <span className="text-xs text-surface-500">{plan.period}</span>
                  </div>

                  <ul className="mt-8 space-y-3.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-surface-300">
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${plan.featured ? "bg-gradient-to-br from-brand-500 to-brand-700" : "bg-brand-500/15 ring-1 ring-brand-400/30"}`}>
                          <Check className={`h-3 w-3 ${plan.featured ? "text-white" : "text-brand-300"}`} aria-hidden="true" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.href}
                    className={`mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold transition ${
                      plan.featured
                        ? "bg-gradient-to-r from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/30 hover:brightness-110"
                        : "border border-white/15 text-white hover:border-brand-400/40 hover:bg-brand-500/10"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-emerald-400/15 bg-emerald-500/[0.06] p-6 text-center sm:flex-row sm:text-left">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-400/30">
              <ShieldCheck className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            </div>
            <p className="text-sm leading-relaxed text-surface-300">
              <span className="font-semibold text-emerald-300">No custody. No lock-in.</span>{" "}
              Card prices are shown upfront in USDC/USDT. Network gas fees apply when sending crypto
              from your wallet — we never hold your balances.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
