# Landing Pages

## Page Inventory

| Page | Route | Purpose | SEO Priority |
|------|-------|---------|--------------|
| Homepage | `/` | Primary conversion page | Critical |
| Features | `/features` | Feature deep-dive | High |
| Pricing | `/pricing` | Pricing + plan comparison | High |
| Security | `/security` | Trust-building | Medium |
| About | `/about` | Company story | Medium |
| Contact | `/contact` | Support + sales inquiry | Medium |
| Help Center | `/help` | Self-service support | Medium |
| FAQ | `/faq` | FAQ + schema | High |
| Privacy Policy | `/privacy` | Legal compliance | Low |
| Terms of Service | `/terms` | Legal compliance | Low |
| Affiliate | `/affiliate` | Partner acquisition | Medium |
| Partners | `/partners` | B2B partnerships | Medium |
| Developers | `/developers` | API documentation | Medium |

## Page Structure Pattern

Every landing page follows this structure:

```text
src/app/(marketing)/[page]/
├── page.tsx              # Server component
├── loading.tsx           # Skeleton
├── layout.tsx            # Optional page-specific layout
└── metadata.ts           # SEO metadata + OG
```

## Conversion-Optimized Page Blueprint

Each marketing page includes these sections in order:

```
1. AnnouncementBar (optional) — limited-time offer
2. Header — navigation + CTA
3. Hero — headline + subheadline + CTA + social proof
4. Trust Signals — logos, certifications, security badges
5. Value Proposition — key benefits (3-column grid)
6. Detailed Features — deep dive into capabilities
7. How It Works — 3-step process
8. Testimonials — customer quotes + ratings
9. Pricing (if applicable) — plan comparison
10. FAQ — common questions (with schema)
11. CTA — final conversion prompt
12. Footer — links, social, newsletter
```

## Implementation Notes

- All pages are Server Components (no client JS for rendering)
- Images use Next/Image with WebP format
- Forms use Server Actions (no client-side API calls)
- Analytics events fire via `requestIdleCallback` (see Book 24)
- Structured data included on every page
- `noindex` for legal pages (privacy, terms)
