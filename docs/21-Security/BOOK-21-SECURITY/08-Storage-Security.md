# Storage Security

## Bucket Classification

| Bucket | Type | Contents |
|--------|------|----------|
| `avatars` | Private | User profile photos |
| `documents` | Private | KYC documents, identification |
| `support-files` | Private | Ticket attachments |
| `card-assets` | Public | Card art, brand logos |
| `public-assets` | Public | Marketing images, static resources |

## Private Bucket Access

| Actor | Permission | Policy |
|-------|------------|--------|
| File owner | Read, Write, Delete | `auth.uid() = folder name` |
| Admin | Read | `current_user_is_admin()` |
| Public | No access | — |

## Public Bucket Access

| Actor | Permission |
|-------|------------|
| Anyone | Read (unauthenticated) |
| Admin | Write, Delete |

## Validation

| Check | Implementation |
|-------|----------------|
| Allowed MIME types | Bucket-level `allowed_mime_types` |
| Max file size | Bucket-level `file_size_limit` |
| Malicious content | Reject executables, scripts |
| Path traversal | Bucket policy prevents `../` |
| Virus scanning | Future: server-side scan before finalizing |

## Signed URLs

Private files use Supabase signed URLs with expiration:

```ts
const { data } = await supabase.storage
  .from("documents")
  .createSignedUrl(`${userId}/kyc.pdf`, 3600) // 1 hour
```

## Security Rules

| Rule | Reason |
|------|--------|
| No public write to private buckets | Prevents data exposure |
| Signed URLs expire | Limits exposure window |
| Bucket policies match RLS | Consistent auth model |
| File size limits enforced | Prevents storage abuse |
