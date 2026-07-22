"use client";

import { ShieldCheck, Lock, Eye, Key } from "lucide-react";
import { Container } from "@/components/layout/container";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion-section";

const securityFeatures = [
  { icon: Key, title: "Keys Stay Yours", description: "We never ask for your recovery phrase or private keys. No input field, no email, no support ticket. Ever." },
  { icon: Lock, title: "Row Level Security", description: "Every database table has RLS policies. Your data is protected at the database level, not just the application layer." },
  { icon: Eye, title: "On-Chain Verification", description: "Payments are verified independently on-chain. No manual checks, no room for error or manipulation." },
  { icon: ShieldCheck, title: "Zero Custody", description: "The platform never holds user funds. Crypto flows directly from your wallet to the receiving address." },
];

export function Security() {
  return (
    <section id="security" className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-950/20 to-surface-950 pointer-events-none" />
      <Container className="relative">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-400" />
              <span className="text-brand-300">Security First</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Security first. Always.
            </h2>
            <p className="mt-4 text-lg text-surface-400">
              Built on principles of non-custodial design and bank-grade security.
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {securityFeatures.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-surface-900/50 p-6 transition-all hover:border-brand-500/20 hover:bg-surface-900">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
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
