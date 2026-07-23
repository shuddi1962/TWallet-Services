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
    <section id="pricing" className="relative py-16 lg:py-20 overflow-hidden bg-white">
      <Container className="relative">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm">
              <span className="text-brand-700 font-medium">Pricing</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-surface-900">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-surface-500">
              Pay a one-time issuance fee. No hidden charges. No surprises.
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="mt-12 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <StaggerItem key={plan.name}>
              <div
                className={`group relative overflow-hidden rounded-2xl border p-6 transition-all hover:-translate-y-1 ${
                  plan.popular
                    ? "border-brand-500/30 bg-white shadow-xl shadow-brand-500/10 ring-1 ring-brand-500/20"
                    : "border-surface-200 bg-white hover:shadow-xl hover:shadow-brand-500/5"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-gradient-to-br from-brand-500 to-accent-600 blur-2xl opacity-20" />
                )}
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-surface-900">{plan.name}</h3>
                    {plan.popular && <Badge variant="default" className="bg-brand-600">Most Popular</Badge>}
                  </div>
                  <p className="text-sm text-surface-500">{plan.description}</p>
                  <div className="my-5">
                    <span className="text-3xl font-bold text-surface-900">{plan.price}</span>
                    <span className="ml-2 text-sm text-surface-500">{plan.period}</span>
                  </div>
                  <ul className="mb-6 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span className="text-sm text-surface-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    fullWidth
                    variant={plan.popular ? "primary" : "outline"}
                    className={plan.popular ? "bg-gradient-to-r from-brand-600 to-accent-600 border-0 shadow-lg shadow-brand-600/20" : "border-surface-300 text-surface-700 hover:bg-surface-50"}
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
