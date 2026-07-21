# Book 13 — Landing Page

> **TWallet Services · TWallet Card**
> The public face of TWallet Services. This folder contains 21 modular section specifications plus this README. Each file documents one section of the landing page independently — OpenCode can build each section without reading the others.

---

## Document Control

| Field        | Value                              |
| ------------ | ---------------------------------- |
| Book         | 13 — Landing Page                  |
| Version      | 1.0.0                              |
| Status       | Approved                           |
| Route        | `/`                                |
| Type         | Modular folder (22 files)          |
| Created      | 2026-07-21                         |

---

## Overview

The Landing Page is the public face of TWallet Services.

Its purpose is to:

- Build trust
- Explain the product
- Convert visitors into customers
- Encourage registration
- Showcase the TWallet Card

The design language should feel similar to premium fintech companies like:

- Stripe
- Coinbase
- Revolut
- Wise
- Apple

Never overcrowd the page. Whitespace is part of the design.

---

## Page Layout (Section Order)

```text
──────────────────────────
Announcement Bar          ← 02-Announcement-Bar.md
Header                    ← 03-Header.md
Hero                      ← 01-Hero.md
Statistics                ← 04-Statistics.md
Trusted Partners          ← 05-Trusted-Partners.md
Card Showcase             ← 06-Card-Showcase.md
Features                  ← 07-Features.md
Dashboard Preview         ← 08-Dashboard-Preview.md
Supported Networks        ← 09-Supported-Networks.md
How It Works              ← 10-How-It-Works.md
Pricing Preview           ← 11-Pricing.md
Security                  ← 12-Security.md
Testimonials              ← 13-Testimonials.md
FAQ                       ← 14-FAQ.md
Newsletter                ← 15-Newsletter.md
CTA Banner                ← 16-CTA.md
Footer                    ← 17-Footer.md
──────────────────────────
```

> **Note:** Announcement Bar and Header render above the Hero. Footer renders at the bottom. The Hero is the first content section.

---

## File Index

| File | Section | Component Type | Key Features |
|------|---------|---------------|--------------|
| `README.md` | This file | — | Folder index, layout, philosophy, budgets |
| `01-Hero.md` | Hero | RSC + Client (3D) | 100vh, dark navy, 3D card, floating coins, glass stat cards |
| `02-Announcement-Bar.md` | Announcement Bar | RSC | Dismissible top bar, promo/launch announcement |
| `03-Header.md` | Header | Client (sticky) | White sticky, blur, logo, nav, login, register CTA |
| `04-Statistics.md` | Statistics | RSC + Client (count-up) | Glass cards, 4 stats, count-up animation |
| `05-Trusted-Partners.md` | Trusted Partners | Client (marquee) | Scrolling logos, infinite loop |
| `06-Card-Showcase.md` | Card Showcase | Client (3D rotation) | Front/back card, rotation, light reflection |
| `07-Features.md` | Features | RSC | 3x2 grid, 6 features, icons |
| `08-Dashboard-Preview.md` | Dashboard Preview | RSC + Client (parallax) | Laptop mockup, dashboard screenshot |
| `09-Supported-Networks.md` | Supported Networks | RSC + Client (hover) | 6 network cards, animated |
| `10-How-It-Works.md` | How It Works | RSC | 5-step timeline, icons |
| `11-Pricing.md` | Pricing Preview | RSC | Virtual + Physical pricing, compare button |
| `12-Security.md` | Security | RSC | 5 security pillars, trust signals |
| `13-Testimonials.md` | Testimonials | Client (carousel) | 5 reviews, photos, ratings |
| `14-FAQ.md` | FAQ | Client (accordion) | 6 categories, accordion |
| `15-Newsletter.md` | Newsletter | Client (form) | Email capture, validation |
| `16-CTA.md` | CTA Banner | RSC | Final conversion push, two CTAs |
| `17-Footer.md` | Footer | RSC | 5 columns, social, copyright, newsletter |
| `18-Mobile-Version.md` | Mobile Version | — | Responsive specs for all sections at 320px–768px |
| `19-Animations.md` | Animations | — | Framer Motion patterns, timings, reduced-motion |
| `20-SEO.md` | SEO | — | Meta, OG, Twitter, JSON-LD, sitemap, canonical |
| `21-OpenCode.md` | OpenCode Prompt | — | Complete build directive for the entire page |

---

## Design Philosophy

