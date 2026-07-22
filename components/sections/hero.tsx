"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Globe, ShieldCheck, Lock, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { useState } from "react";

function OrderWidget() {
  const [tab, setTab] = useState<"physical" | "virtual">("virtual");
  const [network, setNetwork] = useState("Ethereum");

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 sm:p-6 w-full max-w-sm mx-auto lg:mx-0"
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
    <section className="relative min-h-screen overflow-hidden bg-dark">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(28,100,242,0.15) 0%, rgba(11,17,32,0) 70%)",
            top: "10%",
            right: "5%",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(28,100,242,0.08) 0%, rgba(11,17,32,0) 70%)",
            bottom: "5%",
            left: "10%",
          }}
        />
      </div>

      <Container size="xl">
        <div className="relative min-h-screen pt-28 lg:pt-0">
          <div className="flex min-h-screen flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2 flex flex-col gap-7"
            >
              <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand px-4 py-2 rounded-full text-sm font-medium w-fit">
                <Users className="h-4 w-4" />
                Trusted by Thousands
              </div>

              <div className="flex flex-col gap-1">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white">
                  The TWallet Card
                  <br />
                  is here.
                </h1>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-brand-400">
                  Spend freely,
                  <br />
                  anywhere.
                </h2>
              </div>

              <p className="text-xl md:text-2xl text-surface-400 max-w-xl font-normal leading-relaxed">
                A secure payment card for your digital assets. Accepted worldwide.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Button
                  size="xl"
                  className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white border-0 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                  asChild
                >
                  <Link href="/auth/register">
                    Order Your Card
                  </Link>
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-surface-600 hover:border-surface-400 text-white"
                  asChild
                >
                  <Link href="/#how-it-works">
                    Learn More
                    <ArrowUpRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-6 mt-4 border-t border-white/5">
                {[
                  { icon: Globe, label: "Global Acceptance" },
                  { icon: ShieldCheck, label: "Secure & Private" },
                  { icon: Lock, label: "Easy to Use" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-surface-400">
                    <item.icon className="h-5 w-5 text-brand-400" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full lg:w-1/2 flex justify-center lg:justify-end"
            >
              <OrderWidget />
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
