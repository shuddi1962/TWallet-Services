"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/ui/motion-section";
import { RealCard } from "@/components/cards/card-art";
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

export function CardShowcase() {
  const [[currentIndex, direction], setSlide] = useState([0, 0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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
    <section id="cards" className="relative py-12 lg:py-16 overflow-hidden bg-surface-50">
      <Container>
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs">
              <span className="text-brand-700 font-medium">Card Collection</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-surface-900">
              Choose your style
            </h2>
            <p className="mt-1 text-sm text-surface-500">
              Five premium card designs. One perfect fit for you.
            </p>
          </div>
        </FadeIn>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div
            className="relative w-full flex items-center justify-center"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <button
              onClick={prev}
              className="absolute left-1 sm:left-6 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-surface-200 text-surface-400 shadow-sm hover:bg-surface-50 hover:text-surface-600 transition-all"
              aria-label="Previous card"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div
              className="relative w-full max-w-[320px] h-[204px] sm:h-[212px] flex items-center justify-center"
              style={{ perspective: "1000px" }}
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentFinish}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ x: d > 0 ? 180 : -180, opacity: 0, rotateY: d > 0 ? 12 : -12 }),
                    center: { x: 0, opacity: 1, rotateY: 0 },
                    exit: (d: number) => ({ x: d > 0 ? -180 : 180, opacity: 0, rotateY: d > 0 ? -12 : 12 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className="rounded-xl transition-shadow duration-300"
                    style={{
                      boxShadow: `0 0 40px ${finishGlow(currentFinish)}, 0 8px 32px rgba(0,0,0,0.12)`,
                    }}
                  >
                    <RealCard card={currentCard} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={next}
              className="absolute right-1 sm:right-6 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-surface-200 text-surface-400 shadow-sm hover:bg-surface-50 hover:text-surface-600 transition-all"
              aria-label="Next card"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="text-center">
            <h3 className="text-base sm:text-lg font-bold text-surface-900">{currentVisual.label}</h3>
            <p className="text-xs text-surface-500 mt-0.5">{currentVisual.tagline}</p>
          </div>

          <div className="flex items-center gap-2">
            {cardOrder.map((finish, i) => (
              <button
                key={finish}
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

          <div className="flex items-center gap-3 text-[11px] text-surface-400">
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
