"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Globe, ShieldCheck, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { useState } from "react";

const CARD_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB4kIr2XwzwDH8GGE6TbF23yoAi0hgE531M8geP32Cjq1mXYPGqLgX5RomAPAvL8_a31uz8iWMQ2z8bQVqlCgpbFDegzDuB4uw-g3stjGIrqdtoMF9CoWU6flYr36umlpNYm_tJRxYT4mHEFM9HDsv2HdwoHwHoBhy3NMXS0tJOZYYIpIEzOCWpa62ZB_RYk63ExlxwSjO61Ve_DI09AExScnco3FJwHpl6yClmGjB2yLuid6y4Q-vTWqABr5GJaUJjzyk";

function OrderWidget() {
  const [tab, setTab] = useState<"physical" | "virtual">("virtual");
  const [network, setNetwork] = useState("Ethereum");

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 w-full max-w-sm">
      <div className="flex rounded-lg bg-white/5 p-0.5 mb-4">
        <button
          onClick={() => setTab("virtual")}
          className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            tab === "virtual"
              ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
              : "text-surface-400 hover:text-white"
          }`}
        >
          Virtual Card
        </button>
        <button
          onClick={() => setTab("physical")}
          className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            tab === "physical"
              ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
              : "text-surface-400 hover:text-white"
          }`}
        >
          Physical Card
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-medium text-surface-400 mb-1 block">Network</label>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:border-brand-500/50 focus:outline-none appearance-none"
          >
            <option value="Ethereum">Ethereum</option>
            <option value="BNB">BNB Chain</option>
            <option value="Polygon">Polygon</option>
            <option value="Arbitrum">Arbitrum</option>
            <option value="Base">Base</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-medium text-surface-400 mb-1 block">Quantity</label>
            <select className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:border-brand-500/50 focus:outline-none appearance-none">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>5</option>
              <option>10</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-medium text-surface-400 mb-1 block">Country</label>
            <select className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:border-brand-500/50 focus:outline-none appearance-none">
              <option>United States</option>
              <option>United Kingdom</option>
              <option>EU</option>
              <option>Canada</option>
              <option>Singapore</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-medium text-surface-400 mb-1 block">Price</label>
          <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 flex items-center justify-between">
            <span className="text-base font-bold text-white">
              {tab === "physical" ? "$25" : "$5"}
            </span>
            <span className="text-[10px] text-surface-400 bg-white/5 px-1.5 py-0.5 rounded">USDT</span>
          </div>
        </div>

        <Button
          fullWidth
          size="sm"
          className="bg-gradient-to-r from-brand-500 to-brand-700 text-white border-0 shadow-lg shadow-brand-500/25"
          asChild
        >
          <Link href="/auth/register">
            Connect Wallet
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>

        <p className="text-center text-[10px] text-surface-500">
          Secure · Non-custodial · 2 min setup
        </p>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-dark">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(28,100,242,0.12) 0%, rgba(11,17,32,0) 70%)",
            top: "5%",
            right: "0%",
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(28,100,242,0.06) 0%, rgba(11,17,32,0) 70%)",
            bottom: "0%",
            left: "5%",
          }}
        />
      </div>

      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 py-12 lg:py-20">
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
                <Link href="/auth/register">
                  Order Your Card
                </Link>
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
            className="w-full lg:w-1/2 flex flex-col items-center gap-6"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-full max-w-sm"
            >
              <Image
                src={CARD_IMAGE}
                alt="TWallet Card on a blue pedestal"
                width={500}
                height={350}
                className="w-full h-auto object-contain drop-shadow-2xl"
                priority
                unoptimized
              />
            </motion.div>

            <OrderWidget />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
