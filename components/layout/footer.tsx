"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  Twitter,
  Github,
  Send,
  Linkedin,
  CheckCircle2,
  Mail,
  ArrowRight,
  ShieldCheck,
  Lock,
  Activity,
  Building2,
  Headphones,
  Scale,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrustLogo } from "@/components/brand/trust-logo";
import { subscribeNewsletter } from "@/features/newsletter/server/actions";
import { cn } from "@/lib/utils/cn";

const footerLinks = [
  {
    title: "Company",
    icon: Building2,
    links: [
      { href: "/about", label: "About Us" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/cards", label: "Cards" },
      { href: "/pricing", label: "Pricing" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Support",
    icon: Headphones,
    links: [
      { href: "/support", label: "Support Center" },
      { href: "/contact", label: "Contact Us" },
      { href: "/dashboard/orders", label: "Track Order" },
      { href: "/auth/login", label: "Dashboard" },
    ],
  },
  {
    title: "Legal",
    icon: Scale,
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/cookies", label: "Cookie Policy" },
      { href: "/refunds", label: "Refund Policy" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

const socialLinks = [
  { href: "https://x.com", icon: Twitter, label: "Twitter / X" },
  { href: "https://discord.com", icon: Send, label: "Discord" },
  { href: "https://t.me", icon: Send, label: "Telegram" },
  { href: "https://github.com/shuddi1962/TWallet-Services", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
];

const securityBadges = [
  { label: "PCI DSS", description: "Compliant", icon: ShieldCheck },
  { label: "AES-256", description: "Encrypted", icon: Lock },
  { label: "SSL", description: "Secured", icon: Lock },
];

const supportedNetworks = [
  { label: "Ethereum", color: "bg-[#627eea]" },
  { label: "Polygon", color: "bg-[#8247e5]" },
  { label: "Base", color: "bg-[#0052ff]" },
  { label: "Arbitrum", color: "bg-[#28a0f0]" },
  { label: "Optimism", color: "bg-[#ff0420]" },
  { label: "USDC", color: "bg-[#2775ca]" },
];

export function Footer() {
  const [state, formAction, pending] = useActionState(subscribeNewsletter, undefined);

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-surface-950">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[720px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.35) 0%, transparent 65%)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-48 -right-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(217,70,239,0.3) 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="py-14 lg:py-20">
          {/* CTA banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-700 p-6 shadow-2xl shadow-brand-950/40 sm:p-10">
            <div
              className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)" }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full opacity-20 blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(0,0,0,0.5) 0%, transparent 70%)" }}
              aria-hidden="true"
            />
            <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-white">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  Cards issued in minutes
                </p>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Ready to spend your crypto anywhere?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Join thousands of holders paying straight from their own wallet — no custody, no lock-in, no barriers.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  asChild
                  className="h-12 shrink-0 gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-brand-700 shadow-lg shadow-black/20 transition hover:bg-slate-100"
                >
                  <Link href="/auth/register">
                    Get started
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  asChild
                  className="h-12 shrink-0 gap-2 rounded-xl border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <Link href="/contact">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Talk to support
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Newsletter promo card */}
          <div className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 backdrop-blur-sm sm:p-10">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-40 blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(37,99,235,0.5) 0%, transparent 70%)" }}
              aria-hidden="true"
            />
            <div className="relative grid items-center gap-8 lg:grid-cols-2">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-brand-400/25 bg-brand-500/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-brand-300">
                  <Mail className="h-3 w-3" aria-hidden="true" />
                  Newsletter
                </p>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Get card drops &amp; product updates.
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-surface-400">
                  Join thousands of holders getting early access to new card designs, limited metal editions and platform news.
                </p>
              </div>

              <div>
                {state?.success ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-300">
                    <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span>{state.success}</span>
                  </div>
                ) : (
                  <>
                    {state?.error && (
                      <div
                        className="mb-3 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs text-red-300"
                        role="alert"
                      >
                        {state.error}
                      </div>
                    )}
                    <form action={formAction} className="flex flex-col gap-3 sm:flex-row">
                      <Input
                        id="newsletter-email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                        aria-labelledby="newsletter-heading"
                        className="h-12 flex-1 border-white/10 bg-white/[0.05] px-4 text-sm text-white placeholder:text-surface-500 focus:border-brand-400 focus:ring-brand-500/30"
                      />
                      <Button
                        type="submit"
                        size="lg"
                        loading={pending}
                        className="h-12 shrink-0 gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 hover:brightness-110"
                      >
                        Subscribe
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </form>
                    <p className="mt-3 text-xs text-surface-500">
                      No spam. Unsubscribe anytime.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Link card grid */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand card */}
            <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <Link href="/" className="inline-flex w-fit">
                <TrustLogo size="md" variant="light" />
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-surface-400">
                Non-custodial crypto cards. Funded by your wallet, verified on-chain, delivered worldwide.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {securityBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1"
                    title={badge.description}
                  >
                    <badge.icon className="h-3 w-3 text-emerald-400" aria-hidden="true" />
                    <span className="text-[11px] font-medium text-surface-300">{badge.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500">
                  Supported networks
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {supportedNetworks.map((network) => (
                    <span
                      key={network.label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-surface-300"
                    >
                      <span className={cn("h-2 w-2 rounded-full", network.color)} aria-hidden="true" />
                      {network.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto flex gap-2.5 pt-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-surface-400 transition-all hover:border-brand-400/40 hover:bg-brand-500/15 hover:text-white"
                  >
                    <social.icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {footerLinks.map(({ title, icon: Icon, links }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-surface-300">
                  <Icon className="h-4 w-4 text-brand-400" aria-hidden="true" />
                  {title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1.5 text-sm text-surface-400 transition-colors hover:text-white"
                      >
                        <span className="h-1 w-1 rounded-full bg-surface-600 transition-colors group-hover:bg-brand-400" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 sm:flex-row">
            <p className="text-center text-xs text-surface-500 sm:text-left">
              &copy; {new Date().getFullYear()} TWallet Services. All rights reserved.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3.5 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <Activity className="h-3 w-3 text-emerald-400" aria-hidden="true" />
              <span className="text-[11px] font-medium text-emerald-300">
                All systems operational
              </span>
            </div>

            <div className="flex items-center gap-5 text-xs text-surface-500">
              <Link href="/terms" className="transition-colors hover:text-white">
                Terms
              </Link>
              <Link href="/privacy" className="transition-colors hover:text-white">
                Privacy
              </Link>
              <Link href="/cookies" className="transition-colors hover:text-white">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
