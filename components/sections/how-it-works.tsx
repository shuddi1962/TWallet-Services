"use client";

import { motion } from "framer-motion";
import { Wallet, Send, CreditCard, ShoppingBag } from "lucide-react";
import { Container } from "@/components/layout/container";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion-section";

const steps = [
  { number: "01", icon: Wallet, title: "Connect Your Wallet", description: "Connect MetaMask, WalletConnect, Coinbase Wallet, or Trust Wallet. Your private keys never leave your device." },
  { number: "02", icon: Send, title: "Pay in Crypto", description: "Send the exact amount to the platform's receiving wallet address on your preferred network. You sign the transaction." },
  { number: "03", icon: CreditCard, title: "Get Verified", description: "Our system verifies your payment on-chain — correct address, amount, chain, and confirmations. No manual checks." },
  { number: "04", icon: ShoppingBag, title: "Start Spending", description: "Once verified, your card is activated. Use it online or in-store, anywhere major card networks are accepted." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-brand-950/10 to-surface-950 pointer-events-none" />
      <Container className="relative">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm">
              <span className="text-brand-300">Simple Process</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-surface-400">
              From wallet connection to card activation in four simple steps.
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <StaggerItem key={step.number}>
              <div className="group relative">
                {index < steps.length - 1 && (
                  <div className="absolute left-full top-12 hidden h-px w-full bg-gradient-to-r from-brand-500/40 to-transparent lg:block" />
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-500/10 ring-1 ring-brand-500/20 group-hover:ring-brand-500/40 transition-all">
                      <step.icon className="h-8 w-8 text-brand-400" />
                    </div>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                      className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-600 text-xs font-bold text-white shadow-lg shadow-brand-600/30"
                    >
                      {step.number}
                    </motion.span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-surface-400">{step.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  );
}
