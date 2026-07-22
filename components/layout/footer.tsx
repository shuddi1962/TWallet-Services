"use client";

import Link from "next/link";
import { useState } from "react";
import { CreditCard, Twitter, Github, Send, Globe, Linkedin, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ],
  Resources: [
    { href: "/docs", label: "Documentation" },
    { href: "/support", label: "Support Center" },
    { href: "/status", label: "System Status" },
    { href: "/api", label: "API Reference" },
  ],
  Legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/security", label: "Security" },
    { href: "/compliance", label: "Compliance" },
  ],
  Developers: [
    { href: "/docs/getting-started", label: "Getting Started" },
    { href: "/docs/sdk", label: "SDK & Tools" },
    { href: "/docs/integration", label: "Integration Guide" },
    { href: "/changelog", label: "Changelog" },
  ],
};

const socialLinks = [
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "https://discord.com", icon: Send, label: "Discord" },
  { href: "https://t.me", icon: Send, label: "Telegram" },
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
];

const securityBadges = [
  { label: "PCI DSS", description: "Compliant" },
  { label: "SSL", description: "Encrypted" },
  { label: "AES-256", description: "Encrypted" },
  { label: "Blockchain", description: "Secured" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <footer className="bg-dark border-t border-white/5">
      <Container>
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6">
            <div className="col-span-2 lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/20">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight text-white">
                  TWallet <span className="text-brand-400">·</span> Services
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm text-surface-400 leading-relaxed">
                Order premium physical and virtual crypto cards using secure blockchain payments. Non-custodial. Global. Yours.
              </p>
              <div className="mt-6 flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-surface-400 transition-all hover:bg-brand-500/20 hover:text-brand-400"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-semibold text-white mb-4">Stay updated</h3>
                {submitted ? (
                  <div className="flex items-center gap-2 rounded-lg bg-success/10 px-4 py-3 text-sm text-success border border-success/20 max-w-xs">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Thanks for subscribing!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex max-w-xs gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 h-10 bg-white/5 border-white/10 text-white placeholder:text-surface-500 text-sm focus:border-brand-500/50"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-brand-500 text-white hover:bg-brand-600 shrink-0"
                    >
                      Subscribe
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-surface-400 transition-colors hover:text-brand-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 border-t border-white/5 pt-8">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <p className="text-sm text-surface-500">
                &copy; {new Date().getFullYear()} TWallet Services. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                {securityBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span className="text-xs text-surface-400">
                      {badge.label}
                    </span>
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
