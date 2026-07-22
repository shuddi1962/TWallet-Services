import Link from "next/link";
import { Wallet, Twitter, Github, Mail } from "lucide-react";
import { Container } from "@/components/layout/container";

const footerLinks = {
  Product: [
    { href: "/#features", label: "Features" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#networks", label: "Networks" },
    { href: "/#faq", label: "FAQ" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/security", label: "Security" },
    { href: "/compliance", label: "Compliance" },
  ],
  Resources: [
    { href: "/docs", label: "Documentation" },
    { href: "/support", label: "Support" },
    { href: "/status", label: "Status" },
    { href: "/api", label: "API" },
  ],
};

const socialLinks = [
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "mailto:hello@twalletservices.com", icon: Mail, label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-surface-50">
      <Container>
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <Wallet className="h-6 w-6 text-brand-600" />
                <span className="text-lg font-bold tracking-tight text-surface-900">
                  TWallet
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm text-surface-500">
                Non-custodial, crypto-funded card platform. Your keys, your
                crypto, your card.
              </p>
              <div className="mt-6 flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-surface-400 transition-colors hover:text-brand-600"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-semibold text-surface-900">
                  {title}
                </h3>
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

          <div className="mt-12 border-t border-surface-200 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-surface-500">
                &copy; {new Date().getFullYear()} TWallet Services. All rights
                reserved.
              </p>
              <p className="text-xs text-surface-400">
                Built with Next.js, Supabase &amp; Vercel
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
