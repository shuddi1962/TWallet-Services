"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/ui/motion-section";
import { cn } from "@/lib/utils/cn";

const cardVariants = [
  { name: "Black", gradient: "from-surface-900 via-surface-800 to-surface-900", accent: "from-brand-500 to-brand-700", chip: "bg-yellow-400/80", label: "Midnight Black" },
  { name: "Titanium", gradient: "from-surface-400 via-surface-300 to-surface-400", accent: "from-blue-400 to-blue-600", chip: "bg-yellow-400/80", label: "Titanium" },
  { name: "Blue", gradient: "from-brand-600 via-brand-700 to-brand-900", accent: "from-brand-400 to-brand-600", chip: "bg-yellow-400/80", label: "Royal Blue" },
  { name: "Silver", gradient: "from-surface-200 via-white to-surface-200", accent: "from-surface-400 to-surface-600", chip: "bg-yellow-500/80", label: "Silver" },
  { name: "Gold", gradient: "from-amber-500 via-yellow-500 to-amber-700", accent: "from-amber-400 to-amber-600", chip: "bg-yellow-300", label: "Gold" },
];

function CardPreview({ variant, index }: { variant: typeof cardVariants[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        className="relative mx-auto h-44 w-72 sm:h-48 sm:w-80 overflow-hidden rounded-2xl p-[1.5px] shadow-xl transition-shadow duration-300 group-hover:shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${index === 0 ? "#2563eb" : index === 4 ? "#f59e0b" : "#64748b"}, ${index === 0 ? "#1d4ed8" : index === 4 ? "#d97706" : "#475569"})`,
        }}
      >
        <div className={cn("h-full w-full rounded-2xl bg-gradient-to-br p-5", variant.gradient)}>
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br shadow-lg" style={{
                background: `linear-gradient(135deg, ${index === 0 ? "#3b82f6" : index === 4 ? "#fbbf24" : "#94a3b8"}, ${index === 0 ? "#1d4ed8" : index === 4 ? "#f59e0b" : "#64748b"})`,
              }}>
                <span className="text-[8px] font-bold text-white">TW</span>
              </div>
              <div className="flex gap-1">
                <div className={cn("h-2.5 w-2.5 rounded-full", variant.chip)} />
                <div className="h-2.5 w-2.5 rounded-full bg-white/30" />
              </div>
            </div>
            <div>
              <div className="mb-3">
                <div className={cn("h-6 w-10 rounded", variant.chip)} />
              </div>
              <p className="font-mono text-sm tracking-[0.2em] text-white/80">
                •••• •••• •••• 4582
              </p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[10px] text-white/50 uppercase">Cardholder</p>
                <svg className="h-4 w-6" viewBox="0 0 24 16" fill="none">
                  <rect x="0.5" y="0.5" width="23" height="15" rx="2.5" fill={index === 4 ? "#1a1a1a" : "#00579F"} />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <p className="mt-3 text-center text-sm font-medium text-surface-400">{variant.label}</p>
    </motion.div>
  );
}

export function CardShowcase() {
  const [selected, setSelected] = useState(0);

  return (
    <section id="cards" className="relative py-20 lg:py-28 overflow-hidden bg-surface-50">
      <Container>
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm">
              <span className="text-brand-700 font-medium">Card Collection</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
              Choose your style
            </h2>
            <p className="mt-4 text-lg text-surface-500">
              Five premium card designs. One perfect fit for you.
            </p>
          </div>
        </FadeIn>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {cardVariants.map((variant, index) => (
            <div key={variant.name} onClick={() => setSelected(index)}>
              <CardPreview variant={variant} index={index} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
