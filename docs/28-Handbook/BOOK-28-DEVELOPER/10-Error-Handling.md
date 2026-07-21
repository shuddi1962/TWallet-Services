# Error Handling Standards

## Golden Rules

| Rule | Description |
|------|-------------|
| Never swallow errors | Every error MUST be logged or handled |
| Never expose secrets | Error messages to users must not reveal internals |
| Never show stack traces to users | Return user-friendly messages |
| Always log with context | Include requestId, userId, action |
| Always return consistent error shapes | See API error format below |

## Error Handling Patterns

### Server Actions

```typescript
'use server';

export async function createOrder(formData: FormData): Promise<ActionResult> {
  try {
    const validated = validateFormData(formData);
    const order = await db.insert(orders).values(validated).returning();
    revalidatePath('/app/orders');
    return { success: true, data: order[0] };
  } catch (error) {
    log('ERROR', 'orders', 'Failed to create order', { error });
    return { success: false, error: 'Unable to create order. Please try again.' };
  }
}
```

### API Routes (Route Handlers)

```typescript
export async function GET(req: Request) {
  try {
    const data = await fetchData();
    return Response.json({ data });
  } catch (error) {
    log('ERROR', 'api', 'Request failed', { error, url: req.url });
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 },
    );
  }
}
```

### Edge Functions

```typescript
Deno.serve(async (req) => {
  try {
    const result = await verifyPayment(await req.json());
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    log('ERROR', 'verify-payment', 'Verification failed', { error });
    return new Response(
      JSON.stringify({ error: { code: 'VERIFICATION_FAILED', message: 'Payment verification failed' } }),
      { status: 500 },
    );
  }
});
```

### Client-Side

```typescript
export async function submitOrder(data: OrderFormData) {
  try {
    const result = await createOrder(data);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success('Order created!');
    router.refresh();
  } catch (error) {
    log('ERROR', 'client', 'Order submission failed', { error });
    toast.error('Something went wrong. Please try again.');
  }
}
```

## Error Response Format

All API errors follow a consistent shape:

```typescript
interface ApiError {
  code: string;        // Machine-readable error code
  message: string;     // Human-readable error message
  details?: unknown;   // Additional error details (optional)
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `PAYMENT_FAILED` | 502 | Payment verification failed |
| `EXTERNAL_ERROR` | 502 | External service error |

## Logging Errors

```typescript
import { log } from '@/lib/logger';

try {
  // ...
} catch (error) {
  log('ERROR', 'service-name', 'Descriptive message', {
    error: error instanceof Error ? { message: error.message, name: error.name } : error,
    requestId,
    userId,
    action: 'what_was_happening',
  });
}
```

## What NOT to Do

```typescript
// ❌ Swallowing errors
try { riskyOperation(); } catch {}

// ❌ Exposing internals to users
catch (error) {
  return { error: `Database query failed: ${error.message}` };
}

// ❌ Showing stack traces
catch (error) {
  return { error: error.stack };
}

// ✅ Correct
catch (error) {
  log('ERROR', 'service', 'Operation failed', { error });
  return { error: 'Unable to complete operation. Please try again.' };
}
```
