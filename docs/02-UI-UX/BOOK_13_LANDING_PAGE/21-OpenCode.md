# 21 — OpenCode Implementation

> The complete build directive for the entire landing page. OpenCode can generate all sections from this prompt plus the individual section files.

---

## OpenCode Prompt

```
Build a premium fintech landing page for TWallet Services using Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, shadcn/ui (customized to Book 04 tokens), Framer Motion, Lucide icons, and Supabase.

## Route
/ (Homepage) — Server Component (RSC), indexable, SEO-optimized

## File Structure
src/app/(public)/
├── layout.tsx              # Public layout (Header + Footer)
├── page.tsx                # Landing page (RSC — composes all sections)
├── sitemap.ts              # SEO sitemap
├── robots.ts               # SEO robots
└── components/
    ├── AnnouncementBar.tsx     # Client (localStorage dismiss)
    ├── Header.tsx              # Client (sticky, scroll, mobile drawer)
    ├── Hero.tsx                # RSC + Client (3D card, mouse parallax, floating elements)
    ├── Statistics.tsx          # RSC + Client (count-up animation)
    ├── TrustedPartners.tsx     # Client (CSS marquee)
    ├── CardShowcase.tsx        # Client (3D CSS card, rotation, variant toggle)
    ├── Features.tsx            # RSC
    ├── DashboardPreview.tsx    # RSC + Client (parallax, floating mockup)
    ├── SupportedNetworks.tsx   # RSC + Client (hover glow)
    ├── HowItWorks.tsx          # RSC (timeline)
    ├── Pricing.tsx             # RSC
    ├── Security.tsx            # RSC
    ├── Testimonials.tsx        # Client (carousel, swipe)
    ├── FAQ.tsx                 # Client (Radix accordion)
    ├── Newsletter.tsx          # Client (react-hook-form + Zod)
    ├── CTABanner.tsx           # RSC
    └── Footer.tsx              # RSC

## Page Composition (page.tsx)
Compose in this exact order:
1. AnnouncementBar
2. Header
3. main:
   - Hero
   - Statistics
   - TrustedPartners
   - CardShowcase
   - Features
   - DashboardPreview
   - SupportedNetworks
   - HowItWorks
   - Pricing
   - Security
   - Testimonials
   - FAQ
   - Newsletter
   - CTABanner
4. Footer

Include JSON-LD scripts: Organization, WebSite, FAQPage.

## Design System (Book 04 tokens — via Tailwind v4 @theme)
- Primary: #2563EB | Primary Hover: #1D4ED8 | Primary Light: #DBEAFE
- Background: #F8FAFC | Surface: #FFFFFF | Border: #E2E8F0
- Heading: #0F172A | Body: #475569 | Muted: #94A3B8
- Hero/Footer: #020817
- Success: #16A34A | Warning: #F59E0B | Danger: #DC2626 | Info: #0EA5E9
- Font: Geist (next/font, self-hosted)
- Hero: clamp(2.5rem, 6vw, 4rem) | Section: clamp(1.75rem, 5vw, 2.5rem)
- Card radius: 20px (24px for pricing cards per spec) | Button radius: 14px | Pill: 999px
- Card shadow: shadow-md (resting), shadow-xl (hover), shadow-2xl (hero card)
- Section padding: 120px desktop, 64px mobile
- Container: 1280px max

## Section Specs (see individual .md files for full details)

1. AnnouncementBar: primary bg, dismissible, localStorage, 44px
2. Header: 80px sticky, transparent→white+blur on scroll, logo+nav+login+register, mobile drawer
3. Hero: 100vh dark navy, noise texture, 3D CSS card with mouse parallax, floating tokens (ETH/USDT/BNB/Polygon/WC), glass stat cards, "Get Started" + "Explore Cards" CTAs
4. Statistics: 4 white cards, count-up animation (0→real), 10K+ users, 50+ countries, 25K+ tx, 7+ networks
5. TrustedPartners: CSS marquee, 10 logos (grayscale→color on hover), 30s loop, pause on hover
6. CardShowcase: CSS-only 3D card (NO stock images), front/back rotation, color variants (Midnight Black/Royal Blue/Silver), chip, NFC, light reflection
7. Features: 3x2 grid, 6 cards (Secure Wallet, Multi-Chain, Fast Order, Crypto Payments, Real-Time Dashboard, Enterprise Security), 48px Lucide icons, hover lift
8. DashboardPreview: left text / right laptop mockup, floating + glow, parallax, feature pills
9. SupportedNetworks: 4-col grid, 7 supported + 3 future (BTC/SOL/TRX), glow border on hover, "Supported" badge
10. HowItWorks: 4-step timeline (Create Account→Connect Wallet→Choose Card→Pay & Track), horizontal desktop, vertical mobile, progress line
11. Pricing: 2 cards (Virtual $25 USDC, Physical $50 USDC), feature lists with checks, 24px radius, hover lift, "Most Popular" badge
12. Security: 3x2 grid, 6 security cards (Wallet Security, Encrypted Connections, Blockchain Verification, Privacy Protection, Fraud Protection, Account Protection), trust statement
13. Testimonials: dark bg carousel, 5 reviews with avatars/country/5-star, auto-slide 5s, touch swipe, dots+arrows
14. FAQ: Radix accordion, 10 questions, one-open-at-a-time, first open by default, FAQPage schema
15. Newsletter: primary gradient bg, email input + Subscribe button, Zod validation, success/error states
16. CTABanner: dark navy, "Ready To Join The Future Of Digital Payments?", Create Account + Explore Cards
17. Footer: dark navy, 5 columns (Brand, Products, Company, Resources, Legal), social links, bottom bar (copyright + version + trust)

## Responsive (Mobile-First)
- 320px: single column, hamburger drawer, stacked sections, full-width buttons
- 768px: 2-column grids where applicable, hamburger nav
- 1024px: 3-4 column grids, full nav visible
- 1280px: full layout, max container 1280px
- 1536px: same as 1280px, centered

## Animations (Framer Motion + CSS)
- Fade-in + slide-up: 300ms easeOut (sections, cards)
- Stagger: 100ms between items (max 8)
- Scale-in: 200ms (icons, 3D card)
- Count-up: 800ms easeOut (statistics)
- Hover lift: 150ms (translateY -4px + shadow swap)
- Continuous float: CSS animation 3-4s (3D card, mockup, tokens)
- Glow pulse: CSS animation 4s (hero glow, CTA glow)
- Marquee: CSS animation 30s linear infinite (trusted partners)
- Accordion: 200ms (Radix UI handles)
- Carousel: 300ms slide (testimonials)
- Max duration: 0.5s for all non-continuous animations
- ALL animations respect prefers-reduced-motion

## SEO
- Meta title: "TWallet Services | Secure Crypto Card Platform"
- Meta description: "Order premium crypto-powered virtual and physical cards, connect your wallet securely, pay with cryptocurrency, and manage everything through your dashboard."
- OpenGraph: title, description, image (1200x630), url, siteName
- Twitter: summary_large_image, title, description, image, creator
- JSON-LD: Organization, WebSite, FAQPage
- Sitemap: /sitemap.ts with all public routes
- Robots: /robots.ts (allow /, disallow /auth, /app, /admin, /api)
- Canonical: https://twalletservices.com/
- Robots meta: index, follow

## Performance
- Lighthouse 95+
- LCP < 2.5s, CLS < 0.1, INP < 200ms, TTFB < 200ms
- JS bundle < 100KB
- next/font for Geist (self-hosted, no CLS)
- next/image for all images (auto WebP/AVIF, lazy-load below fold)
- CSS animation for continuous loops (marquee, float, glow) — not JS
- Lazy-load client components (carousel, accordion, 3D card, newsletter form)
- Only animate transform and opacity (avoid layout thrash)

## Accessibility (WCAG 2.1 AA)
- One h1 (hero), h2 per section, h3 per card
- Skip-to-content link at top
- All interactive elements keyboard navigable with :focus-visible ring
- Radix UI for accordion (ARIA-compliant)
- Carousel: aria-label, keyboard arrows, pause on focus, touch swipe
- Images: descriptive alt text
- Color contrast: white on #020817 (18:1 AAA), white on #2563EB (4.6:1 AA)
- prefers-reduced-motion: disable all non-essential animations
- Semantic HTML: header, nav, main, section, footer

## Critical Rules
- NEVER request a seed phrase or private key anywhere on the page
- Trust indicators visible: "Non-custodial", "No seed phrase", "Verified on-chain"
- Page is Server Component (RSC) for SEO; Client Components only for interactive parts
- Use Book 04 design tokens via Tailwind v4 @theme (no raw hex or px in components)
- Generate all files with full TypeScript types, strict mode, no `any`
- Use shadcn/ui pattern (copy-into-codebase, customized to Book 04 tokens)
- Use Lucide React for all icons (outline style)
- Do NOT use stock illustrations for the card — build it with CSS gradients and shadows

## Environment Variables
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=https://twalletservices.com

## Build Commands
npm run dev       # Development
npm run build     # Production build
npm run lint      # ESLint
npm run typecheck # TypeScript check

Generate all files with full TypeScript types, strict mode, no `any`. Follow the TWallet Services Design System (Book 04) for all visual elements. Ensure all acceptance criteria (AC-LP-01 through AC-LP-15 from README.md) are satisfied. NEVER request seed phrases or private keys. The page must feel like Stripe + Coinbase + Apple — premium, clean, trustworthy.
```
