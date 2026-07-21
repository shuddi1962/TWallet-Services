# Testing Rules

## Testing Requirements

Every new feature MUST include:

| Test Type | Requirement | Target |
|-----------|-------------|--------|
| Unit tests | Required for all new logic | 90% coverage |
| Integration tests | Required for API/Server Actions | Critical flows |
| E2E tests | Required for critical user flows | 13 journeys (see Book 22) |
| Accessibility check | Required for all UI components | WCAG 2.1 AA |
| Performance review | Required for all features | Lighthouse budget |

## Test-Driven Development

When implementing a feature:

1. Write tests first (or at minimum, plan what to test)
2. Implement the feature
3. Verify all tests pass
4. Add edge case tests

## Unit Testing Rules

### What to Unit Test

- Utility functions
- Validation schemas (Zod)
- Data transformations
- State machines
- React hooks (complex logic)
- Server Actions (with mocked DB)

### What NOT to Unit Test

- Simple components (covered by integration/E2E)
- Third-party library internals
- CSS/styling
- Configuration files

### Naming

```typescript
// ✅ Descriptive test names
describe('formatCurrency', () => {
  it('formats USD correctly', () => { ... });
  it('handles zero values', () => { ... });
  it('throws on negative amounts', () => { ... });
});

// ❌ Vague names
describe('formatCurrency', () => {
  it('works', () => { ... });
  it('test', () => { ... });
});
```

## Integration Testing Rules

### What to Integration Test

- API endpoints
- Server Actions end-to-end
- Database queries with RLS
- Supabase Edge Function calls
- Auth flows

### Patterns

```typescript
// Integration test for Server Action
import { createOrder } from './actions';
import { createTestUser, createTestCard } from '@/test/fixtures';

it('creates an order for authenticated user', async () => {
  const user = await createTestUser();
  const card = await createTestCard();
  const formData = new FormData();
  formData.set('cardProductId', card.id);

  const result = await createOrder(formData);

  expect(result.success).toBe(true);
  expect(result.data).toMatchObject({ status: 'pending' });
});
```

## E2E Testing Rules

### Critical Journeys

- User registration and login
- Wallet connection
- Card ordering with payment
- Admin order management
- Support ticket creation
- Profile update
- Settings change

## Test Data

- Use factory functions for test fixtures
- Clean up test data after each test
- Use a separate test database (not production)
- Seed data is version-controlled in `supabase/seed.sql`

## Running Tests

```bash
# Unit + integration tests
npm run test

# E2E tests
npm run test:e2e

# Specific test file
npm run test -- path/to/test.ts

# Test coverage
npm run test -- --coverage
```

## Coverage Targets

| Area | Target |
|------|--------|
| Overall codebase | 90% |
| Utilities | 100% |
| Server Actions | 100% |
| Validation schemas | 100% |
| Components | 80% |
| Hooks | 90% |
