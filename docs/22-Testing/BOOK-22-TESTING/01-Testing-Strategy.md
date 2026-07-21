# Testing Strategy

## Testing Pyramid

```
         /\ 
        /  \         E2E (Playwright)
       /    \        13 critical user journeys
      /------\
     /        \      Integration (Vitest + MSW)
    /          \     Components + API + DB
   /------------\
  /              \   Unit (Vitest)
 /                \  Utilities, validators, hooks, helpers
/------------------\
```

## Test Distribution

| Layer | % | Tools | Run Frequency |
|-------|---|-------|---------------|
| Unit | 60% | Vitest | Every commit |
| Integration | 25% | Vitest + MSW | Every PR |
| E2E | 10% | Playwright | Every PR + before release |
| Manual | 5% | QA team | Before release |

## Required Coverage Areas

- Business logic (order state machine, payment verification)
- API routes (65+ endpoints)
- UI components (28+ components)
- Forms (registration, checkout, support)
- Authentication flows (login, register, reset)
- Order lifecycle (create → pay → verify → ship → deliver)
- Payment verification (13-step Edge Function)
- Wallet connections (connect, disconnect, switch network)
- Admin functions (CRUD, role management, reports)
- RLS policies (19 tables)

## Test File Convention

```
src/
├── components/ui/button/button.tsx
├── components/ui/button/button.test.tsx    # Unit test
├── lib/validators.ts
├── lib/validators.test.ts                  # Unit test
├── app/api/orders/route.ts
├── app/api/orders/route.test.ts            # Integration test
└── e2e/
    ├── auth.spec.ts                         # E2E test
    ├── orders.spec.ts
    └── payments.spec.ts
```

## CI Pipeline

```
Lint → TypeCheck → Unit Tests → Integration Tests → Build → E2E Tests → Deploy Preview
```
