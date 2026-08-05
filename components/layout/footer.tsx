"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Twitter, Github, Send, Linkedin, CheckCircle2, Smartphone, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrustLogo } from "@/components/brand/trust-logo";
import { subscribeNewsletter } from "@/features/newsletter/server/actions";
import { useSystemSettings } from "@/lib/hooks/use-system-settings";

const footerLinks = {
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/how-it-works", label: "How It Works" },
  ],
  Support: [
    { href: "/support", label: "Support" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
    { href: "/auth/login", label: "Dashboard" },
  ],
  Legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/contact", label: "Refunds & Disputes" },
  ],
};

const socialLinks = [
  { href: "https://x.com", icon: Twitter, label: "Twitter / X" },
  { href: "https://discord.com", icon: Send, label: "Discord" },
  { href: "https://t.me", icon: Send, label: "Telegram" },
  { href: "https://github.com/shuddi1962/TWallet-Services", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
];

const securityBadges = [
  { label: "PCI DSS", description: "Compliant" },
  { label: "SSL", description: "Encrypted" },
  { label: "AES-256", description: "Encrypted" },
  { label: "Blockchain", description: "Secured" },
];

export function Footer() {
  const [state, formAction, pending] = useActionState(subscribeNewsletter, undefined);
  const settings = useSystemSettings();

  return (
    <footer className="border-t border-surface-200 bg-surface-50">
      <Container>
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <div className="sm:col-span-2 lg:col-span-2">
              <Link href="/" className="group inline-flex">
                <TrustLogo size="md" variant="dark" />
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-surface-500">
                Premium virtual &amp; metal cards, funded straight from your own wallet and verified on-chain.
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-surface-400">
                <Smartphone className="h-3.5 w-3.5" />
                <span>Optimized for Trust Wallet</span>
              </div>

              <div className="mt-2 flex items-center gap-2 text-xs text-surface-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Powered by WalletConnect</span>
              </div>

              <div className="mt-6 flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-200 text-surface-500 transition-all hover:bg-brand-100 hover:text-brand-600"
                  >
                    <social.icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>

              <div className="mt-8">
                <h3 id="newsletter-heading" className="mb-4 text-sm font-semibold text-surface-900">
                  Stay updated
                </h3>
                {state?.success ? (
                  <div className="flex max-w-xs items-center gap-2 rounded-lg border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">
                    <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{state.success}</span>
                  </div>
                ) : (
                  <>
                    {state?.error && (
                      <div className="mb-2 max-w-xs rounded-lg border border-error/20 bg-error/10 px-3 py-2 text-xs text-error" role="alert">
                        {state.error}
                      </div>
                    )}
                    <form action={formAction} className="flex max-w-xs gap-2">
                      <Input
                        id="newsletter-email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                        aria-labelledby="newsletter-heading"
                        className="h-10 flex-1 border-surface-200 bg-white text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-500"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        loading={pending}
                        className="shrink-0 bg-brand-500 text-white hover:bg-brand-600"
                      >
                        Subscribe
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-semibold text-surface-900">{title}</h3>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-surface-500 transition-colors hover:text-brand-600"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-surface-200 pt-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-xs text-surface-500">
                &copy; {new Date().getFullYear()} {String(settings.general?.site_name ?? "TWallet")}. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {securityBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-1.5 rounded-full bg-surface-200 px-3 py-1"
                    title={badge.description}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span className="text-xs text-surface-600">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
