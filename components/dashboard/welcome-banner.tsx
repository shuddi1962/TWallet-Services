"use client";

import { motion } from "framer-motion";

interface WelcomeBannerProps {
  name?: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function WelcomeBanner({ name }: WelcomeBannerProps) {
  const greeting = getGreeting();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative flex items-center justify-between overflow-hidden rounded-2xl border border-surface-800 bg-surface-900 px-6 py-8 sm:px-10"
    >
      {/* Background gradient orbs */}
      <div
        className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-accent-500/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Text content */}
      <div className="relative z-10">
        <h1 className="text-2xl font-bold text-surface-50 sm:text-3xl">
          {greeting}, {name ?? "Wallet User"}
        </h1>
        <p className="mt-2 text-sm text-surface-400 sm:text-base">
          Welcome back to your TWallet dashboard. Here is your account summary.
        </p>
      </div>

      {/* Right-side card illustration */}
      <div className="relative z-10 hidden shrink-0 sm:block">
        <div className="flex h-24 w-48 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-brand-600/20 to-accent-600/20 shadow-lg shadow-brand-500/5">
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white">T</span>
            </div>
            <span className="text-[11px] font-medium text-surface-400">TWallet Card</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
