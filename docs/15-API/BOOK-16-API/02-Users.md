# Users API

> Base route: `/api/v1/users`
> All endpoints require JWT auth. Users can only access their own data.

---

## GET /api/v1/users/me

Get the current user's full profile.

**Auth:** JWT required

### Response `200`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "avatar_url": "https://...",
    "phone": "+1234567890",
    "country": "US",
    "email_verified": true,
    "kyc_status": "tier_1",
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-07-21T08:00:00Z"
  }
}
```

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| AUTH_002 | 401 | Session expired |

---

## PATCH /api/v1/users/me

Update the current user's profile.

**Auth:** JWT required

### Request
```json
{
  "full_name": "John Updated",
  "phone": "+1987654321",
  "avatar_url": "https://..."
}
```

### Validation
```ts
const updateProfileSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/).optional(),
  avatar_url: z.string().url().optional(),
});
```

### Response `200`
```json
{
  "success": true,
  "message": "Profile updated",
  "data": { "id": "uuid", "full_name": "John Updated", ... }
}
```

---

## GET /api/v1/users/preferences

Get the current user's preferences.

**Auth:** JWT required

### Response `200`
```json
{
  "success": true,
  "data": {
    "language": "en",
    "currency": "USD",
    "theme": "light",
    "notifications": {
      "email_order_confirmed": true,
      "email_payment_received": true,
      "email_shipping_update": true,
      "push_order_status": true,
      "push_promotions": false
    }
  }
}
```

---

## PATCH /api/v1/users/preferences

Update preferences.

**Auth:** JWT required

### Request
```json
{
  "theme": "dark",
  "notifications": {
    "push_promotions": true
  }
}
```

### Response `200`
```json
{
  "success": true,
  "message": "Preferences updated",
  "data": { ... }
}
```

---

## GET /api/v1/users/security

Get security settings.

**Auth:** JWT required

### Response `200`
```json
{
  "success": true,
  "data": {
    "mfa_enabled": false,
    "last_login": "2026-07-21T07:30:00Z",
    "last_login_ip": "192.168.x.x",
    "active_sessions": 2,
    "recent_activity": [
      { "action": "login", "ip": "...", "timestamp": "..." }
    ]
  }
}
```

Additional endpoints use Supabase Auth's built-in flows (change password, update email, MFA enrollment) — proxied through `/api/v1/auth/*`.

---

## DELETE /api/v1/users/me

Initiate account deletion (soft delete).

**Auth:** JWT required

### Request
```json
{
  "reason": "Switching to another provider",
  "password": "current_password"
}
```

### Response `200`
```json
{
  "success": true,
  "message": "Account deletion initiated. Your account will be permanently deleted in 30 days."
}
```

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| AUTH_001 | 401 | Incorrect password |
| USER_002 | 409 | Account has pending orders |
