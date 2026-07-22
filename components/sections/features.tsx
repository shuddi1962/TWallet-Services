"use client";

import { ShieldCheck, CreditCard, Zap, Globe, Truck, HeadphonesIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion-section";

const features = [
  { icon: ShieldCheck, title: "Secure & Private", description: "Your keys never leave your wallet. We use bank-grade encryption and never ask for your recovery phrase." },
  { icon: CreditCard, title: "Crypto Payments", description: "Pay with ETH, USDC, USDT, and more across 7+ EVM networks. On-chain verification ensures accuracy." },
  { icon: Globe, title: "Global Acceptance", description: "Use your card anywhere major card networks are accepted. 100M+ merchants across 150+ countries." },
  { icon: Zap, title: "Premium Cards", description: "Choose from physical or virtual cards with titanium finish, contactless payments, and ATM access." },
  { icon: Truck, title: "Fast Delivery", description: "Virtual cards issued instantly. Physical cards shipped globally within 3-5 business days." },
  { icon: HeadphonesIcon, title: "24/7 Support", description: "Our team is available around the clock via chat, email, and dedicated support channels." },
];

export function Features() {
  return (
    <section id="features" className="relative py-20 lg:py-28 bg-surface-50">
      <Container>
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm">
              <span className="text-brand-700 font-medium">Why TWallet Services</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
              Built for security. Designed for the future.
            </h2>
            <p className="mt-4 text-lg text-surface-500">
              A complete platform built for self-custody. Connect, pay, and spend — without giving up control.
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="group relative overflow-hidden rounded-2xl border border-surface-200 bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10 hover:border-brand-200">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg shadow-brand-500/20">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-surface-900">{feature.title}</h3>
                  <p className="mt-2.5 text-sm text-surface-500 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  );
}