| Principle | Rule |
|-----------|------|
| Premium feel | Inspired by Stripe, Coinbase, Revolut, Wise, Apple |
| Whitespace | Whitespace is part of the design; never overcrowd |
| Dark hero / Light body | Hero is dark navy; all content sections are light (white or very light gray) |
| One CTA per section | Each section has at most one primary action |
| Trust throughout | Non-custodial messaging, security signals, no-seed-phrase notices |
| Mobile-first | Every section designed at 320px first, enhanced at larger breakpoints |

---

## Design System Reference

All sections use Book 04 design tokens:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | #2563EB | CTAs, links, accents |
| `--color-hero` | #020817 | Hero, footer, testimonials bg |
| `--color-surface` | #FFFFFF | Cards, header |
| `--color-bg` | #F8FAFC | Alternating section backgrounds |
| `--color-heading` | #0F172A | Headings |
| `--color-body` | #475569 | Body text |
| `--font-sans` | Geist | All text |
| `--text-hero` | clamp(2.5rem, 6vw, 4rem) | Hero headline |
| `--text-section` | clamp(1.75rem, 5vw, 2.5rem) | Section headings |
| `--radius-card` | 20px | Cards |
| `--shadow-md` | shadow-md | Resting cards |
| `--shadow-2xl` | shadow-2xl | Hero card |
| `--space-30` | 120px | Section padding (desktop) |
| `--space-16` | 64px | Section padding (mobile) |
| `--container-max` | 1280px | Max container width |

---

## Performance Budget

| Metric | Target |
|--------|--------|
| Lighthouse Score | 95+ |
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |
| TTFB | < 200ms |
| JS Bundle | < 100KB (with Framer Motion) |
| Images | < 300KB initial load (next/image optimization) |
| Fonts | Geist via next/font (self-hosted, no CLS) |

---

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | 320px–767px | Single column, bottom drawer nav, stacked sections |
| Tablet | 768px–1023px | 2-column grids where applicable, hamburger nav |
| Laptop | 1024px–1279px | 3-column grids, full nav visible |
| Desktop | 1280px+ | Full layout, max container 1280px |
| Wide | 1536px+ | Same as desktop, content centered |

> See `18-Mobile-Version.md` for detailed responsive specs per section.

---

## Accessibility (All Sections)

| Requirement | Implementation |
|-------------|---------------|
| Keyboard navigation | All interactive elements reachable via Tab |
| Focus indicators | `:focus-visible` ring on every interactive element |
| ARIA labels | On icon-only buttons, accordions, carousels |
| Heading hierarchy | One h1 (hero), h2 per section, h3 per card |
| Color contrast | WCAG 2.1 AA minimum (4.5:1 body, 3:1 large text) |
| Screen reader | Semantic HTML; landmarks (header, nav, main, footer) |
| Reduced motion | All animations respect `prefers-reduced-motion` |
| Skip link | Skip-to-content link at top of page |

---

## Acceptance Criteria

| AC ID | Criterion |
|-------|-----------|
| AC-LP-01 | Given a visitor, when they load `/`, then the hero displays within 2.5s (LCP). |
| AC-LP-02 | Given the landing page, then all 17 sections render in the correct order. |
| AC-LP-03 | Given the landing page, then "Get Started" CTA appears in hero, CTA banner, and header. |
| AC-LP-04 | Given the landing page on mobile (320px), then all sections are fully responsive and stacked. |
| AC-LP-05 | Given the landing page, then all scroll animations respect `prefers-reduced-motion`. |
| AC-LP-06 | Given the landing page, then the page is fully keyboard navigable with visible focus. |
| AC-LP-07 | Given the landing page, then meta tags include title, description, OG, Twitter, canonical, JSON-LD. |
| AC-LP-08 | Given the FAQ section, then the accordion is ARIA-compliant and keyboard operable. |
| AC-LP-09 | Given the newsletter form, then it validates email and shows success/error states. |
| AC-LP-10 | Given the landing page, then no section requests a seed phrase or private key. |
| AC-LP-11 | Given the landing page, then Lighthouse score is 95+. |
| AC-LP-12 | Given the testimonials carousel, then it auto-advances, pauses on focus, and is keyboard navigable. |
| AC-LP-13 | Given the header, then it is sticky with a blur effect and collapses to a drawer on mobile. |
| AC-LP-14 | Given the card showcase, then the card rotates on hover (desktop) and tap (mobile). |
| AC-LP-15 | Given the announcement bar, then it is dismissible and stays dismissed (localStorage). |

---

## References

- Book 03 — Information Architecture (route `/`, page composition)
- Book 04 — Design System (tokens, components, motion, accessibility)
- Book 06 — User Experience & User Flows (homepage journey, page spec)
- Book 12 — System Architecture (RSC pattern, folder structure)
