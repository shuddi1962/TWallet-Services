"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Globe, ShieldCheck, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { OrderWidget } from "@/components/sections/order-widget";

function Stars() {
  const stars = useMemo(() =>
    Array.from({ length: 100 }, (_, i) => ({
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

function CardGlare() {
  return (
    <div
      className="absolute inset-0 rounded-2xl opacity-30"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.05) 100%)",
      }}
    />
  );
}

function CssCard() {
  return (
    <div className="relative w-full max-w-[420px] mx-auto">
      <motion.div
        animate={{ opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -inset-16 rounded-full"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.2) 0%, rgba(99,102,241,0.08) 40%, transparent 65%)",
        }}
      />
      <div className="relative rounded-[20px] p-[1.5px] shadow-2xl shadow-brand-500/20"
        style={{
          background: "linear-gradient(145deg, rgba(37,99,235,0.5), rgba(99,102,241,0.2), rgba(37,99,235,0.3), rgba(99,102,241,0.1))",
        }}
      >
        <div className="rounded-[20px] bg-gradient-to-br from-[#0c1425] via-[#0f1a2e] to-[#0a1120] p-6 overflow-hidden relative min-h-[220px]">
          <CardGlare />
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-brand-500/5 blur-xl" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-purple-500/5 blur-xl" />
          <div className="flex items-start justify-between mb-8 relative">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.15em] text-white/30 uppercase mb-1">twallet</p>
              <p className="text-[8px] tracking-[0.2em] text-white/20 uppercase">services</p>
            </div>
            <svg className="h-6 w-10" viewBox="0 0 28 18" fill="none">
              <rect x="0.5" y="0.5" width="27" height="17" rx="3" fill="#1a1f2e" stroke="#ffffff20" strokeWidth="0.5"/>
              <circle cx="14" cy="9" r="5" fill="#FF5F00" opacity="0.8"/>
              <circle cx="10" cy="9" r="5" fill="#EB001B" opacity="0.8"/>
              <circle cx="10" cy="9" r="5" fill="#EB001B" opacity="0.4" clipPath="url(#mcclip)"/>
              <defs>
                <clipPath id="mcclip"><rect x="7" y="4" width="6" height="10"/></clipPath>
              </defs>
            </svg>
          </div>
          <div className="mb-5 relative">
            <div className="h-10 w-14 rounded-lg bg-gradient-to-br from-yellow-300/90 via-yellow-400/80 to-amber-500/90 shadow-lg shadow-yellow-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            </div>
          </div>
          <div className="flex items-center justify-between mb-4 relative">
            <p className="font-mono text-xl tracking-[0.2em] text-white/85 font-medium">
              •••• •••• •••• 4582
            </p>
          </div>
          <div className="flex items-center justify-between relative">
            <div>
              <p className="text-[8px] text-white/30 uppercase tracking-[0.15em] mb-1">Card Holder</p>
              <p className="text-sm font-medium text-white/75 tracking-wider">Y. NAME</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] text-white/30 uppercase tracking-[0.15em] mb-1">Expires</p>
              <p className="text-sm font-medium text-white/75">06/28</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen bg-dark flex flex-col">
      <div className="absolute inset-0 pointer-events-none">
        <Stars />
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.12, 0.25, 0.12] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(11,17,32,0) 70%)",
            bottom: "-30%",
            right: "-5%",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.06, 0.14, 0.06] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(11,17,32,0) 70%)",
            top: "10%",
            left: "-5%",
          }}
        />
      </div>

      <div className="flex-1 flex items-center">
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 pt-24 lg:pt-32 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-1/2 flex flex-col gap-5"
            >
              <div className="inline-flex items-center gap-1.5 bg-brand-500/10 border border-brand-500/20 text-brand-400 px-3 py-1.5 rounded-full text-xs font-medium w-fit">
                <Users className="h-3 w-3" />
                Trusted by Thousands
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight text-white">
                  The TWallet Card
                  <br />
                  is here.
                </h1>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight text-brand-400">
                  Spend freely,
                  <br />
                  anywhere.
                </h2>
              </div>
              <p className="text-base sm:text-lg text-surface-400 max-w-lg leading-relaxed">
                A secure payment card for your digital assets. Accepted worldwide.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white border-0 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                  asChild
                >
                  <Link href="/auth/register">Order Your Card</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border border-surface-600 hover:border-surface-400 text-white"
                  asChild
                >
                  <Link href="/#how-it-works">Learn More</Link>
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
                {[
                  { icon: Globe, label: "Global Acceptance" },
                  { icon: ShieldCheck, label: "Secure & Private" },
                  { icon: Lock, label: "Easy to Use" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 text-surface-400">
                    <item.icon className="h-4 w-4 text-brand-400" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-1/2 flex justify-center"
            >
              <CssCard />
            </motion.div>
          </div>
        </Container>
      </div>

      <div className="relative z-10 flex justify-end -mb-24 lg:-mb-28">
        <div className="w-full lg:w-1/2 flex justify-end px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div>
            <motion.div
              animate={{ opacity: [0.15, 0.4, 0.15] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-20 bg-gradient-to-r from-brand-500/5 via-brand-400/10 to-brand-500/5 rounded-full blur-3xl pointer-events-none"
            />
            <OrderWidget />
          </div>
        </div>
      </div>
    </section>
  );
}
