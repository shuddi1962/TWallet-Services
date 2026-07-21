# Task 001: Project Setup

## Goal
Initialize the Next.js 15 monorepo with TypeScript strict, Tailwind CSS v4, and all foundational tooling.

## Requirements
- Next.js 15 App Router with TypeScript
- pnpm workspaces monorepo
- TypeScript strict mode enabled
- Tailwind CSS v4 configured
- ESLint with security rules
- Prettier for formatting
- .gitignore, .env.example, .editorconfig

## Dependencies
- Node.js >= 20
- npm >= 10 (or pnpm)

## Files to Create
```
/
├── package.json
├── tsconfig.json (strict)
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── .env.example
├── .editorconfig
├── apps/
│   └── web/
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       └── postcss.config.mjs
└── packages/
    └── ui/
        ├── package.json
        ├── tsconfig.json
        └── tailwind.config.ts
```

## References
- `docs/BOOK-01/BOOK_01_PROJECT_FOUNDATION.md`
- `docs/BOOK-12/BOOK_12_SYSTEM_ARCHITECTURE.md`
- `docs/ARCHITECTURE.md`

## Steps
1. Create monorepo with pnpm workspaces
2. Configure TypeScript strict (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
3. Install Next.js 15, React 19, Tailwind v4
4. Configure ESLint with `@typescript-eslint/strict` + `eslint-plugin-security`
5. Configure Prettier with consistent settings
6. Set up .gitignore (node_modules, .next, env, coverage)
7. Create .env.example with all required vars (placeholder values)
8. Verify: `npm run lint` passes, `npm run typecheck` passes

## Acceptance Criteria
- [ ] `npm run dev` starts without errors
- [ ] `npm run typecheck` passes with strict mode
- [ ] `npm run lint` passes with security rules
- [ ] TypeScript strict mode enforced (no `any`, no `@ts-ignore`)
- [ ] Tailwind CSS hot reload works

## Testing
- Smoke test: App renders at localhost:3000
- Config test: All tooling reports correct versions

## Documentation
- Update README.md with setup instructions
- Commit initial structure
