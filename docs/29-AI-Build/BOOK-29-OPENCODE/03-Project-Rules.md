# Project Rules

## Always

| Rule | Description |
|------|-------------|
| Read documentation first | Check the relevant Book before writing any code |
| Use TypeScript strict mode | `strict: true`, no `any`, no `@ts-ignore` |
| Generate reusable components | Check `src/components/ui/` before creating new ones |
| Write production-ready code | Handle errors, loading states, empty states, edge cases |
| Follow folder structure | Feature-based architecture in `src/features/` |
| Follow naming conventions | PascalCase for components, camelCase for functions, snake_case for DB |
| Create responsive layouts | Mobile-first, tested at 320px, 768px, 1024px, 1440px |
| Optimize performance | Server Components by default, dynamic imports, Suspense |
| Write accessible components | WCAG 2.1 AA, keyboard navigation, screen reader support |
| Use Server Components by default | Only add `"use client"` when browser APIs or interactivity required |
| Use Server Actions for mutations | No client-side fetch to API routes for mutations |
| Document everything | READMEs, JSDoc, changelog |
| Write tests | Unit + integration + E2E for every feature |
| Update documentation | Documentation updated in the same PR as code |

## Never

| Rule | Description |
|------|-------------|
| Never use `any` | Use `unknown` with type guards |
| Never disable TypeScript | No `@ts-ignore`, no `@ts-nocheck` |
| Never disable ESLint | No `eslint-disable` without justification |
| Never disable RLS | Every table MUST have RLS |
| Never store secrets in client | Service role keys are server-side only |
| Never store private keys | Platform never holds user private keys |
| Never request seed phrases | No input field for recovery phrases |
| Never duplicate components | Check existing components first |
| Never hardcode values | Use design tokens, constants, env vars |
| Never hardcode colors | Use Tailwind theme tokens |
| Never ignore accessibility | WCAG 2.1 AA minimum |
| Never skip validation | Every input validated with Zod |
| Never ignore documentation | If documentation exists, it wins |
| Never create unnecessary dependencies | Check existing stack first |

## Coding Philosophy

| Prefer | Over |
|--------|------|
| Composition | Inheritance |
| Reuse | Duplication |
| Server Components | Client Components |
| Server Actions | Custom APIs |
| Simple solutions | Complex solutions |
| Performance | Premature optimization |
| Documentation | Guesswork |
| Quality | Speed |
