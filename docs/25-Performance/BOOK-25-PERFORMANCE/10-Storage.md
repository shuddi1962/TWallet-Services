# Storage Performance

## Optimization Techniques

### Signed URLs

All user-accessible storage is served via signed URLs with expiration. This avoids exposing private storage buckets and reduces origin load.

```typescript
// Generate short-lived signed URL
const { data } = await supabase
  .storage
  .from('avatars')
  .createSignedUrl(`user_${userId}.webp`, 3600, {
    transform: { width: 200, height: 200, resize: 'cover', format: 'webp', quality: 80 },
  });
```

### Compressed Uploads

Compress images before upload to reduce storage costs and transfer time:

```typescript
async function uploadAvatar(file: File) {
  const compressed = await compressImage(file, { maxWidth: 1024, quality: 0.8 });
  const { data } = await supabase.storage.from('avatars').upload(
    `user_${userId}.webp`,
    compressed,
    { contentType: 'image/webp', upsert: true },
  );
  return data;
}
```

### Public Cache Headers

For public buckets (e.g., card catalog images), set cache headers:

```typescript
// Supabase Storage → CDN caching
// Public bucket files are cached at CDN edge by default
// Set max-age via Supabase dashboard or policy
```

### Private Buckets

Private buckets (user uploads, documents) use signed URLs with short expiration (1 hour or less). Never expose private bucket URLs directly.

### Automatic Cleanup

Implement cleanup policies for unused storage objects:

```sql
-- Scheduled cleanup via pg_cron (see Book 18)
SELECT cron.schedule(
  'cleanup-expired-uploads',
  '0 3 * * *',
  $$
  DELETE FROM storage.objects
  WHERE bucket_id = 'temp-uploads'
    AND created_at < NOW() - INTERVAL '24 hours';
  $$
);
```

### Storage Bucket Strategy

| Bucket | Visibility | Cache | Cleanup |
|--------|------------|-------|---------|
| `avatars` | Private (signed URL) | 1 hour | Never |
| `card-images` | Public (CDN) | 1 year | On card deactivation |
| `documents` | Private (signed URL) | 1 hour | 90 days |
| `temp-uploads` | Private (signed URL) | None | 24 hours |
| `company-assets` | Public (CDN) | 1 year | Manual |

### CDN Edge Caching

Vercel's Edge Network automatically caches responses at 30+ global locations. For Supabase Storage, files served through Vercel (via signed URLs) are cached at the edge based on `Cache-Control` headers.
