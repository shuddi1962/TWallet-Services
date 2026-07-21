# Supabase Standards

## Database Access Rules

| Rule | Description |
|------|-------------|
| RLS on every table | Every table MUST have Row Level Security enabled (see Book 18) |
| Typed database | Use generated TypeScript types from `supabase gen types` |
| Server-side queries | All database queries run server-side (Server Components, Server Actions, Edge Functions) |
| Never service role on client | `service_role` key is server-side only; client uses `anon` key with RLS |
| Migration first | All schema changes use migrations, never ad-hoc DDL |
| Edge Functions for sensitive logic | Payment verification, admin operations use Edge Functions |

## Client Patterns

### Server Client (Server Components, Server Actions)

```typescript
import { createClient } from '@/lib/supabase/server';

export async function getOrders(userId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from('orders')
    .select('id, amount, status')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return data;
}
```

### Client Browser Client (Client Components)

```typescript
import { createClient } from '@/lib/supabase/client';

export function useOrders() {
  const supabase = createClient();
  // ...
}
```

### Edge Function Client

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);
```

## Query Patterns

```typescript
// ✅ Select specific columns only
await supabase.from('orders').select('id, amount, status');

// ❌ Never select *
await supabase.from('orders').select('*');

// ✅ Use filters
await supabase.from('orders').select().eq('user_id', userId).gte('created_at', startDate);

// ✅ Use pagination
await supabase.from('orders').select().limit(20).order('created_at', { ascending: false });

// ✅ Use count for pagination metadata
const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
```

## Migration Standards

```bash
# Create migration
supabase migration new <name>

# Apply migration
supabase db push

# Generate types after migration
supabase gen types typescript --local > src/types/supabase.ts
```

## Storage Rules

```typescript
// ✅ Generate signed URLs (not public URLs for private buckets)
const { data } = await supabase.storage
  .from('avatars')
  .createSignedUrl(`user_${userId}.webp`, 3600);

// ❌ Never expose private bucket URLs directly
```

## Edge Functions

```typescript
// Every Edge Function has JWT verification (unless public webhook)
Deno.serve(async (req) => {
  const authorization = req.headers.get('Authorization')!;
  const jwt = authorization.replace('Bearer ', '');
  const { data: { user } } = await supabase.auth.getUser(jwt);

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }
  // ...
});
```
