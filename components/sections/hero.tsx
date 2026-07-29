"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Play, Zap, Globe, Headphones, Shield, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { useWalletConnect } from "@/lib/hooks/use-wallet-connect";
import { WalletSelectModal } from "@/components/wallet/wallet-select-modal";

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
  const {
    openWallet,
    connecting,
    connectors,
    selectOpen,
    setSelectOpen,
    connectWith,
    busyId,
  } = useWalletConnect();

  return (
    <section className="relative overflow-hidden bg-[#03060d] pt-20 pb-14 lg:pt-28 lg:pb-20">
      <Stars />
      <FloatingOrbs />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4 lg:col-span-5"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-500/25 bg-brand-500/10 px-3 py-1"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
              <span className="text-[11px] font-semibold tracking-wide text-brand-300">
                Non-custodial · On-chain verified
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-[2.15rem] font-bold leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-[2.9rem] xl:text-[3.35rem] xl:leading-[1.02]"
            >
              Spend crypto
              <br />
              like cash.
              <br />
              <span className="bg-gradient-to-r from-brand-300 via-sky-300 to-accent-400 bg-clip-text text-transparent">
                Keep your keys.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-md text-sm leading-relaxed text-white/55 sm:text-base"
            >
              Order premium virtual & metal cards. Pay USDC on-chain. We never hold balances or ask for seed phrases.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
            >
              <div className="relative">
                <div className="absolute inset-0 animate-glow-pulse rounded-xl bg-brand-500/40 blur-xl" />
                <Button
                  className="relative h-11 overflow-hidden rounded-xl border-0 bg-gradient-to-r from-brand-500 to-brand-700 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-600/30"
                  onClick={() => openWallet()}
                  disabled={connecting}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    {connecting ? "Connecting…" : "Connect Wallet"}
                  </span>
                </Button>
              </div>
              <Button
                className="h-11 rounded-xl border border-white/15 px-5 text-sm font-medium text-white hover:border-white/30 hover:bg-white/5"
                variant="outline"
                asChild
              >
                <Link href="/auth/register">
                  <Play className="h-3.5 w-3.5 fill-white" />
                  Order a Card
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

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-4"
          >
            <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 shadow-2xl shadow-black/50 backdrop-blur-xl">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/30 to-accent-500/20 ring-1 ring-brand-400/30">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Connect & order</h3>
                  <p className="text-sm text-white/50">300+ wallets · QR code</p>
                </div>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-white/60">
                Official WalletConnect modal. Pay USDC on-chain to the platform receiving wallet — you keep your keys.
              </p>

              <button
                onClick={() => void openWallet()}
                disabled={connecting}
                className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:brightness-110 disabled:opacity-60"
              >
                <Smartphone className="h-4 w-4" strokeWidth={2} />
                {connecting ? "Connecting…" : "Connect Wallet"}
              </button>

              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                {["No custody", "On-chain", "Global"].map((t) => (
                  <div key={t} className="rounded-xl border border-white/10 bg-white/[0.03] px-2 py-2 text-[11px] font-medium text-white/55">
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
      <WalletSelectModal
        open={selectOpen}
        onClose={() => setSelectOpen(false)}
        connectors={connectors}
        busyId={busyId}
        onSelect={(c) => void connectWith(c)}
      />
    </section>
  );
}
