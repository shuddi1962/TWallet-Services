"use client";

import { motion } from "framer-motion";
import { Wallet, ShieldCheck, CreditCard, Zap, Globe, Lock, TrendingUp, Key } from "lucide-react";
import { Container } from "@/components/layout/container";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion-section";

const features = [
  { icon: Wallet, title: "Connect Your Wallet", description: "MetaMask, WalletConnect, Coinbase, or Trust Wallet. Connect in one click. We never see your private keys." },
  { icon: ShieldCheck, title: "Non-Custodial", description: "Your crypto stays in your wallet until you send payment. The platform never holds your funds or your keys." },
  { icon: CreditCard, title: "Physical & Virtual Cards", description: "Order a physical card for in-store purchases or a virtual card for online spending. Both funded by crypto." },
  { icon: Zap, title: "On-Chain Verification", description: "Every payment is verified on-chain. Correct address, amount, chain, and confirmations — all automated." },
  { icon: Globe, title: "Multi-Network Support", description: "Pay with Ethereum, Polygon, Arbitrum, Optimism, Base, BNB Chain, or Avalanche. More networks coming." },
  { icon: Lock, title: "Bank-Grade Security", description: "Row Level Security on every table. Server-side verification. Zero exposure of sensitive data." },
  { icon: TrendingUp, title: "Transparent Pricing", description: "No hidden fees. Pay a one-time card issuance fee and a small monthly fee. That's it." },
  { icon: Key, title: "Recovery Phrase Protected", description: "We never ask for your recovery phrase. No input field, no email, no support ticket. Ever." },
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-28">
      <Container>
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need to spend crypto
            </h2>
            <p className="mt-4 text-lg text-surface-400">
              A complete platform built for self-custody. Connect, pay, and spend — without giving up control.
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-surface-900/50 p-6 transition-all hover:border-brand-500/20 hover:bg-surface-900 hover:shadow-lg hover:shadow-brand-600/5">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 to-accent-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 ring-1 ring-brand-500/20">
                    <feature.icon className="h-5 w-5 text-brand-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm text-surface-400">{feature.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  );
}
