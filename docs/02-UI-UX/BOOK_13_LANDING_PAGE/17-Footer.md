# 17 — Footer

> Component ID: LP-016 | Status: Approved
> Professional footer with 5 columns, social links, and bottom bar. Shared across all public pages.

## Purpose

Provide comprehensive navigation, legal links, brand presence, and trust signals at the bottom of every public page.

## Section Specs

| Property | Value |
|----------|-------|
| Background | Dark navy (`--color-hero` #020817) |
| Text color | White (headings), white/60% (links), white/40% (muted) |
| Padding | `--space-16` (64px) top, `--space-8` (32px) bottom |
| Container | `--container-max` (1280px), centered |

## Layout — 5 Columns

### Column 1 — Brand
| Element | Spec |
|---------|------|
| Logo | TWallet logo (white version, SVG) |
| Description | "TWallet Services is a non-custodial crypto card platform. Connect your wallet, order a card, pay with crypto." (14px, white/60%, max-width 240px) |
| Social Links | Row of icon buttons (36px each, white/60% → white on hover) |

**Social Links:**
- Twitter/X (external, new tab)
- LinkedIn (external, new tab)
- GitHub (external, new tab)
- Discord (external, new tab)

### Column 2 — Products
| Link | Route |
|------|-------|
| Virtual Cards | `/cards` |
| Physical Cards | `/cards` |
| Pricing | `/pricing` |

### Column 3 — Company
| Link | Route |
|------|-------|
| About | `/about` |
| Careers | (future) |
| Contact | `/contact` |
| Support | `/support` |

### Column 4 — Resources
| Link | Route |
|------|-------|
| Help Center | `/support` |
| Documentation | (future) |
| Status | (future) |
| FAQ | `/faq` |
| Blog | (future) |

### Column 5 — Legal
| Link | Route |
|------|-------|
| Privacy Policy | (future `/privacy`) |
| Terms of Service | (future `/terms`) |
| Cookie Policy | (future `/cookies`) |
| Disclaimer | (future `/disclaimer`) |

## Bottom Bar

| Element | Spec |
|---------|------|
| Copyright | "© 2026 TWallet Services. All rights reserved." (12px, white/40%) |
| Made with | "Made with ❤️" (12px, white/40%) — or remove emoji if preferred |
| Version | "v1.0.0" (12px, white/30%) |
| Trust statement | "We never ask for your recovery phrase or private keys." (12px, white/40%, with shield icon) |

## Link Style

| State | Color |
|-------|-------|
| Default | white/60% |
| Hover | white |
| Hover transition | 150ms |
| Column headers | White, 14px, 600, uppercase, letter-spacing 0.04em |

## Component Tree

```
Footer (RSC)
├── FooterContainer
│   ├── FooterTop (5 columns)
│   │   ├── BrandColumn
│   │   │   ├── Logo (white)
│   │   │   ├── Description ("TWallet Services is a non-custodial...")
│   │   │   └── SocialLinks
│   │   │       ├── SocialLink (Twitter/X → external)
│   │   │       ├── SocialLink (LinkedIn → external)
│   │   │       ├── SocialLink (GitHub → external)
│   │   │       └── SocialLink (Discord → external)
│   │   ├── FooterColumn ("Products")
│   │   │   ├── FooterLink ("Virtual Cards" → /cards)
│   │   │   ├── FooterLink ("Physical Cards" → /cards)
│   │   │   └── FooterLink ("Pricing" → /pricing)
│   │   ├── FooterColumn ("Company")
│   │   │   ├── FooterLink ("About" → /about)
│   │   │   ├── FooterLink ("Careers" → future)
│   │   │   ├── FooterLink ("Contact" → /contact)
│   │   │   └── FooterLink ("Support" → /support)
│   │   ├── FooterColumn ("Resources")
│   │   │   ├── FooterLink ("Help Center" → /support)
│   │   │   ├── FooterLink ("Documentation" → future)
│   │   │   ├── FooterLink ("Status" → future)
│   │   │   ├── FooterLink ("FAQ" → /faq)
│   │   │   └── FooterLink ("Blog" → future)
│   │   └── FooterColumn ("Legal")
│   │       ├── FooterLink ("Privacy Policy" → future)
│   │       ├── FooterLink ("Terms of Service" → future)
│   │       ├── FooterLink ("Cookie Policy" → future)
│   │       └── FooterLink ("Disclaimer" → future)
│   └── FooterBottom
│       ├── Copyright ("© 2026 TWallet Services. All rights reserved.")
│       ├── MadeWith ("Made with ❤️")
│       ├── Version ("v1.0.0")
│       └── TrustStatement (Shield icon + "We never ask for your recovery phrase...")
```

## Animations

| Animation | Element | Duration | Trigger |
|-----------|---------|----------|---------|
| Link hover | Color shift white/60% → white | 150ms | Mouse enter |
| Social hover | Scale(1.1) + color shift | 150ms | Mouse enter |

### prefers-reduced-motion
- Disable: social scale (keep color shift only)

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Landmark | `<footer>` element |
| Label | `aria-label="Site footer"` |
| Column nav | `<nav aria-label="[Column name]">` per column |
| Social links | `aria-label="[Platform] — opens in new tab"` + `rel="noopener noreferrer"` |
| Color contrast | White on #020817 = 18:1 (AAA); white/40% on #020817 ~7:1 (AAA) |
| Trust statement | `aria-label` with full text |

## Responsive

| Breakpoint | Layout |
|------------|--------|
| Desktop (1280+) | 5 columns in a row + brand column |
| Laptop (1024+) | 5 columns (slightly tighter) |
| Tablet (768–1023) | Brand full-width, then 3+2 column grid for links |
| Mobile (320–767) | Brand full-width, then 2-column grid for links, bottom bar stacked |
