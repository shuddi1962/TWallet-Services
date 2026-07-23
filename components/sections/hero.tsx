"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Play, Zap, Globe, Headphones, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { OrderWidget } from "@/components/sections/order-widget";

const CARD_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB4kIr2XwzwDH8GGE6TbF23yoAi0hgE531M8geP32Cjq1mXYPGqLgX5RomAPAvL8_a31uz8iWMQ2z8bQVqlCgpbFDegzDuB4uw-g3stjGIrqdtoMF9CoWU6flYr36umlpNYm_tJRxYT4mHEFM9HDsv2HdwoHwHoBhy3NMXS0tJOZYYIpIEzOCWpa62ZB_RYk63ExlxwSjO61Ve_DI09AExScnco3FJwHpl6yClmGjB2yLuid6y4Q-vTWqABr5GJaUJjzyk";

const stats = [
  { icon: Shield, label: "100% Secure" },
  { icon: Zap, label: "Instant Payments" },
  { icon: Globe, label: "Global Accepted" },
  { icon: Headphones, label: "24/7 Support" },
];

function Stars() {
  const stars = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 6,
      duration: Math.random() * 3 + 2,
    })),
  []);

  return (
    <>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [0, 0.8, 0, 0.6, 0] }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)" }}
      />
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.06, 0.15, 0.06] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-32 left-1/4 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)" }}
      />
    </div>
  );
}

function CardReveal() {
  return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative flex items-center justify-center animate-float"
      >
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          className="w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 60%)" }}
        />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 5, 0, -5, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[440px] h-[440px] rounded-full border border-[#2563eb]/10"
      />
      <div
        className="relative z-10 w-full max-w-[380px]"
        style={{
          maskImage: "radial-gradient(ellipse 65% 65% at center, black 55%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse 65% 65% at center, black 55%, transparent 90%)",
        }}
      >
        <Image
          src={CARD_IMAGE}
          alt="Premium black debit card"
          width={380}
          height={266}
          className="w-full h-auto"
          priority
          unoptimized
          style={{ filter: "drop-shadow(0 0 50px rgba(37,99,235,0.2))" }}
        />
      </div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative bg-[#05070a] overflow-hidden pt-16 pb-10 lg:pt-24 lg:pb-14">
      <Stars />
      <FloatingOrbs />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
          {/* Left column - Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col gap-3"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#2563eb]/10 to-[#3b82f6]/5 border border-[#2563eb]/20 w-fit"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-pulse" />
              <span className="text-[#3b82f6] text-[11px] font-semibold tracking-wide">Trusted by Thousands</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-[2rem] leading-[1.08] sm:text-4xl lg:text-[2.8rem] xl:text-[3.2rem] xl:leading-[1.05] font-bold tracking-tight text-white"
            >
              Your Card.<br />
              Your Crypto.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#3b82f6]">Your Freedom.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/55 text-sm sm:text-base leading-relaxed max-w-md"
            >
              Order a premium card, pay with crypto and spend worldwide. Non-custodial, secure, and built for Web3.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-col sm:flex-row items-center gap-3"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-[#2563eb]/40 blur-xl animate-glow-pulse" />
                <Button
                  className="relative px-5 h-10 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-semibold text-sm shadow-lg shadow-[#2563eb]/30 border-0 transition-all overflow-hidden"
                  asChild
                >
                  <Link href="/auth/register">
                    <span className="relative z-10">Order Your Card</span>
                    <span className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </Link>
                </Button>
              </div>
              <Button
                className="flex items-center gap-2 px-4 h-10 rounded-xl border border-white/15 hover:border-white/30 hover:bg-white/5 text-white font-medium text-sm transition-all"
                variant="outline"
                asChild
              >
                <Link href="/#how-it-works">
                  <Play className="w-3.5 h-3.5 fill-white" />
                  How It Works
                </Link>
              </Button>
            </motion.div>

            {/* Trust stats - single horizontal row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 mt-3 border-t border-white/[0.06]"
            >
              {stats.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 + i * 0.05 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-7 h-7 shrink-0 rounded-lg bg-[#2563eb]/10 border border-[#2563eb]/15 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-[#2563eb]" strokeWidth={2} aria-hidden="true" />
                  </div>
                  <span className="text-white/65 text-[11px] font-medium whitespace-nowrap">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Center column - Card image (hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-3 hidden lg:block"
          >
            <CardReveal />
          </motion.div>

          {/* Right column - Order widget */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-4"
          >
            <OrderWidget />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
