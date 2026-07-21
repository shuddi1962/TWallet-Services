# API Rules

## Route Handlers (Next.js API Routes)

| Rule | Description |
|------|-------------|
| Validate every request | All input validated with Zod |
| Validate every response | Consistent response shape |
| Return consistent errors | `{ error: { code, message } }` |
| Log failures | Structured JSON logging |
| Never expose secrets | Error messages don't reveal internals |
| Server-side authorization | Check auth + role + ownership |
| Support pagination | Cursor-based for list endpoints |
| Rate limiting | Applied to all endpoints |

## Server Actions

```typescript
'use server';

import { z } from 'zod';

const createOrderSchema = z.object({
  cardProductId: z.string().uuid(),
  amount: z.number().positive(),
});

export async function createOrder(formData: FormData) {
  // 1. Get current user (server-side auth)
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  // 2. Validate input
  const validated = createOrderSchema.parse({
    cardProductId: formData.get('cardProductId'),
    amount: Number(formData.get('amount')),
  });

  // 3. Execute with error handling
  try {
    const order = await db.insert(orders).values({ ...validated, userId: user.id }).returning();
    revalidatePath('/app/orders');
    return { success: true, data: order[0] };
  } catch (error) {
    log('ERROR', 'orders', 'Failed to create order', { error });
    return { success: false, error: 'Unable to create order.' };
  }
}
```

## Response Format

```typescript
// Success
{ data: T }

// List with pagination
{ data: T[], nextCursor: string | null }

// Error
{ error: { code: string, message: string, details?: unknown } }
```

## Error Codes

| Code | HTTP Status | When |
|------|-------------|------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `PAYMENT_FAILED` | 502 | Payment verification failed |

## Webhook Rules

```typescript
// ✅ Verify webhook signature
const signature = req.headers.get('x-webhook-signature');
const payload = await req.text();
const isValid = verifySignature(payload, signature, WEBHOOK_SECRET);

if (!isValid) {
  return new Response('Invalid signature', { status: 401 });
}
```
