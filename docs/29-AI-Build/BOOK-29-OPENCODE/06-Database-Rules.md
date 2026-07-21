# Database Rules

## Core Rules

| Rule | Description |
|------|-------------|
| Use Supabase | PostgreSQL managed by Supabase |
| Migration first | Every schema change is a versioned migration |
| Never modify production DB manually | Only apply migrations through CLI |
| Row Level Security | RLS enabled on every table — no exceptions |
| Generate types | Run `supabase gen types` after every migration |
| Use indexes | Every query predicate column indexed |
| Use foreign keys | All relationships enforced at DB level |
| Document migrations | Each migration has a description in the filename |

## Migration Workflow

```bash
# 1. Create migration
supabase migration new <descriptive-name>

# 2. Write SQL in the migration file

# 3. Apply locally
supabase db push

# 4. Generate Typescript types
supabase gen types typescript --local > src/types/supabase.ts

# 5. Commit migration + types together
```

## Query Rules

```typescript
// ✅ Select only needed columns
await supabase.from('orders').select('id, amount, status');

// ❌ Never SELECT *
await supabase.from('orders').select('*');

// ✅ Use filters at database level
await supabase.from('orders').select().eq('user_id', userId);

// ✅ Use cursor pagination
await supabase.from('orders').select().limit(20).order('created_at', { ascending: false });

// ✅ Use RLS for authorization (never trust userId from client)
// RLS policy: user_id = auth.uid()
```

## RLS Rules

```sql
-- ✅ Correct RLS pattern
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- ❌ Never disable RLS
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- ❌ Never use service_role on client
-- service_role key is server-side only
```

## Storage Rules

```typescript
// ✅ Generate signed URLs for private buckets
const { data } = await supabase.storage
  .from('avatars')
  .createSignedUrl('file.webp', 3600);

// ❌ Never expose private bucket public URLs
```

## Edge Function Rules

```typescript
// ✅ JWT verification in every Edge Function
const authorization = req.headers.get('Authorization')!;
const jwt = authorization.replace('Bearer ', '');
const { data: { user } } = await supabase.auth.getUser(jwt);

// ❌ Never skip auth check
// Deno.serve(async (req) => { ... no auth check ... });
```
