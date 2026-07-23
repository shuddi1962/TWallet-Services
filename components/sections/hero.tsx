"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Lock, Zap, Globe, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { OrderWidget } from "@/components/sections/order-widget";

const CARD_IMAGE =
  "https://media.base44.com/images/public/user_69ea8b2a8a88a7b0630fcdfe/5a1caf06f_030441c1e_ChatGPTImageJul22202605_01_45PM1.png";

const features = [
  { icon: Lock, title: "100% Secure & Encrypted" },
  { icon: Zap, title: "Instant Crypto Payments" },
  { icon: Globe, title: "Global Accepted Worldwide" },
  { icon: Headphones, title: "24/7 Customer Support" },
];

function Stars() {
  const stars = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2.5 + 0.5,
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
          animate={{ opacity: [0, 0.8, 0.2, 1, 0] }}
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

export function Hero() {
  return (
    <section className="relative min-h-screen bg-[#05070a] flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <Stars />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px]" style={{ background: "rgba(0,102,255,0.08)" }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: "rgba(0,102,255,0.05)" }} />
      </div>

      <div className="flex-1 flex items-center">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center pt-24 lg:pt-32 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-4 flex flex-col gap-7"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/25 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" />
                <span className="text-[#3b82f6] text-xs font-semibold tracking-wide">Trusted by Thousands</span>
              </div>

              <h1 className="text-[2.6rem] leading-[1.08] lg:text-5xl xl:text-[3.4rem] xl:leading-[1.05] font-bold tracking-tight text-white">
                Your Card.<br />
                Your Crypto.<br />
                Your <span className="text-[#0066FF]">Freedom.</span>
              </h1>

              <p className="text-white/55 text-base lg:text-[15px] leading-relaxed max-w-md">
                Order a premium card, pay with crypto and spend worldwide.
              </p>

              <div className="flex items-center gap-3 mt-1">
                <Button
                  className="px-6 h-12 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white font-semibold text-sm shadow-lg shadow-[#0066FF]/25 border-0"
                  asChild
                >
                  <Link href="/auth/register">Order Your Card</Link>
                </Button>
                <Button
                  className="flex items-center gap-2 px-5 h-12 rounded-xl border border-white/15 hover:border-white/30 text-white font-medium text-sm"
                  variant="outline"
                  asChild
                >
                  <Link href="/#how-it-works">
                    <Play className="w-3.5 h-3.5 fill-white" />
                    How It Works
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-5 mt-6 pt-6 border-t border-white/5">
                {features.map(({ icon: Icon, title }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#0066FF]" strokeWidth={2} />
                    </div>
                    <span className="text-white/70 text-xs font-medium leading-snug pt-1.5">{title}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-4 order-last lg:order-none"
            >
              <div className="relative flex items-center justify-center min-h-[420px]">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[420px] h-[420px] rounded-full blur-[100px]" style={{ background: "rgba(0,102,255,0.15)" }} />
                </div>
                <div className="absolute w-[460px] h-[460px] rounded-full border border-[#0066FF]/10" />
                <div
                  className="relative z-10 w-full max-w-[440px]"
                  style={{
                    maskImage: "radial-gradient(ellipse 65% 65% at center, black 55%, transparent 90%)",
                    WebkitMaskImage: "radial-gradient(ellipse 65% 65% at center, black 55%, transparent 90%)",
                  }}
                >
                  <img
                    src={CARD_IMAGE}
                    alt="Premium black debit card on illuminated pedestal"
                    className="w-full h-auto"
                    style={{ filter: "drop-shadow(0 0 40px rgba(0,102,255,0.15))" }}
                  />
                </div>
              </div>
            </motion.div>

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
      </div>
    </section>
  );
}
