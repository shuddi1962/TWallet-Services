"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, CreditCard, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#cards", label: "Cards" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/#faq", label: "Support" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
          ? "bg-white/80 backdrop-blur-xl border-b border-surface-200 shadow-sm"
          : "bg-transparent",
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/20">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
            <span className={cn("text-lg font-bold tracking-tight transition-colors", scrolled ? "text-surface-900" : "text-white")}>
              TWallet <span className="text-brand-500">·</span> Services
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  scrolled ? "text-surface-600 hover:text-surface-900" : "text-white/70 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                scrolled
                  ? "text-surface-500 hover:text-surface-900 hover:bg-surface-100"
                  : "text-white/70 hover:text-white hover:bg-white/10",
              )}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Button
              size="sm"
              className="bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/25"
              asChild
            >
              <Link href="/auth/login">Dashboard</Link>
            </Button>
          </div>

          <button
            className={cn("md:hidden", scrolled ? "text-surface-900" : "text-white")}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-surface-200 bg-white md:hidden"
          >
            <Container>
              <nav className="flex flex-col gap-4 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-surface-600 transition-colors hover:text-surface-900"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 pt-2">
                  <Button size="sm" className="bg-brand-500 text-white hover:bg-brand-600" asChild>
                    <Link href="/auth/login">Dashboard</Link>
                  </Button>
                </div>
              </nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
