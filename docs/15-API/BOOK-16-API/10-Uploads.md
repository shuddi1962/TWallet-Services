# Uploads API

> Base route: `/api/v1/upload`
> File uploads via Supabase Storage. Rate limited to 10 req/min. Max file size: 10 MB (documents) / 2 MB (avatars).

---

## POST /api/v1/upload/avatar

Upload a user avatar image.

**Auth:** JWT required

### Request
`multipart/form-data`

| Field | Type | Max Size | Accepted Types |
|-------|------|----------|----------------|
| file | image | 2 MB | PNG, JPEG, WEBP |

### Response `201`
```json
{
  "success": true,
  "message": "Avatar uploaded",
  "data": {
    "url": "https://xxx.supabase.co/storage/v1/object/public/avatars/user-id/file.jpg",
    "path": "user-id/file.jpg",
    "size_bytes": 153600,
    "mime_type": "image/jpeg"
  }
}
```

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| UPLOAD_001 | 400 | Invalid file type |
| UPLOAD_002 | 400 | File too large |
| UPLOAD_003 | 422 | No file provided |

---

## POST /api/v1/upload/document

Upload a KYC or support document.

**Auth:** JWT required

### Request
`multipart/form-data`

| Field | Type | Max Size | Accepted Types |
|-------|------|----------|----------------|
| file | file | 10 MB | PNG, JPEG, PDF |
| document_type | string | — | `passport`, `drivers_license`, `id_card`, `proof_of_address`, `other` |

### Response `201`
```json
{
  "success": true,
  "message": "Document uploaded",
  "data": {
    "url": "https://xxx.supabase.co/storage/v1/object/public/documents/user-id/doc.pdf",
    "path": "user-id/doc.pdf",
    "size_bytes": 1048576,
    "mime_type": "application/pdf",
    "document_type": "passport",
    "expires_at": "2026-08-21T00:00:00Z"
  }
}
```

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| UPLOAD_001 | 400 | Invalid file type |
| UPLOAD_002 | 400 | File too large |
| UPLOAD_004 | 400 | Invalid document type |

---

## DELETE /api/v1/upload/{id}

Delete an uploaded file.

**Auth:** JWT required (must own the file)

### Response `200`
```json
{
  "success": true,
  "message": "File deleted"
}
```

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| UPLOAD_005 | 404 | File not found |

---

## POST /api/v1/upload/generate-url

Generate a signed URL for temporary access to a private file.

**Auth:** JWT required (must own the file)

### Request
```json
{
  "path": "user-id/document.pdf",
  "expires_in_minutes": 60
}
```

### Response `200`
```json
{
  "success": true,
  "data": {
    "signed_url": "https://xxx.supabase.co/storage/v1/object/sign/documents/user-id/doc.pdf?token=...",
    "expires_at": "2026-07-21T16:00:00Z"
  }
}
```
