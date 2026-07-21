# Testing Rules

## Every Feature MUST Include

| Test Type | Requirement | Tool |
|-----------|-------------|------|
| Unit tests | Required for all new logic | Vitest |
| Integration tests | Required for Server Actions, API routes | Vitest + MSW |
| E2E tests | Required for critical user flows | Playwright |
| Accessibility check | Required for all UI components | axe-core + manual |
| Type check | Required — must pass `npm run typecheck` | TypeScript |
| Lint | Required — must pass `npm run lint` | ESLint |
| Build verification | Required — must pass `npm run build` | Next.js |

## Critical Flows for E2E (Playwright)

| Journey | Description |
|---------|-------------|
| User registration | Sign up, verify email, log in |
| Wallet connection | Connect MetaMask, disconnect |
| Card ordering | Browse cards, select, order |
| Crypto payment | Submit payment, confirm on-chain |
| Dashboard | View balance, transactions |
| Admin order management | View orders, update status |
| Support ticket | Create ticket, receive reply |
| Profile update | Change name, avatar |
| Settings | Update preferences |
| Password reset | Request reset, set new password |
| Logout | Log out, verify redirect |
| Mobile responsive | All key flows on mobile viewport |
| Accessibility | All key flows with screen reader |

## Test Structure

```text
src/
├── __tests__/
│   ├── components/       # Component tests
│   ├── hooks/            # Hook tests
│   ├── services/         # Service tests
│   ├── utils/            # Utility tests
│   └── actions/          # Server Action tests
└── e2e/                  # Playwright tests
    ├── auth.spec.ts
    ├── wallet.spec.ts
    ├── orders.spec.ts
    └── ...
```

## Coverage Targets

| Area | Target |
|------|--------|
| Overall | 90% |
| Utilities | 100% |
| Server Actions | 100% |
| Validation schemas | 100% |
| Components | 80% |
| Hooks | 90% |

## Testing Commands

```bash
npm run test         # Unit + integration tests
npm run test:e2e     # Playwright E2E tests
npm run typecheck    # TypeScript check
npm run lint         # ESLint
npm run build        # Production build
```

## Definition of "Tested"

A feature is considered fully tested when:

1. All success paths have tests
2. All error paths have tests
3. All edge cases have tests
4. Accessibility check passes
5. TypeScript compiles clean
6. Lint passes
7. Build succeeds
