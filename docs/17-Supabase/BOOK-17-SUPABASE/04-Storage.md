# Storage

> Supabase Storage for file uploads — avatars, KYC documents, card assets, support attachments.

---

## Buckets

| Bucket | Visibility | Max Size | Allowed Types | Purpose |
|--------|-----------|----------|---------------|---------|
| `avatars` | Private | 2 MB | PNG, JPEG, WEBP | User profile pictures |
| `documents` | Private | 10 MB | PNG, JPEG, PDF | KYC documents, support attachments |
| `card-assets` | Public | 5 MB | PNG, WEBP, SVG | Card product images, icons |
| `support-files` | Private | 10 MB | PNG, JPEG, PDF, ZIP | Support ticket attachments |
| `public-assets` | Public | 10 MB | PNG, JPEG, WEBP, SVG | Landing page images, logos |

---

## Storage RLS Policies

### avatars (Private)

| Policy | SQL |
|--------|-----|
| Users read own avatar | `USING (auth.uid() = owner_id)` |
| Users upload own avatar | `WITH CHECK (auth.uid() = owner_id AND bucket_id = 'avatars')` |
| Users delete own avatar | `USING (auth.uid() = owner_id)` |
| Admins read all | `USING (fn_is_admin())` |

### documents (Private)

| Policy | SQL |
|--------|-----|
| Users read own documents | `USING (auth.uid() = owner_id)` |
| Users upload own document | `WITH CHECK (auth.uid() = owner_id AND bucket_id = 'documents')` |
| Users delete own | `USING (auth.uid() = owner_id)` |
| Admins read all | `USING (fn_is_admin())` |

### card-assets (Public)

| Policy | SQL |
|--------|-----|
| Anyone can read | `USING (bucket_id = 'card-assets')` |
| Admins can upload | `WITH CHECK (fn_is_admin() AND bucket_id = 'card-assets')` |
| Admins can delete | `USING (fn_is_admin())` |

### support-files (Private)

| Policy | SQL |
|--------|-----|
| Ticket participants read | `USING (auth.uid() IN (SELECT user_id FROM support_tickets WHERE id = get_ticket_id()))` |
| Ticket participants upload | `WITH CHECK (auth.uid() IN (SELECT user_id FROM support_tickets WHERE id = get_ticket_id()))` |
| Admins full access | `ALL USING (fn_is_admin())` |

### public-assets (Public)

| Policy | SQL |
|--------|-----|
| Anyone can read | `USING (bucket_id = 'public-assets')` |
| Admins can upload/delete | `ALL USING (fn_is_admin())` |

---

## Upload Flow

### Avatar Upload (Client → Server Action → Storage)

```
1. User selects file in browser
2. Client validates: size ≤ 2MB, type ∈ [PNG, JPEG, WEBP]
3. Server Action receives file (FormData)
4. Server validates again + sanitizes filename
5. Upload to avatars/{userId}/{uuid}.{ext}
6. Update profiles.avatar_url
7. Return public URL (or signed URL for private bucket)
```

### Document Upload

```
1. User selects document
2. Client validates: size ≤ 10MB, type ∈ [PNG, JPEG, PDF]
3. Server Action receives file + document_type
4. Upload to documents/{userId}/{documentType}/{uuid}.{ext}
5. Create record in kyc_documents table (future)
6. Return signed URL (private bucket)
```

---

## Signed URLs

For private buckets, generate time-limited signed URLs:

```ts
// Generate a signed URL for document access
async function getDocumentSignedUrl(path: string, expiresIn = 60) {
  const { data, error } = await supabase
    .storage
    .from('documents')
    .createSignedUrl(path, expiresIn * 60);  // seconds
  return data?.signedUrl;
}
```

Default expiry: 60 minutes. Max: 24 hours (86400 seconds).

---

## File Naming Convention

```
{bucket}/{userId}/{type}/{uuid}.{ext}

Examples:
avatars/abc123/portrait/550e8400-e29b-41d4-a716-446655440000.jpg
documents/abc123/passport/550e8400-e29b-41d4-a716-446655440000.pdf
card-assets/products/visa-platinum.png
support-files/ticket-456/screenshot.png
public-assets/logo.svg
```

---

## Image Optimization

- Avatars: resize to 256×256 on upload (Edge Function or client-side)
- Card assets: serve via Supabase Image Transformation (`?width=400&quality=80`)
- Public assets: use Next.js `<Image>` component with remote patterns

```ts
// Supabase image transformation URL
const optimizedUrl = supabase
  .storage
  .from('card-assets')
  .getPublicUrl('products/visa-platinum.png', {
    transform: { width: 400, height: 250, resize: 'contain', quality: 80 }
  });
```
