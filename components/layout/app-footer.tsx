import Link from "next/link";
import {
  Activity,
  Building2,
  Github,
  Headphones,
  LayoutDashboard,
  Linkedin,
  Lock,
  Scale,
  Send,
  ShieldCheck,
  Twitter,
} from "lucide-react";
import { TrustLogo } from "@/components/brand/trust-logo";
import { cn } from "@/lib/utils/cn";

const linkGroups = [
  {
    title: "Product",
    icon: LayoutDashboard,
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/cards", label: "Cards" },
      { href: "/dashboard/orders", label: "Orders" },
      { href: "/dashboard/wallet", label: "Wallet" },
      { href: "/dashboard/transactions", label: "Transactions" },
    ],
  },
  {
    title: "Support",
    icon: Headphones,
    links: [
      { href: "/support", label: "Support Center" },
      { href: "/dashboard/orders", label: "Track Order" },
      { href: "/contact", label: "Contact Us" },
      { href: "/faq", label: "FAQ" },
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

const securityBadges = [
  { label: "PCI DSS", description: "Compliant", icon: ShieldCheck },
  { label: "AES-256", description: "Encrypted", icon: Lock },
  { label: "SSL", description: "Secured", icon: Lock },
];

const socialLinks = [
  { href: "https://x.com", icon: Twitter, label: "Twitter / X" },
  { href: "https://discord.com", icon: Send, label: "Discord" },
  { href: "https://t.me", icon: Send, label: "Telegram" },
  { href: "https://github.com/shuddi1962/TWallet-Services", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
];

const supportedNetworks = [
  { label: "Ethereum", color: "bg-[#627eea]" },
  { label: "Polygon", color: "bg-[#8247e5]" },
  { label: "Base", color: "bg-[#0052ff]" },
  { label: "Arbitrum", color: "bg-[#28a0f0]" },
  { label: "Optimism", color: "bg-[#ff0420]" },
  { label: "USDC", color: "bg-[#2775ca]" },
];

export function AppFooter({ variant = "light" }: { variant?: "light" | "dark" }) {
  const dark = variant === "dark";

  const card = cn(
    "rounded-2xl border p-6 transition-colors",
    dark
      ? "border-white/10 bg-white/[0.03]"
      : "border-slate-200/80 bg-white shadow-sm",
  );
  const heading = cn(
    "flex items-center gap-2 text-sm font-semibold uppercase tracking-wider",
    dark ? "text-surface-300" : "text-slate-700",
  );
  const linkClass = cn(
    "group inline-flex items-center gap-1.5 text-sm transition-colors",
    dark ? "text-surface-400 hover:text-white" : "text-slate-500 hover:text-slate-900",
  );
  const dotClass = cn(
    "h-1 w-1 rounded-full transition-colors",
    dark ? "bg-surface-600 group-hover:bg-brand-400" : "bg-slate-300 group-hover:bg-brand-500",
  );
  const iconClass = dark ? "text-brand-400" : "text-brand-600";

  return (
    <footer
      className={cn(
        "relative overflow-hidden border-t",
        dark ? "border-white/10 bg-surface-950" : "border-slate-200 bg-[#fafafa]",
      )}
    >
      {dark && (
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[560px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.4) 0%, transparent 65%)" }}
          aria-hidden="true"
        />
      )}

      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Brand card */}
          <div className={cn(card, "col-span-2 flex flex-col lg:col-span-1")}>
            <Link href="/" className="inline-flex w-fit">
              <TrustLogo size="md" variant={dark ? "light" : "dark"} />
            </Link>
            <p
              className={cn(
                "mt-4 text-sm leading-relaxed",
                dark ? "text-surface-400" : "text-slate-500",
              )}
            >
              Non-custodial crypto cards. Funded by your wallet, verified on-chain, delivered worldwide.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {securityBadges.map((badge) => (
                <span
                  key={badge.label}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium",
                    dark
                      ? "border-white/10 bg-white/[0.04] text-surface-300"
                      : "border-slate-200 bg-white text-slate-600",
                  )}
                  title={badge.description}
                >
                  <badge.icon
                    className={cn("h-3 w-3", dark ? "text-emerald-400" : "text-emerald-600")}
                    aria-hidden="true"
                  />
                  {badge.label}
                </span>
              ))}
            </div>

            <div className="mt-5">
              <p
                className={cn(
                  "text-[11px] font-semibold uppercase tracking-wider",
                  dark ? "text-surface-500" : "text-slate-400",
                )}
              >
                Supported networks
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {supportedNetworks.map((network) => (
                  <span
                    key={network.label}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
                      dark
                        ? "border-white/10 bg-white/[0.04] text-surface-300"
                        : "border-slate-200 bg-white text-slate-600",
                    )}
                  >
                    <span className={cn("h-2 w-2 rounded-full", network.color)} aria-hidden="true" />
                    {network.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between gap-2 pt-6">
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg border transition-all",
                      dark
                        ? "border-white/10 bg-white/[0.04] text-surface-400 hover:border-brand-400/40 hover:bg-brand-500/15 hover:text-white"
                        : "border-slate-200 bg-white text-slate-400 hover:border-brand-500/40 hover:bg-brand-50 hover:text-brand-600",
                    )}
                  >
                    <social.icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ))}
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 text-[11px] font-medium",
                  dark ? "text-surface-500" : "text-slate-400",
                )}
              >
                <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                Never custodial
              </span>
            </div>
          </div>

          {/* Link cards */}
          {linkGroups.map(({ title, icon: Icon, links }) => (
            <div key={title} className={cn(card, "flex flex-col")}>
              <h3 className={heading}>
                <Icon className={cn("h-4 w-4", iconClass)} aria-hidden="true" />
                {title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      <span className={dotClass} aria-hidden="true" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className={cn(
            "mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border px-6 py-5 sm:flex-row",
            dark
              ? "border-white/10 bg-white/[0.03]"
              : "border-slate-200 bg-white shadow-sm",
          )}
        >
          <p
            className={cn("text-center text-xs sm:text-left", dark ? "text-surface-500" : "text-slate-400")}
          >
            &copy; {new Date().getFullYear()} TWallet Services. All rights reserved.
          </p>

          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5",
              dark
                ? "border-emerald-400/20 bg-emerald-500/10"
                : "border-emerald-200 bg-emerald-50",
            )}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <Activity
              className={cn("h-3 w-3", dark ? "text-emerald-400" : "text-emerald-600")}
              aria-hidden="true"
            />
            <span
              className={cn("text-[11px] font-medium", dark ? "text-emerald-300" : "text-emerald-700")}
            >
              All systems operational
            </span>
          </div>

          <div
            className={cn(
              "flex items-center gap-5 text-xs",
              dark ? "text-surface-500" : "text-slate-400",
            )}
          >
            <Link href="/terms" className="transition-colors hover:text-brand-500">
              Terms
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-brand-500">
              Privacy
            </Link>
            <Link href="/cookies" className="transition-colors hover:text-brand-500">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
