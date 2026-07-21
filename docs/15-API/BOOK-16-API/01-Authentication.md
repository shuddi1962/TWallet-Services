# Authentication API

> Base route: `/api/v1/auth`
> Auth endpoints are rate-limited to 10 req/min. No JWT required for register, login, forgot-password.

---

## POST /api/v1/auth/register

Register a new user account.

**Auth:** None

### Request
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "phone": "+1234567890",
  "country": "US",
  "accept_terms": true
}
```

### Validation (Zod)
```ts
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  full_name: z.string().min(2).max(100),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/).optional(),
  country: z.string().length(2),
  accept_terms: z.literal(true),
});
```

### Response `201`
```json
{
  "success": true,
  "message": "Registration successful. Verify your email.",
  "data": {
    "user": { "id": "uuid", "email": "user@example.com", "full_name": "John Doe" },
    "session": { "access_token": "jwt...", "refresh_token": "..." }
  }
}
```

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| AUTH_003 | 409 | Email already registered |
| AUTH_004 | 422 | Password too weak |
| AUTH_005 | 422 | Terms not accepted |
| VAL_001 | 422 | Invalid input |

---

## POST /api/v1/auth/login

Authenticate an existing user.

**Auth:** None

### Request
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "remember_me": false
}
```

### Response `200`
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "full_name": "...", "avatar_url": "..." },
    "session": {
      "access_token": "jwt...",
      "refresh_token": "...",
      "expires_at": "2026-07-22T00:00:00Z"
    }
  }
}
```

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| AUTH_001 | 401 | Invalid credentials |
| AUTH_006 | 401 | Email not verified |
| AUTH_007 | 429 | Too many attempts (lockout) |

---

## POST /api/v1/auth/logout

Destroy the current session.

**Auth:** JWT required

### Response `200`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## POST /api/v1/auth/refresh

Refresh an expiring JWT.

**Auth:** None (uses refresh_token in body)

### Request
```json
{
  "refresh_token": "..."
}
```

### Response `200`
```json
{
  "success": true,
  "data": {
    "access_token": "jwt...",
    "refresh_token": "...",
    "expires_at": "2026-07-22T00:00:00Z"
  }
}
```

---

## POST /api/v1/auth/forgot-password

Send a password reset email via Resend.

**Auth:** None

### Request
```json
{
  "email": "user@example.com"
}
```

### Response `200`
```json
{
  "success": true,
  "message": "If the email exists, a reset link has been sent."
}
```

---

## POST /api/v1/auth/verify-email

Verify email address using the token from the verification email.

**Auth:** None

### Request
```json
{
  "token": "uuid-token"
}
```

### Response `200`
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

## GET /api/v1/auth/session

Get the currently authenticated user's session.

**Auth:** JWT required

### Response `200`
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "full_name": "...", "avatar_url": "...", "email_verified": true },
    "expires_at": "2026-07-22T00:00:00Z"
  }
}
```
