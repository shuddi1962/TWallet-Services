import {
  Wallet,
  ShieldCheck,
  CreditCard,
  Zap,
  Globe,
  Lock,
  TrendingUp,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Wallet,
    title: "Connect Your Wallet",
    description:
      "MetaMask, WalletConnect, Coinbase Wallet, or Trust Wallet. Connect in one click. We never see your private keys.",
  },
  {
    icon: ShieldCheck,
    title: "Non-Custodial",
    description:
      "Your crypto stays in your wallet until you send payment. The platform never holds your funds or your keys.",
  },
  {
    icon: CreditCard,
    title: "Physical & Virtual Cards",
    description:
      "Order a physical card for in-store purchases or a virtual card for online spending. Both funded by crypto.",
  },
  {
    icon: Zap,
    title: "On-Chain Verification",
    description:
      "Every payment is verified on-chain. Correct address, amount, chain, and confirmations — all automated.",
  },
  {
    icon: Globe,
    title: "Multi-Network Support",
    description:
      "Pay with Ethereum, Polygon, Arbitrum, Optimism, Base, BNB Chain, or Avalanche. More networks coming.",
  },
  {
    icon: Lock,
    title: "Bank-Grade Security",
    description:
      "Row Level Security on every table. Server-side verification. Zero exposure of sensitive data.",
  },
  {
    icon: TrendingUp,
    title: "Transparent Pricing",
    description:
      "No hidden fees. Pay a one-time card issuance fee and a small monthly maintenance fee. That's it.",
  },
  {
    icon: ShieldCheck,
    title: "Recovery Phrase Protected",
    description:
      "We never ask for your recovery phrase. No input field, no email, no support ticket. Ever.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
            Everything you need to spend crypto
          </h2>
          <p className="mt-4 text-lg text-surface-600">
            A complete platform built for self-custody. Connect, pay, and spend
            — without giving up control of your assets.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-surface-200 transition-shadow hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50">
                  <feature.icon className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-base font-semibold text-surface-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-surface-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
