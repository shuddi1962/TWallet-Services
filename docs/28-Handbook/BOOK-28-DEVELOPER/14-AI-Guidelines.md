# AI-Assisted Development Guidelines

## Principles for AI Coding

| Principle | Description |
|-----------|-------------|
| Documentation first | Read the relevant Book and docs before writing code |
| Never guess APIs | Check imports, existing code, and docs before using a library |
| Never skip validation | Every user input MUST be validated (Zod) |
| Generate typed code | No `any`, no unsafe casts |
| Use existing components | Check `src/components/ui/` before creating new ones |
| Keep architecture consistent | Follow established patterns (Server Components, Server Actions) |
| Update documentation | Documentation is updated in the same PR as code |
| Write tests | Every feature includes tests (unit, integration, E2E) |

## AI Coding Workflow

```text
1. Read the relevant Book documentation
2. Understand the existing code patterns (read neighboring files)
3. Plan the implementation (what files to create/modify)
4. Write code following all standards in this handbook
5. Run lint + typecheck
6. Write tests
7. Run tests
8. Update documentation
9. Create PR
```

## AI DOs

- Read `AGENTS.md` for build commands and project rules
- Check `src/components/ui/` for existing components before creating new ones
- Check imports in neighboring files before importing a library
- Use the same library versions as existing code (check `package.json`)
- Follow the error handling patterns in `10-Error-Handling.md`
- Write TypeScript types first, then implementation
- Keep files focused — one component/function per file
- Use feature-based structure for new features

## AI DON'Ts

- Don't create duplicate components that already exist
- Don't hardcode secrets or environment variables
- Don't use `any` type
- Don't disable TypeScript (`@ts-ignore`, `@ts-nocheck`)
- Don't add console.log in production code
- Don't create files outside the established project structure
- Don't modify existing component APIs without updating docs
- Don't add new dependencies without checking existing ones first

## Code Quality Gates

Before completing a task, verify:

```text
□ TypeScript compiles (npm run typecheck)
□ Lint passes (npm run lint)
□ Tests pass (npm run test)
□ Build succeeds (npm run build)
□ No new warnings introduced
□ Documentation updated
□ Follows naming conventions
□ Follows project structure
```

## Documentation Updates

When AI modifies code, it must also update:

- Component docs if component API changes (`docs/components/`)
- Database docs if schema changes (`docs/database/`)
- Analytics docs if events change (`docs/analytics/`)
- Tests that cover the changed code
- Changelog entry for notable changes

## Context Awareness

AI should be aware of:

- **Project state** — Books 01–27 complete, documentation phase done
- **Architecture** — Next.js 15 App Router, Supabase, Vercel, TypeScript strict
- **Key patterns** — RSC-first, Server Actions, RLS-everywhere, cursor pagination
- **Existing components** — 28 UI components in `src/components/ui/`
- **Database** — 19 tables, 11 enums, 65 indexes, RLS on all tables
- **Auth** — WalletConnect v2 + Supabase Auth, 3-client pattern
