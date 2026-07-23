"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-20 lg:py-28 bg-surface-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl px-6 py-14 text-center lg:px-12 lg:py-20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800" />
          <div className="absolute inset-0">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-float-slow" />
            <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-brand-400/20 blur-3xl animate-float" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-60 w-60 rounded-full bg-brand-300/10 blur-3xl animate-glow-pulse" />
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20"
            >
              <Shield className="h-7 w-7 text-white" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white"
            >
              Ready to Get Your Crypto Card?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-white/70"
            >
              Join thousands who&apos;ve already ordered. Connect your wallet, pay with crypto, and start spending globally.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-white/30 blur-xl animate-glow-pulse" />
                <Button
                  size="xl"
                  className="relative bg-white text-brand-700 hover:bg-white/90 shadow-2xl shadow-white/20 hover:shadow-white/30 px-8 h-12 rounded-xl font-semibold overflow-hidden"
                  asChild
                >
                  <Link href="/auth/register">
                    <span className="relative z-10 flex items-center gap-2">
                      Order Now
                      <ArrowRight className="h-5 w-5" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                  </Link>
                </Button>
              </div>
              <Button
                size="xl"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 px-8 h-12 rounded-xl font-medium"
                asChild
              >
                <Link href="/#features">Learn More</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
