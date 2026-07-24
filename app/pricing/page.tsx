import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for getting started with crypto cards.",
    features: ["1 virtual card", "Basic support", "Standard delivery", "Single network"],
    cta: "Get Started",
    href: "/auth/register",
    featured: false,
  },
  {
    name: "Premium",
    price: "$49/yr",
    description: "For frequent users who want the best experience.",
    features: ["3 cards (virtual + physical)", "Priority support", "Express delivery", "Multi-network", "Lower fees"],
    cta: "Choose Premium",
    href: "/auth/register",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
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
      <main className="min-h-screen bg-surface-950 pt-24">
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-surface-50">Simple Pricing</h1>
            <p className="mt-4 text-lg text-surface-400">Choose the plan that fits your needs. No hidden fees.</p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 transition ${
                  plan.featured
                    ? "border-brand-500 bg-surface-900 shadow-lg shadow-brand-500/10"
                    : "border-surface-800 bg-surface-900/50 hover:border-surface-700"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h2 className="text-xl font-bold text-surface-50">{plan.name}</h2>
                <p className="mt-1 text-sm text-surface-400">{plan.description}</p>
                <p className="mt-6">
                  <span className="text-4xl font-bold text-surface-50">{plan.price}</span>
                </p>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-surface-300">
                      <Check className="h-4 w-4 text-brand-500" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`mt-8 block w-full rounded-xl px-4 py-3 text-center font-semibold transition ${
                    plan.featured
                      ? "bg-brand-600 text-white hover:bg-brand-700"
                      : "border border-surface-700 text-surface-200 hover:border-surface-600"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}