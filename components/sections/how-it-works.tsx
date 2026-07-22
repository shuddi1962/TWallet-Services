"use client";

import { motion } from "framer-motion";
import { UserPlus, MailCheck, Wallet, CreditCard, Bitcoin, PackageSearch, PackageCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/ui/motion-section";

const steps = [
  { icon: UserPlus, title: "Create Account", description: "Sign up with your email and verify your identity in minutes." },
  { icon: MailCheck, title: "Verify Email", description: "Confirm your email address to activate your account." },
  { icon: Wallet, title: "Connect Wallet", description: "Link your self-custodial wallet — MetaMask, WalletConnect, or Coinbase." },
  { icon: CreditCard, title: "Choose Card", description: "Select physical or virtual card. Pick your network and quantity." },
  { icon: Bitcoin, title: "Pay with Crypto", description: "Send the exact amount from your wallet. You sign the transaction." },
  { icon: PackageSearch, title: "Track Order", description: "Monitor your order status in real-time from the dashboard." },
  { icon: PackageCheck, title: "Receive Card", description: "Virtual cards issued instantly. Physical cards shipped globally." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-16 lg:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-brand-950/10 to-surface-950 pointer-events-none" />
      <Container className="relative">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm">
              <span className="text-brand-300">Simple Process</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              How it works
            </h2>
            <p className="mt-4 text-lg text-surface-400">
              From signup to spending in a few simple steps.
            </p>
          </div>
        </FadeIn>

        <div className="relative mt-12">
          <div className="absolute left-[23px] top-0 h-full w-px bg-gradient-to-b from-brand-500/40 via-brand-500/20 to-transparent hidden lg:block" />

          <div className="space-y-6 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group lg:flex lg:items-start lg:gap-8"
              >
                <div className="hidden lg:flex lg:flex-col lg:items-center lg:pt-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/20 ring-1 ring-brand-400/20 transition-all group-hover:ring-brand-400/40 group-hover:shadow-brand-500/30">
                    <step.icon className="h-5 w-5 text-white" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="mt-2 h-12 w-px bg-gradient-to-b from-brand-500/30 to-transparent" />
                  )}
                </div>

                <div className="flex items-start gap-4 lg:pt-0">
                  <div className="flex lg:hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/20">
                    <step.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0 lg:pb-16">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-brand-400 tracking-wider">
                        STEP {String(index + 1).padStart(2, "0")}
                      </span>
                      {index < steps.length - 1 && (
                        <span className="hidden lg:inline text-xs text-surface-600">→</span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    <p className="mt-1 text-sm text-surface-400 max-w-md">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
