"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, ShieldCheck, Zap, Globe, HeadphonesIcon, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { useState } from "react";

function FloatingCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      className="relative perspective-1000"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        animate={{ y: [0, -8, 0], rotateY: [0, 3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative mx-auto h-52 w-80 sm:h-60 sm:w-96"
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 p-[1.5px] shadow-2xl shadow-brand-600/40">
          <div className="h-full w-full rounded-2xl bg-gradient-to-br from-surface-900 to-dark p-5 sm:p-6">
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600">
                    <span className="text-[10px] font-bold text-white">TW</span>
                  </div>
                  <span className="text-xs font-semibold text-white/70">TWallet Services</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg shadow-yellow-500/30" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <div className="h-7 w-11 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-inner" />
                </div>
                <p className="font-mono text-lg tracking-[0.25em] text-white/80">
                  •••• •••• •••• 4582
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Cardholder</p>
                    <p className="text-sm font-semibold text-white/70">Y. NAME</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-8" viewBox="0 0 32 20" fill="none">
                      <rect x="0.5" y="0.5" width="31" height="19" rx="2.5" fill="#1A1F71" />
                      <circle cx="12" cy="10" r="6" fill="#E70000" opacity="0.8" />
                      <circle cx="20" cy="10" r="6" fill="#F79F1A" opacity="0.8" />
                    </svg>
                    <svg className="h-4 w-6" viewBox="0 0 24 16" fill="none">
                      <rect x="0.5" y="0.5" width="23" height="15" rx="2.5" fill="#00579F" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-brand-600/20 blur-2xl rounded-full" />
    </motion.div>
  );
}

function OrderWidget() {
  const [tab, setTab] = useState<"physical" | "virtual">("virtual");
  const [network, setNetwork] = useState("Ethereum");

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="glass rounded-2xl p-5 sm:p-6 w-full max-w-sm mx-auto lg:mx-0"
    >
      <div className="flex rounded-xl bg-white/5 p-1 mb-5">
        <button
          onClick={() => setTab("virtual")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            tab === "virtual"
              ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
              : "text-surface-400 hover:text-white"
          }`}
        >
          Virtual Card
        </button>
        <button
          onClick={() => setTab("physical")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            tab === "physical"
              ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
              : "text-surface-400 hover:text-white"
          }`}
        >
          Physical Card
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-surface-400 mb-1.5 block">Network</label>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white focus:border-brand-500/50 focus:outline-none appearance-none"
          >
            <option value="Ethereum">Ethereum</option>
            <option value="BNB">BNB Chain</option>
            <option value="Polygon">Polygon</option>
            <option value="Arbitrum">Arbitrum</option>
            <option value="Base">Base</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-surface-400 mb-1.5 block">Quantity</label>
            <select className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white focus:border-brand-500/50 focus:outline-none appearance-none">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>5</option>
              <option>10</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-surface-400 mb-1.5 block">Country</label>
            <select className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white focus:border-brand-500/50 focus:outline-none appearance-none">
              <option>United States</option>
              <option>United Kingdom</option>
              <option>EU</option>
              <option>Canada</option>
              <option>Singapore</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-surface-400 mb-1.5 block">Price</label>
          <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 flex items-center justify-between">
            <span className="text-lg font-bold text-white">
              {tab === "physical" ? "$25" : "$5"}
            </span>
            <span className="text-xs text-surface-400 bg-white/5 px-2 py-1 rounded-md">USDT</span>
          </div>
        </div>

        <Button
          fullWidth
          size="lg"
          className="bg-gradient-to-r from-brand-500 to-brand-700 text-white border-0 shadow-lg shadow-brand-500/25 hover:from-brand-400 hover:to-brand-600"
          asChild
        >
          <Link href="/auth/register">
            Connect Wallet
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>

        <p className="text-center text-xs text-surface-500">
          Secure · Non-custodial · 2 min setup
        </p>
      </div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden hero-gradient">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.06),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-brand-500/10 blur-[150px]"
        />
        <motion.div
          animate={{ opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-brand-700/10 blur-[150px]"
        />
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-accent-500/5 blur-[120px]"
        />
      </div>

      <Container size="xl">
        <div className="relative min-h-screen pt-24 lg:pt-0">
          <div className="grid min-h-screen items-center gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1 lg:pr-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-500/10 px-4 py-1.5 text-sm"
              >
                <Sparkles className="h-3.5 w-3.5 text-brand-400" />
                <span className="text-brand-300">Non-custodial crypto card platform</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl leading-tight"
              >
                <span className="text-white">Your Card.</span>
                <br />
                <span className="text-white">Your Crypto.</span>
                <br />
                <span className="text-gradient-blue">Your Freedom.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 text-base text-surface-400 sm:text-lg max-w-md leading-relaxed"
              >
                Order premium physical and virtual crypto cards using secure blockchain payments.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-brand-500 to-brand-700 text-white border-0 shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:from-brand-400 hover:to-brand-600"
                  asChild
                >
                  <Link href="/auth/register">
                    Order Your Card
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/15 text-white hover:bg-white/5"
                  asChild
                >
                  <Link href="/#how-it-works">
                    <Play className="h-4 w-4" />
                    How It Works
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                {[
                  { icon: ShieldCheck, label: "100%", desc: "Secure" },
                  { icon: Zap, label: "Instant", desc: "Payments" },
                  { icon: Globe, label: "Global", desc: "Accepted" },
                  { icon: HeadphonesIcon, label: "24/7", desc: "Support" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10">
                      <item.icon className="h-4 w-4 text-brand-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="text-xs text-surface-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="flex items-center justify-center lg:col-span-1">
              <FloatingCard />
            </div>

            <div className="flex items-start justify-center lg:col-span-1 lg:justify-end">
              <OrderWidget />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="h-6 w-6 text-surface-500 animate-bounce" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
