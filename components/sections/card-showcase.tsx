"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/ui/motion-section";
import { TwalletCard } from "@/components/cards/twallet-card";
import { cardFinishes, cardOrder, sampleCards } from "@/lib/cards";
import type { CardFinish } from "@/lib/cards";

function finishGlow(f: CardFinish) {
  const map: Record<CardFinish, string> = {
    sapphire: "rgba(59,130,246,0.25)",
    obsidian: "rgba(148,163,184,0.15)",
    cyber: "rgba(6,182,212,0.2)",
    gold: "rgba(245,158,11,0.25)",
    holographic: "rgba(168,85,247,0.2)",
  };
  return map[f];
}

function maskPan(full: string) {
  const digits = full.replace(/\s/g, "");
  const first4 = digits.slice(0, 4) || "••••";
  const last4 = digits.slice(-4) || "••••";
  return `${first4} •••• •••• ${last4}`;
}

export function CardShowcase() {
  const [[currentIndex, direction], setSlide] = useState([0, 0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const goTo = useCallback((index: number, dir: number) => {
    const len = cardOrder.length;
    setSlide([((index % len) + len) % len, dir]);
  }, []);

  const next = useCallback(() => goTo(currentIndex + 1, 1), [currentIndex, goTo]);
  const prev = useCallback(() => goTo(currentIndex - 1, -1), [currentIndex, goTo]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  const currentFinish = cardOrder[currentIndex]!;
  const currentCard = sampleCards[currentFinish];
  const currentVisual = cardFinishes[currentFinish];

  return (
    <section id="cards" className="relative overflow-hidden bg-surface-50 py-12 lg:py-16">
      <Container>
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs">
              <span className="font-medium text-brand-700">Card Collection</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-surface-900 sm:text-2xl">
              Choose your style
            </h2>
            <p className="mt-1 text-sm text-surface-500">
              Five premium card designs. One perfect fit for you.
            </p>
          </div>
        </FadeIn>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div
            className="relative flex w-full items-center justify-center px-2"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            onTouchStart={(e) => setTouchStart(e.touches[0]?.clientX ?? null)}
            onTouchEnd={(e) => {
              if (touchStart == null) return;
              const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStart;
              if (Math.abs(dx) > 40) {
                if (dx < 0) next();
                else prev();
              }
              setTouchStart(null);
            }}
          >
            <div
              className="relative flex w-full max-w-[380px] items-center justify-center"
              style={{ perspective: "1000px" }}
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentFinish}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ x: d > 0 ? 180 : -180, opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit: (d: number) => ({ x: d > 0 ? -180 : 180, opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35 }}
                  className="w-full"
                  style={{
                    filter: `drop-shadow(0 0 28px ${finishGlow(currentFinish)})`,
                  }}
                >
                  <TwalletCard
                    finish={currentFinish}
                    holderName={currentCard.holderName}
                    panDisplay={maskPan(currentCard.cardNumber)}
                    expiry={currentCard.expiryDate}
                    cvv="•••"
                    network={
                      currentFinish === "obsidian" || currentFinish === "cyber"
                        ? "mastercard"
                        : "visa"
                    }
                    isVirtual={currentCard.isVirtual}
                    interactive
                    className="max-w-none"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-base font-bold text-surface-900 sm:text-lg">
              {currentVisual.label}
            </h3>
            <p className="mt-0.5 text-xs text-surface-500">{currentVisual.tagline}</p>
          </div>

          <div className="flex items-center gap-2">
            {cardOrder.map((finish, i) => (
              <button
                key={finish}
                type="button"
                onClick={() => {
                  const dir = i > currentIndex ? 1 : -1;
                  goTo(i, dir);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-6 bg-gradient-to-r from-brand-500 to-brand-600"
                    : "w-1.5 bg-surface-300 hover:bg-surface-400"
                }`}
                aria-label={`Go to ${cardFinishes[finish].label}`}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-surface-400">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {currentCard.isVirtual ? "Virtual" : "Physical"}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              ${currentCard.limitDaily.toLocaleString()}/day
            </span>
            {currentCard.contactlessEnabled && (
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Contactless
              </span>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
