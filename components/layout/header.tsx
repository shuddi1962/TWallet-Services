"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#networks", label: "Networks" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-200 bg-white/80 backdrop-blur-lg">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-brand-600" />
            <span className="text-lg font-bold tracking-tight text-surface-900">
              TWallet
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-surface-600 transition-colors hover:text-brand-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Log In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/register">Get Started</Link>
            </Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6 text-surface-900" />
            ) : (
              <Menu className="h-6 w-6 text-surface-900" />
            )}
          </button>
        </div>
      </Container>

      {mobileOpen && (
        <div className="border-t border-surface-200 bg-white md:hidden">
          <Container>
            <nav className="flex flex-col gap-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-surface-600 hover:text-brand-600"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth/login">Log In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
