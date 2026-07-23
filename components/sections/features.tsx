"use client";

import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Zap, Globe, Truck, HeadphonesIcon } from "lucide-react";
import { Container } from "@/components/layout/container";

const features = [
  { icon: ShieldCheck, title: "Secure & Private", description: "Your keys never leave your wallet. Bank-grade encryption. We never ask for your recovery phrase." },
  { icon: CreditCard, title: "Crypto Payments", description: "Pay with ETH, USDC, USDT across 7+ EVM networks. On-chain verification for every transaction." },
  { icon: Globe, title: "Global Acceptance", description: "Use your card anywhere major card networks are accepted. 100M+ merchants across 150+ countries." },
  { icon: Zap, title: "Premium Cards", description: "Physical or virtual cards with titanium finish, contactless payments, and ATM access worldwide." },
  { icon: Truck, title: "Fast Delivery", description: "Virtual cards issued instantly. Physical cards shipped globally within 3-5 business days." },
  { icon: HeadphonesIcon, title: "24/7 Support", description: "Our team is available around the clock via chat, email, and dedicated support channels." },
];

export function Features() {
  return (
    <section id="features" className="relative py-20 lg:py-28 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-50/80 to-white pointer-events-none" />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs">
            <span className="text-brand-700 font-medium">Why TWallet Services</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl font-bold tracking-tight text-surface-900">
            Built for security. Designed for the future.
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="mt-3 text-surface-500 text-sm sm:text-base">
            A complete platform built for self-custody. Connect, pay, and spend — without giving up control.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-surface-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10 hover:border-brand-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg shadow-brand-500/20">
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900">{feature.title}</h3>
                <p className="mt-2.5 text-sm text-surface-500 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
