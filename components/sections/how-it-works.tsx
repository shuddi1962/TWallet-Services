"use client";

import { motion } from "framer-motion";
import { UserPlus, MailCheck, Wallet, CreditCard, Bitcoin, PackageSearch, PackageCheck } from "lucide-react";
import { Container } from "@/components/layout/container";

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
    <section id="how-it-works" className="relative py-20 lg:py-28 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 via-white to-brand-50/30 pointer-events-none" />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs">
            <span className="text-brand-700 font-medium">Simple Process</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl font-bold tracking-tight text-surface-900">
            How it works
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="mt-3 text-surface-500 text-sm sm:text-base">
            From signup to spending in a few simple steps.
          </motion.p>
        </div>

        <div className="relative mt-14 max-w-3xl mx-auto">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/30 via-brand-500/10 to-transparent hidden md:block" />

          <div className="space-y-8 md:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="md:flex md:items-start md:gap-6 md:pb-10"
              >
                <div className="hidden md:flex md:flex-col md:items-center md:pt-1">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/20">
                    <step.icon className="h-5 w-5 text-white" />
                  </div>
                </div>

                <div className="flex items-start gap-4 md:pt-0">
                  <div className="flex md:hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/20">
                    <step.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-brand-500 tracking-widest">
                        STEP {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900">{step.title}</h3>
                    <p className="mt-1 text-sm text-surface-500 max-w-md leading-relaxed">{step.description}</p>
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
