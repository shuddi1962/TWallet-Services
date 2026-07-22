"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Globe, ShieldCheck, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

const CARD_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB4kIr2XwzwDH8GGE6TbF23yoAi0hgE531M8geP32Cjq1mXYPGqLgX5RomAPAvL8_a31uz8iWMQ2z8bQVqlCgpbFDegzDuB4uw-g3stjGIrqdtoMF9CoWU6flYr36umlpNYm_tJRxYT4mHEFM9HDsv2HdwoHwHoBhy3NMXS0tJOZYYIpIEzOCWpa62ZB_RYk63ExlxwSjO61Ve_DI09AExScnco3FJwHpl6yClmGjB2yLuid6y4Q-vTWqABr5GJaUJjzyk";

export function Hero() {
  return (
    <section className="relative min-h-[80vh] overflow-hidden bg-dark flex items-center">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(28,100,242,0.15) 0%, rgba(11,17,32,0) 70%)",
            bottom: "-10%",
            right: "0%",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(28,100,242,0.08) 0%, rgba(11,17,32,0) 70%)",
            bottom: "10%",
            left: "0%",
          }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full opacity-40">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(270deg, rgba(28,100,242,0.08) 0%, transparent 100%)",
            }}
          />
          <Image
            src={CARD_IMAGE}
            alt=""
            width={700}
            height={490}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-full max-w-[700px] h-auto object-contain opacity-70"
            priority
            unoptimized
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(270deg, transparent 30%, rgba(11,17,32,1) 100%)",
            }}
          />
        </div>
      </div>

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl flex flex-col gap-5 relative z-10"
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
      </Container>
    </section>
  );
}
