"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { CreditCard, Smartphone, Globe } from "lucide-react";
import { Container } from "@/components/layout/container";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion-section";

function TiltCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className="relative cursor-pointer"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-56 w-96 max-w-full rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-accent-600 p-0.5 shadow-2xl shadow-brand-600/30"
      >
        <div className="h-full w-full rounded-2xl bg-gradient-to-br from-surface-900 to-surface-800 p-6">
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">TW</span>
                </div>
                <span className="text-sm font-semibold text-white/80">TW·CARD</span>
              </div>
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
              </div>
            </div>
            <div>
              <div className="mb-4">
                <div className="h-7 w-12 rounded-sm bg-yellow-400/70" />
              </div>
              <p className="font-mono text-lg tracking-[0.3em] text-white/90">
                •••• •••• •••• 2026
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/50">CARDHOLDER</p>
                  <p className="text-sm font-semibold text-white/80">YOUR NAME</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-8 rounded bg-gradient-to-br from-red-500 to-yellow-500/80" />
                  <div className="h-6 w-8 rounded bg-gradient-to-t from-red-600 to-yellow-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CardShowcase() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-brand-950/20 to-surface-950 pointer-events-none" />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeIn>
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm">
                <CreditCard className="h-3.5 w-3.5 text-brand-400" />
                <span className="text-brand-300">Card Showcase</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                One card. Every use case.
              </h2>
              <p className="mt-4 text-lg text-surface-400">
                Whether you&apos;re shopping online, paying in-store, or traveling abroad, your TW·CARD works everywhere.
              </p>

              <StaggerChildren className="mt-8 space-y-6">
                <StaggerItem>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 ring-1 ring-brand-500/20">
                      <CreditCard className="h-5 w-5 text-brand-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Physical Card</h3>
                      <p className="mt-1 text-sm text-surface-400">Contactless payments, ATM withdrawals, and in-store purchases. Shipped globally.</p>
                    </div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 ring-1 ring-brand-500/20">
                      <Smartphone className="h-5 w-5 text-brand-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Virtual Card</h3>
                      <p className="mt-1 text-sm text-surface-400">Instant issuance for online shopping, subscriptions, and digital purchases.</p>
                    </div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 ring-1 ring-brand-500/20">
                      <Globe className="h-5 w-5 text-brand-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Global Acceptance</h3>
                      <p className="mt-1 text-sm text-surface-400">Accepted at 100M+ merchants worldwide. Spend in 150+ currencies.</p>
                    </div>
                  </div>
                </StaggerItem>
              </StaggerChildren>
            </div>
          </FadeIn>

          <div className="flex justify-center lg:justify-end">
            <TiltCard />
          </div>
        </div>
      </Container>
    </section>
  );
}
