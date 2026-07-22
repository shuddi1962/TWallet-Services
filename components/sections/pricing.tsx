"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion-section";

const plans = [
  { name: "Virtual Card", price: "$5", period: "one-time", description: "Perfect for online shopping and subscriptions", features: ["Instant issuance", "Online purchases", "Subscription payments", "No monthly fee", "1% top-up fee"], cta: "Get Virtual Card", popular: false },
  { name: "Physical Card", price: "$25", period: "one-time + $3/mo", description: "For in-store purchases and ATM withdrawals", features: ["Global shipping", "Contactless payments", "ATM withdrawals", "In-store purchases", "$3/month maintenance", "1% top-up fee"], cta: "Get Physical Card", popular: true },
  { name: "Premium", price: "$50", period: "one-time + $8/mo", description: "Both cards with premium benefits", features: ["Virtual + Physical cards", "Priority verification", "Higher spending limits", "Dedicated support", "Zero top-up fees", "$8/month maintenance"], cta: "Go Premium", popular: false },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-brand-950/10 to-surface-950 pointer-events-none" />
      <Container className="relative">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm">
              <span className="text-brand-300">Pricing</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-surface-400">
              Pay a one-time issuance fee. No hidden charges. No surprises.
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <StaggerItem key={plan.name}>
              <div
                className={`group relative overflow-hidden rounded-xl border p-6 transition-all ${
                  plan.popular
                    ? "border-brand-500/50 bg-brand-600/5 shadow-lg shadow-brand-600/10"
                    : "border-white/5 bg-surface-900/50 hover:border-white/10 hover:bg-surface-900"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-gradient-to-br from-brand-500 to-accent-600 blur-2xl opacity-30" />
                )}
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                    {plan.popular && <Badge variant="default" className="bg-brand-600">Most Popular</Badge>}
                  </div>
                  <p className="text-sm text-surface-400">{plan.description}</p>
                  <div className="my-6">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="ml-2 text-sm text-surface-500">{plan.period}</span>
                  </div>
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span className="text-sm text-surface-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    fullWidth
                    variant={plan.popular ? "primary" : "outline"}
                    className={plan.popular ? "bg-gradient-to-r from-brand-600 to-accent-600 border-0" : "border-white/10 text-white hover:bg-white/5"}
                    asChild
                  >
                    <Link href="/auth/register">
                      {plan.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  );
}
