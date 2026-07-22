"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Sparkles } from "lucide-react";

export function AnnouncementBar() {
  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden bg-gradient-to-r from-brand-900/50 via-accent-900/30 to-brand-900/50 py-2.5 text-center text-sm"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(99,102,241,0.1),transparent)] animate-pulse" />
      <Container size="sm">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-brand-400" />
          <span className="text-white/80">
            New: Base network now supported. Pay with ETH on Base.
          </span>
        </div>
      </Container>
    </motion.div>
  );
}
