"use client";

import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion-section";

const plans = [
  {
    name: "Virtual Standard",
    slug: "virtual-standard",
    price: "$9.99",
    period: "one-time USDC",
    description: "Digital-first debit card for everyday online spending.",
    features: ["Instant issuance", "Virtual card details", "Online purchases", "ATM access", "Free virtual card"],
    cta: "Get Virtual Card",
    popular: false,
  },
  {
    name: "Physical Standard",
    slug: "physical-standard",
    price: "$19.99",
    period: "one-time USDC",
    description: "Metal debit card shipped worldwide. Pay with crypto.",
    features: ["Metal card", "Global shipping", "Contactless payments", "ATM withdrawals", "Custom design"],
    cta: "Get Physical Card",
    popular: true,
  },
  {
    name: "Physical Premium",
    slug: "physical-premium",
    price: "$49.99",
    period: "one-time + annual",
    description: "Premium metal with priority shipping and rewards.",
    features: ["Brushed metal finish", "Priority shipping", "3% cashback", "Concierge service", "Custom engraving"],
    cta: "Go Premium",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-gradient-to-b from-white via-surface-50 to-white py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_50%)]" />
      <Container className="relative">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm">
              <Sparkles className="h-3.5 w-3.5 text-brand-600" />
              <span className="font-medium text-brand-700">Real catalog pricing</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
              Simple crypto pricing
            </h2>
            <p className="mt-4 text-surface-500">
              One-time issuance in USDC. No custody. On-chain verification before every paid order.
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <StaggerItem key={plan.slug}>
              <div
                className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 transition duration-300 hover:-translate-y-1.5 ${
                  plan.popular
                    ? "border-brand-500/40 bg-white shadow-2xl shadow-brand-500/15 ring-1 ring-brand-500/20"
                    : "border-surface-200 bg-white shadow-sm hover:shadow-xl hover:shadow-brand-500/5"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-500 opacity-15 blur-2xl" />
                )}
                <div className="relative flex flex-1 flex-col">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-surface-900">{plan.name}</h3>
                    {plan.popular && (
                      <Badge variant="default" className="bg-brand-600">
                        Most Popular
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-surface-500">{plan.description}</p>
                  <div className="my-6">
                    <span className="text-4xl font-bold tracking-tight text-surface-900">{plan.price}</span>
                    <span className="ml-2 text-sm text-surface-500">{plan.period}</span>
                  </div>
                  <ul className="mb-8 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                          <Check className="h-3 w-3 text-emerald-600" />
                        </span>
                        <span className="text-sm text-surface-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    fullWidth
                    variant={plan.popular ? "primary" : "outline"}
                    className={
                      plan.popular
                        ? "rounded-xl border-0 bg-gradient-to-r from-brand-500 to-brand-700 shadow-lg shadow-brand-600/30"
                        : "rounded-xl border-surface-300 text-surface-700 hover:bg-surface-50"
                    }
                    asChild
                  >
                    <Link href={`/auth/register?plan=${plan.slug}`}>
                      {plan.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <p className="mt-10 text-center text-sm text-surface-500">
          Also available: Virtual Premium ($29.99) · Physical Black ($99.99) — order after signup.
        </p>
      </Container>
    </section>
  );
}
