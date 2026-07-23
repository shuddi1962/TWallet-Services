"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Globe, ShieldCheck, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { OrderWidget } from "@/components/sections/order-widget";

const CARD_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB4kIr2XwzwDH8GGE6TbF23yoAi0hgE531M8geP32Cjq1mXYPGqLgX5RomAPAvL8_a31uz8iWMQ2z8bQVqlCgpbFDegzDuB4uw-g3stjGIrqdtoMF9CoWU6flYr36umlpNYm_tJRxYT4mHEFM9HDsv2HdwoHwHoBhy3NMXS0tJOZYYIpIEzOCWpa62ZB_RYk63ExlxwSjO61Ve_DI09AExScnco3FJwHpl6yClmGjB2yLuid6y4Q-vTWqABr5GJaUJjzyk";

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

export function Hero() {
  return (
    <section className="relative min-h-screen bg-dark flex flex-col">
      <div className="absolute inset-0 pointer-events-none">
        <Stars />

        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[900px] h-[900px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(11,17,32,0) 65%)",
            bottom: "-25%",
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

        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] h-3/4 flex items-center justify-center">
          <motion.div
            animate={{ opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.2) 0%, rgba(99,102,241,0.08) 35%, transparent 60%)",
            }}
          />
          <div
            className="w-full max-w-[600px] relative"
            style={{
              maskImage: "radial-gradient(ellipse 75% 60% at 50% 50%, black 50%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse 75% 60% at 50% 50%, black 50%, transparent 75%)",
            }}
          >
            <Image
              src={CARD_IMAGE}
              alt=""
              width={600}
              height={420}
              className="w-full h-auto object-contain"
              style={{
                filter: "drop-shadow(0 0 60px rgba(37,99,235,0.3)) drop-shadow(0 0 120px rgba(37,99,235,0.1))",
              }}
              priority
              unoptimized
            />
          </div>
        </div>
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
