"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Globe, Lock, Code2, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";

const benefits = [
  {
    icon: ShieldCheck,
    title: "No Hidden Fees",
    description: "What you see is what you pay. One-time issuance fee, transparent monthly maintenance. No surprise charges, ever.",
    gradient: "from-emerald-500 to-teal-600",
    light: "from-emerald-50 to-teal-50",
  },
  {
    icon: Globe,
    title: "Full Control",
    description: "You hold the keys. Connect any self-custodial wallet, sign your own transactions, and never give up custody of your crypto.",
    gradient: "from-brand-500 to-brand-700",
    light: "from-brand-50 to-blue-50",
  },
  {
    icon: Lock,
    title: "Advanced Security",
    description: "Row Level Security on every database table. On-chain payment verification. Zero exposure of sensitive personal data.",
    gradient: "from-violet-500 to-purple-600",
    light: "from-violet-50 to-purple-50",
  },
  {
    icon: Code2,
    title: "Built for Web3",
    description: "Native wallet connections. Multi-chain support. Smart contract verified payments. The future of spending is here.",
    gradient: "from-amber-500 to-orange-600",
    light: "from-amber-50 to-orange-50",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="py-20 lg:py-28 overflow-hidden bg-white">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs">
            <Sparkles className="h-3 w-3 text-brand-600" />
            <span className="text-brand-700 font-medium">Why choose TWallet</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl font-bold tracking-tight text-surface-900">
            Built differently. Built for you.
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="mt-3 text-surface-500 text-sm sm:text-base">
            Every feature designed around one principle: you stay in control.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-surface-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-500/10"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.light} opacity-0 transition-opacity group-hover:opacity-100`} />
              <div className="relative">
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${benefit.gradient} shadow-lg`}>
                  <benefit.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900">{benefit.title}</h3>
                <p className="mt-2.5 text-sm text-surface-500 leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
