"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

function FloatingCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      className="relative"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-48 w-80 sm:h-56 sm:w-96 rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-accent-600 p-0.5 shadow-2xl shadow-brand-600/30"
      >
        <div className="h-full w-full rounded-2xl bg-gradient-to-br from-surface-900 to-surface-800 p-5 sm:p-6">
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">TW</span>
                </div>
                <span className="text-sm font-semibold text-white/80">TW·CARD</span>
              </div>
              <div className="flex gap-1">
                <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
              </div>
            </div>
            <div>
              <div className="mb-3">
                <div className="h-6 w-10 rounded bg-yellow-400/70" />
              </div>
              <motion.p
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="font-mono text-base sm:text-lg tracking-[0.25em] text-white/90"
              >
                •••• •••• •••• 2026
              </motion.p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-white/60">CARDHOLDER</span>
                <span className="text-xs font-bold text-white/80">VISA</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-brand-600/20 blur-xl rounded-full" />
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden hero-gradient">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-brand-600/10 blur-[120px]"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent-600/10 blur-[120px]"
        />
      </div>

      <Container size="xl">
        <div className="flex min-h-[90vh] flex-col items-center justify-center py-20 lg:flex-row lg:py-0 lg:text-left gap-12 lg:gap-20">
          <div className="flex-1 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand-400" />
              <span className="text-brand-300">Non-custodial crypto card platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              <span className="text-white">Your crypto.</span>
              <br />
              <span className="text-gradient">Your card.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-surface-400 sm:text-xl max-w-xl"
            >
              Order a physical or virtual card funded by your crypto. Connect your wallet, pay on-chain, and spend anywhere cards are accepted.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col items-start gap-4 sm:flex-row"
            >
              <Button size="lg" className="bg-gradient-to-r from-brand-600 to-accent-600 text-white border-0 shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40 hover:from-brand-500 hover:to-accent-500" asChild>
                <Link href="/auth/register">
                  Get Your Card
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5" asChild>
                <Link href="/#how-it-works">How It Works</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-surface-500"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                Non-custodial
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-warning" />
                Instant verification
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-brand-400" />
                7 EVM networks
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 flex justify-center lg:justify-end"
          >
            <FloatingCard />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
