"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Globe, ShieldCheck, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { OrderWidget } from "@/components/sections/order-widget";

const CARD_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB4kIr2XwzwDH8GGE6TbF23yoAi0hgE531M8geP32Cjq1mXYPGqLgX5RomAPAvL8_a31uz8iWMQ2z8bQVqlCgpbFDegzDuB4uw-g3stjGIrqdtoMF9CoWU6flYr36umlpNYm_tJRxYT4mHEFM9HDsv2HdwoHwHoBhy3NMXS0tJOZYYIpIEzOCWpa62ZB_RYk63ExlxwSjO61Ve_DI09AExScnco3FJwHpl6yClmGjB2yLuid6y4Q-vTWqABr5GJaUJjzyk";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-dark flex items-center">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[700px] h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(28,100,242,0.15) 0%, rgba(11,17,32,0) 70%)",
            bottom: "-20%",
            right: "-5%",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(28,100,242,0.1) 0%, rgba(11,17,32,0) 70%)",
            top: "10%",
            left: "-5%",
          }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[55%] h-full">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(270deg, rgba(28,100,242,0.12) 0%, transparent 100%)",
            }}
          />
          <motion.div
            animate={{ opacity: [0.6, 0.85, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, rgba(28,100,242,0.15) 0%, transparent 70%)",
              top: "20%",
              bottom: "20%",
              left: "10%",
              right: "0%",
            }}
          />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-full flex items-center justify-center"
          >
            <Image
              src={CARD_IMAGE}
              alt=""
              width={750}
              height={525}
              className="w-full max-w-[750px] h-auto object-contain drop-shadow-[0_0_60px_rgba(37,99,235,0.3)]"
              priority
              unoptimized
            />
          </motion.div>
        </div>
      </div>

      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 py-20 lg:py-28 relative z-10">
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
            className="w-full lg:w-1/2 flex justify-end relative"
          >
            <div className="relative">
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-10 bg-brand-500/10 rounded-full blur-3xl"
              />
              <div className="relative">
                <OrderWidget />
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
