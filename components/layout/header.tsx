"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const navLinks = ["Home", "How It Works", "Cards", "Pricing", "About Us", "Support"];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-md bg-[#05070a]/70 border-b border-white/5"
          : "bg-transparent",
      )}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#0066FF]/15 border border-[#0066FF]/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#0066FF]" strokeWidth={2.2} />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            TW<span className="text-[#0066FF]">-</span>CARD
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <a
              key={link}
              href="#"
              className={`text-sm font-medium transition-colors ${
                i === 0 ? "text-white" : "text-white/55 hover:text-white"
              }`}
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            className="hidden sm:flex items-center gap-2 px-5 h-9 rounded-lg bg-[#0066FF] hover:bg-[#0052cc] text-white text-sm font-semibold border-0"
            asChild
          >
            <Link href="/auth/login">Dashboard</Link>
          </Button>
          <button className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-white/20 transition-colors">
            <Moon className="w-4.5 h-4.5" strokeWidth={2} />
          </button>

          <button
            className="lg:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 bg-[#05070a] lg:hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-white/55 transition-colors hover:text-white"
                >
                  {link}
                </a>
              ))}
              <Button className="bg-[#0066FF] hover:bg-[#0052cc] text-white border-0 mt-2" asChild>
                <Link href="/auth/login">Dashboard</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
