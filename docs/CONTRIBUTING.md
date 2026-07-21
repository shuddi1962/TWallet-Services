# Contributing to TWallet Services

## Prerequisites

- Node.js >= 20
- npm >= 10
- Supabase CLI (local development)
- Git

## Setup

```bash
git clone <repo-url>
cd twallet-services
npm install
cp .env.example .env.local
supabase start
supabase db push
npm run dev
```

## Coding Standards

- **TypeScript strict** — no `any`, no `@ts-ignore`
- **RSC-first** — prefer Server Components; only use client components when interactivity is required
- **Server Actions** — all mutations via Server Actions, never client-side fetch
- **Zod validation** — validate every input on the server
- **Error boundaries** — every route has a meaningful error state

## Commit Rules

Conventional commits:

```
feat: Add card ordering flow
fix: Handle empty wallet state on dashboard
docs: Update API contract for payment endpoint
refactor: Extract payment verification into Edge Function
test: Add RLS policy tests for orders table
```

Allowed types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `sec`

## Pull Request Process

1. Branch from `main`: `feat/your-feature`, `fix/your-bug`
2. Write tests for new functionality
3. Run `npm run typecheck && npm run lint && npm run test`
4. Create PR against `main`
5. PR title follows conventional commit format
6. PR description references the Book and task number
7. Request review from at least one maintainer

## Code Review Checklist

- [ ] Types correct (no `any`)
- [ ] No console.log / debug artifacts
- [ ] RLS policies cover the new query
- [ ] Error states handled (loading, empty, error, success)
- [ ] Accessibility (keyboard, screen reader, contrast)
- [ ] Tests cover the change
- [ ] Performance considerations (no N+1 queries)

## Testing

| Layer | Tool | Target Coverage |
|-------|------|-----------------|
| Unit | Vitest | 90% |
| Integration | Vitest + MSW | Business-critical |
| E2E | Playwright | 13 user journeys |
| A11y | axe-core | WCAG 2.1 AA |

## Documentation

Every feature must reference its Book. Changes to architecture require an ADR in `docs/adr/`.

## Deployment

- Feature branches → Vercel preview
- `main` → Staging (auto-deployed)
- Release tags (`v*.*.*`) → Production
- Supabase migrations applied via CLI, never ad-hoc DDL

## Questions?

See `docs/FAQ.md` or open a GitHub Discussion.
