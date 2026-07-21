# Unit Tests

> **Framework:** Vitest | **Location:** `src/` co-located `*.test.ts` files

## What to Test

- Server Actions (all inputs, outputs, error cases)
- Zod validation schemas
- Utility functions (pagination, formatting, crypto)
- UI components (render, variants, click handlers)
- State machines (order status transitions, payment status transitions)

## Pattern

```ts
import { describe, it, expect } from 'vitest';
import { registerSchema } from '@/lib/zod/schemas';

describe('registerSchema', () => {
  it('accepts valid input', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'SecurePass123',
      full_name: 'John Doe',
      accept_terms: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects weak password', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'weak',
      full_name: 'John Doe',
      accept_terms: true,
    });
    expect(result.success).toBe(false);
  });

  it('rejects unaccepted terms', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'SecurePass123',
      full_name: 'John Doe',
      accept_terms: false,
    });
    expect(result.success).toBe(false);
  });
});
```

## Coverage Target

| Area | Target |
|------|--------|
| Zod schemas | 100% |
| Server Actions | 90% |
| Utility functions | 100% |
| UI components | 80% |
| State machines | 100% |
