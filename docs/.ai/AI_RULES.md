# AI Rules — Mandatory Coding Rules

## 1. TypeScript Rules

- `strict: true` — always
- No `any` — use `unknown` with type guards
- No `@ts-ignore` or `@ts-nocheck`
- Prefer `interface` for object types, `type` for unions
- All props and return types must be explicitly typed

## 2. Component Rules

- Server Component by default — only add `"use client"` when required
- Never create a component that already exists in `src/components/ui/`
- One component per file
- Every component handles loading, error, and empty states
- All interactive elements must be keyboard accessible

## 3. Naming Conventions

- Components: PascalCase (`WalletCard.tsx`)
- Hooks: camelCase with `use` prefix (`useWallet.ts`)
- Functions/variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Database tables/columns: snake_case
- Events: snake_case (`user_registered`)

## 4. Backend Rules

- All mutations use Server Actions (no client-side API fetch for mutations)
- All database queries run server-side
- RLS on every table — never disable
- Service role key is server-only — never expose to client
- All input validated with Zod on the server

## 5. Security Requirements

- Never store or request private keys/seed phrases
- Never expose secrets in client code
- CSP headers with WalletConnect allowlist
- Secure cookies (`httpOnly`, `secure`, `sameSite: lax`)
- Rate limiting on all endpoints

## 6. Performance Targets

- LCP < 2.5s, CLS < 0.1, INP < 200ms
- Lighthouse Performance ≥ 95
- Bundle JS < 250 KB initial load
- API p95 < 500ms

## 7. Documentation Requirements

- Documentation updated in the same PR as code
- Every public API has JSDoc
- Every feature has a README or Book entry
- Changelog updated for every notable change

## 8. Testing Requirements

- 90% overall coverage target
- Unit tests for all utilities and Server Actions
- Integration tests for all API endpoints
- E2E tests for all critical user flows
- Accessibility check for all UI components

## 9. Git Rules

- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `perf:`, `chore:`
- Feature branches from `development`
- PR to `development` with squash merge
- Release branches from `development` to `main`

## 10. Stack Permanence

Never introduce:
- Another database (stick with Supabase PostgreSQL)
- Another CSS framework (stick with Tailwind)
- Redux (use Server Components + Server Actions)
- Firebase (use Supabase)
- Express (use Next.js + Edge Functions)
- MongoDB (use PostgreSQL)
- Prisma (use Supabase JS client)
