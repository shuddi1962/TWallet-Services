# Project Structure

## Top-Level Directory

```text
twallet-services/
├── src/                    # Application source code
│   ├── app/                # Next.js App Router pages
│   ├── components/         # Shared UI components
│   ├── features/           # Feature-based modules
│   ├── hooks/              # Shared React hooks
│   ├── lib/                # Utility libraries
│   ├── services/           # Shared services
│   ├── types/              # Global TypeScript types
│   ├── utils/              # Pure utility functions
│   ├── styles/             # Global styles
│   ├── constants/          # Application constants
│   ├── config/             # Configuration files
│   ├── providers/          # React context providers
│   └── middleware.ts        # Next.js middleware
├── supabase/               # Supabase Edge Functions + migrations
├── packages/               # Monorepo packages (ui/)
├── public/                 # Static assets
├── design/                 # Design tokens (human-readable)
├── design-tokens/          # Design tokens (machine JSON)
├── docs/                   # Documentation
│   ├── components/         # Component documentation
│   ├── database/           # Database documentation
│   └── analytics/          # Analytics event catalog
├── 00-Project/             # Project-level docs
├── 01-Foundation/          # Foundation books
├── ...                     # Book folders (02–30)
├── ops/                    # Operations runbooks
├── observability/          # Observability runbooks
├── qa/                     # QA enterprise docs
├── security/               # Security enterprise docs
└── AGENTS.md               # AI agent instructions
```

## Feature-Based Architecture

Related code for a feature lives together in `src/features/{feature}/`:

```text
src/features/
├── auth/
│   ├── components/         # Auth-specific components
│   ├── hooks/              # Auth-specific hooks
│   ├── services/           # Auth API calls
│   ├── types/              # Auth-specific types
│   └── utils/              # Auth-specific utilities
├── wallet/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── utils/
├── orders/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
├── payments/
│   ├── components/
│   ├── services/
│   └── types/
├── cards/
│   ├── components/
│   └── services/
├── admin/
│   ├── components/
│   └── services/
└── support/
    ├── components/
    └── services/
```

## App Router Structure

```text
src/app/
├── (marketing)/            # Public marketing pages (SEO)
│   ├── page.tsx            # Homepage
│   ├── pricing/page.tsx
│   ├── blog/
│   └── ...
├── (auth)/                 # Authentication pages
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── callback/page.tsx
├── app/                    # Customer dashboard (auth required)
│   ├── dashboard/page.tsx
│   ├── orders/page.tsx
│   └── ...
├── admin/                  # Admin portal (admin role required)
│   ├── dashboard/page.tsx
│   └── ...
├── api/                    # Route Handlers
│   ├── health/route.ts
│   ├── ready/route.ts
│   ├── webhooks/route.ts
│   └── og/route.tsx
├── layout.tsx              # Root layout
├── not-found.tsx           # 404 page
└── error.tsx               # Error boundary
```

## Key Rules

- One component per file (except tiny helpers)
- Feature code lives in `src/features/` — never in `src/app/`
- Shared UI components live in `src/components/ui/`
- Shared hooks live in `src/hooks/`
- Pure utilities live in `src/utils/` (no React, no side effects)
- Services (API calls) live in `src/services/` or `src/features/{name}/services/`
- Types shared across features live in `src/types/`
- Constants (enums, magic strings) live in `src/constants/`
