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
      className="relative flex items-center justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-10"
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
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {greeting}, {name ?? "Wallet User"}
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Welcome back to your TWallet dashboard. Here is your account summary.
        </p>
      </div>

      {/* Right-side card illustration */}
      <div className="relative z-10 hidden shrink-0 sm:block">
        <div className="flex h-24 w-48 items-center justify-center rounded-xl border border-slate-200 bg-gradient-to-br from-brand-50 to-accent-50 shadow-sm">
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-black shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white">T</span>
            </div>
            <span className="text-[11px] font-medium text-slate-500">TWallet Card</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
