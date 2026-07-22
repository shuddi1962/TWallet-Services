"use client";

import { ShieldCheck, Globe, Lock, Code2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion-section";

const benefits = [
  {
    icon: ShieldCheck,
    title: "No Hidden Fees",
    description: "What you see is what you pay. One-time issuance fee, transparent monthly maintenance. No surprise charges, ever.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Globe,
    title: "Full Control",
    description: "You hold the keys. Connect any self-custodial wallet, sign your own transactions, and never give up custody of your crypto.",
    gradient: "from-brand-500 to-brand-700",
  },
  {
    icon: Lock,
    title: "Advanced Security",
    description: "Row Level Security on every database table. On-chain payment verification. Zero exposure of sensitive personal data.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Code2,
    title: "Built for Web3",
    description: "Native wallet connections. Multi-chain support. Smart contract verified payments. The future of spending is here.",
    gradient: "from-amber-500 to-orange-600",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="py-20 lg:py-28">
      <Container>
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Why choose TWallet
            </h2>
            <p className="mt-4 text-lg text-surface-400">
              Built differently. Built for you.
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="mt-16 grid gap-6 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <StaggerItem key={benefit.title}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-surface-900/50 p-8 transition-all hover:-translate-y-0.5 hover:border-white/10 hover:shadow-xl hover:shadow-brand-500/5">
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 transition-opacity group-hover:opacity-5`} />
                <div className="relative">
                  <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${benefit.gradient} shadow-lg`}>
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{benefit.title}</h3>
                  <p className="mt-2.5 text-sm text-surface-400 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  );
}
