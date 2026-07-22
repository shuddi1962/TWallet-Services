import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Virtual Card",
    price: "$5",
    period: "one-time",
    description: "Perfect for online shopping and subscriptions",
    features: [
      "Instant issuance",
      "Online purchases",
      "Subscription payments",
      "No monthly fee",
      "1% top-up fee",
    ],
    cta: "Get Virtual Card",
    popular: false,
  },
  {
    name: "Physical Card",
    price: "$25",
    period: "one-time + $3/mo",
    description: "For in-store purchases and ATM withdrawals",
    features: [
      "Global shipping",
      "Contactless payments",
      "ATM withdrawals",
      "In-store purchases",
      "$3/month maintenance",
      "1% top-up fee",
    ],
    cta: "Get Physical Card",
    popular: true,
  },
  {
    name: "Premium",
    price: "$50",
    period: "one-time + $8/mo",
    description: "Both cards with premium benefits",
    features: [
      "Virtual + Physical cards",
      "Priority verification",
      "Higher spending limits",
      "Dedicated support",
      "Zero top-up fees",
      "$8/month maintenance",
    ],
    cta: "Go Premium",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-surface-50 py-20 lg:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-surface-600">
            Pay a one-time issuance fee. No hidden charges. No surprises.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.popular
                  ? "border-brand-600 shadow-lg ring-2 ring-brand-600"
                  : ""
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.popular && (
                    <Badge variant="default">Most Popular</Badge>
                  )}
                </div>
                <p className="text-sm text-surface-500">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-surface-900">
                    {plan.price}
                  </span>
                  <span className="ml-2 text-sm text-surface-500">
                    {plan.period}
                  </span>
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                      <span className="text-sm text-surface-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  fullWidth
                  variant={plan.popular ? "primary" : "outline"}
                  asChild
                >
                  <Link href="/auth/register">
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
