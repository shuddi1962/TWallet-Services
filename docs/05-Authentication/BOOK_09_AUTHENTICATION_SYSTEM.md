# Book 09 — Authentication System

> **TWallet Services · TWallet Card**
> The complete, implementation-ready specification for the authentication system. This is the first feature book and follows the implementation-ready template: business purpose, UI specs, components, database tables, Supabase queries, server actions, validation rules, edge cases, all states, accessibility, acceptance criteria, testing checklist, and OpenCode prompt. OpenCode can build the entire auth system from this one document.

---

## Document Control

| Field        | Value                              |
| ------------ | ---------------------------------- |
| Book         | 09 — Authentication System         |
| Project      | TWallet Services                   |
| Product      | TWallet Card                       |
| Version      | 1.0.0                              |
| Status       | Approved                           |
| Module       | Authentication                     |
| Architecture | Enterprise                         |
| Domain       | twalletservices.com                |
| Owner        | TWallet Services Team              |
| Created      | 2026-07-21                         |
| Last Updated | 2026-07-21                         |
| Implements   | Book 02 FR-02-001..008, Book 05 SFR-02-001..008, Book 06 §8–§10 |

### Revision History

| Version | Date       | Author                | Notes                                                                    |
| ------- | ---------- | --------------------- | ------------------------------------------------------------------------ |
| 0.1.0   | 2026-07-21 | Engineering Team      | Initial draft (overview, flows, fields, validation, security, OpenCode prompt) |
| 1.0.0   | 2026-07-21 | Engineering Team      | Approved: implementation-ready spec — Supabase queries, server actions, Zod schemas, component tree, edge cases, testing checklist, full OpenCode prompt |

---

## Table of Contents

1. [Business Purpose](#1-business-purpose)
2. [Overview](#2-overview)
3. [Goals](#3-goals)
4. [Authentication Flow](#4-authentication-flow)
5. [UI Preview Description](#5-ui-preview-description)
6. [Components Used](#6-components-used)
7. [Component Tree](#7-component-tree)
8. [Database Tables](#8-database-tables)
9. [Supabase Queries](#9-supabase-queries)
10. [Server Actions](#10-server-actions)
11. [Validation Rules](#11-validation-rules)
12. [Registration](#12-registration)
13. [Email Verification](#13-email-verification)
14. [Login](#14-login)
15. [Forgot Password](#15-forgot-password)
16. [Reset Password](#16-reset-password)
17. [Logout](#17-logout)
18. [Session Management](#18-session-management)
19. [Route Protection](#19-route-protection)
20. [Profile Creation](#20-profile-creation)
21. [User Roles](#21-user-roles)
22. [Security](#22-security)
23. [Edge Cases](#23-edge-cases)
24. [Loading States](#24-loading-states)
25. [Empty States](#25-empty-states)
26. [Error States](#26-error-states)
27. [Success States](#27-success-states)
28. [Accessibility](#28-accessibility)
29. [SEO](#29-seo)
30. [Future Authentication](#30-future-authentication)
31. [Acceptance Criteria](#31-acceptance-criteria)
32. [Testing Checklist](#32-testing-checklist)
33. [OpenCode Prompt](#33-opencode-prompt)
34. [Glossary](#34-glossary)
35. [References](#35-references)

---

## 1. Business Purpose

The Authentication Module is the gateway to the TWallet Services platform. It manages user registration, login, email verification, password reset, session management, route protection, and logout. Authentication is powered by Supabase Auth (JWT-based sessions with HTTP-only cookies).

### 1.1 Why This Module Exists

- **Trust entry point:** Auth is the first interaction a user has with the platform. A smooth, secure auth experience builds trust — critical for a crypto fintech product.
- **Access control foundation:** Every subsequent feature (wallet, orders, payments, dashboard) depends on knowing who the user is and whether they're allowed to do something.
- **Non-custodial principle:** Auth establishes the user's identity without ever requesting recovery phrases or private keys — this policy starts at the registration form.

### 1.2 Requirements Tracing

| Book 02 FR    | Description                              | Implemented In |
| ------------- | ---------------------------------------- | -------------- |
| FR-02-001     | Register with email and password         | §12            |
| FR-02-002     | Send email verification link             | §13            |
| FR-02-003     | Login with verified credentials          | §14            |
| FR-02-004     | Forgot-password reset flow via email     | §15–§16        |
| FR-02-005     | Enforce email verification before /app   | §19            |
| FR-02-006     | Never request recovery phrase or key     | §12, §22       |
| FR-02-007     | Secure session management and logout     | §17–§18        |
| FR-02-008     | Rate-limit auth endpoints                | §22            |

---

## 2. Overview

The Authentication Module manages:

- User Registration
- User Login
- Email Verification
- Password Reset
- User Sessions
- Route Protection
- Logout
- Account Security

Authentication is powered by **Supabase Auth** (JWT sessions in HTTP-only cookies, bcrypt password hashing, email verification via OTP links).

### 2.1 Routes

| Route                    | Type   | Auth Required | Purpose                          |
| ------------------------ | ------ | ------------- | -------------------------------- |
| `/auth/register`         | Client | No (redirect if authed) | Registration form          |
| `/auth/login`            | Client | No (redirect if authed) | Login form                 |
| `/auth/forgot-password`  | Client | No            | Request password reset email     |
| `/auth/reset-password`   | Client | Token-gated   | Set new password                 |
| `/auth/verify-email`     | Client | No            | Email verification status        |

---

## 3. Goals

| Goal                          | How Achieved                                              |
| ----------------------------- | -------------------------------------------------------- |
| Provide secure authentication | Supabase Auth (bcrypt, JWT, HTTP-only cookies).          |
| Protect user data             | RLS on all tables; session validation on every request.  |
| Prevent unauthorized access   | Middleware route guards; RLS; server-side checks.         |
| Support future MFA            | Architecture allows adding MFA without rework.            |
| Support OAuth providers       | Supabase Auth supports OAuth; hooks reserved (§30).       |
| Never collect seed phrases    | No field requests them; prominent notices (§22).          |

---

## 4. Authentication Flow

```text
Guest
  ↓
Register (/auth/register)
  ↓
Create Supabase Auth User
  ↓
Auto-create profiles row (trigger)
  ↓
Send Verification Email
  ↓
Verify Email (/auth/verify-email)
  ↓
Login (/auth/login)
  ↓
Dashboard (/app)
  ↓
Logout → Homepage (/)
```

### 4.1 State Machine

```text
[unauthenticated]
      |
      | register
      v
[unverified] ──email link──> [verified] ──login──> [authenticated]
      |                         |
      | resend email            | password reset
      v                         v
[unverified]               [reset flow] ──> [authenticated]

[authenticated] ──logout──> [unauthenticated]
```

| Transition                     | Trigger                    | Guard                        |
| ------------------------------ | -------------------------- | ---------------------------- |
| unauthenticated → unverified   | Register form submit       | Email not already in use.    |
| unverified → verified          | Email link click           | Valid token, not expired.    |
| verified → authenticated       | Login form submit          | Correct credentials.         |
| authenticated → unauthenticated| Logout / session expiry    | —                            |
| authenticated → unauthenticated| Password reset forced      | Security event.              |

---

## 5. UI Preview Description

### 5.1 Auth Layout

All auth pages share a centered-card layout:
- Full-height muted background (`--color-bg`)
- Centered card (max-width 440px, `--color-surface`, `--radius-card`, `--shadow-md`)
- Brand logo at top of card
- No public header/footer (chromeless, focused)
- Mobile: card fills width with 24px padding

### 5.2 `/auth/register`
- Brand logo
- "Create your account" heading
- Form fields: First Name, Last Name, Username, Email, Password, Confirm Password, Country, Accept Terms checkbox, Newsletter checkbox (optional)
- Password strength meter (animates as user types)
- "Create Account" primary button (full width)
- "Already have an account? Login" link
- "We never ask for your seed phrase" trust notice

### 5.3 `/auth/login`
- Brand logo
- "Welcome back" heading
- Form fields: Email, Password (with show/hide toggle), Remember Me checkbox
- "Login" primary button (full width)
- "Forgot password?" link
- "Don't have an account? Register" link

### 5.4 `/auth/forgot-password`
- Brand logo
- "Reset your password" heading
- Description: "Enter your email and we'll send you a reset link."
- Form field: Email
- "Send Reset Link" primary button
- "Back to Login" link

### 5.5 `/auth/reset-password`
- Brand logo
- "Set a new password" heading
- Form fields: New Password, Confirm Password
- Password strength meter
- "Reset Password" primary button
- "Back to Login" link
- If token invalid/expired: error state with "Request new link" button

### 5.6 `/auth/verify-email`
- Brand logo
- Status icon (clock for pending, check for success, alert for failed)
- "Verify your email" heading
- Email address shown (the one we sent to)
- "Resend Email" button (30s cooldown with countdown)
- "Continue to Dashboard" button (appears on success)
- "Back to Login" link

---

## 6. Components Used

All components from Book 04 (Design System):

| Component         | Source     | Usage in Auth                          |
| ----------------- | ---------- | -------------------------------------- |
| `Button`          | Book 04 §11 | Submit buttons, CTAs                  |
| `Input`           | Book 04 §12 | Text, email, password fields          |
| `Checkbox`        | Book 04 §12 | Accept Terms, Remember Me, Newsletter |
| `Label`           | Book 04 §12 | Field labels                          |
| `Card`            | Book 04 §13 | Auth card container                   |
| `Alert`           | Book 04 §23 | Error/success messages                |
| `Spinner`         | Book 04 §23 | Button loading state                  |
| `Skeleton`        | Book 04 §23 | Initial page load                     |
| `Badge`           | Book 04 §16 | Trust notice, status badge            |
| `PasswordStrengthMeter` | Custom | Password strength indicator     |
| `TrustNotice`     | Custom     | "We never ask for your seed phrase"   |

### 6.1 Custom Components

#### PasswordStrengthMeter

```tsx
interface PasswordStrengthMeterProps {
  password: string;
}
// Displays a 4-segment bar: weak (red) / fair (yellow) / good (blue) / strong (green)
// Calculates strength based on: length, uppercase, lowercase, number, special char
```

#### TrustNotice

```tsx
interface TrustNoticeProps {
  message?: string;  // default: "We never ask for your recovery phrase or private keys."
}
// A subtle info badge with a shield icon, displayed below the form
```

---

## 7. Component Tree

### 7.1 Registration Page

```
RegisterPage (Client Component)
├── AuthLayout
│   ├── BrandLogo
│   └── Card
│       ├── CardHeader
│       │   ├── Heading ("Create your account")
│       │   └── Subtext
│       └── CardContent
│           ├── Form (react-hook-form)
│           │   ├── FormField (first_name)
│           │   │   ├── Label
│           │   │   └── Input
│           │   ├── FormField (last_name)
│           │   ├── FormField (username)
│           │   ├── FormField (email)
│           │   ├── FormField (password)
│           │   │   ├── Label
│           │   │   ├── Input (type=password, with toggle)
│           │   │   └── PasswordStrengthMeter
│           │   ├── FormField (confirm_password)
│           │   ├── FormField (country)
│           │   │   └── Select
│           │   ├── Checkbox (accept_terms)
│           │   ├── Checkbox (newsletter)
│           │   └── Button (submit, "Create Account")
│           ├── Alert (error, if any)
│           └── TrustNotice
└── FooterLinks
    └── Link ("Already have an account? Login" → /auth/login)
```

### 7.2 Login Page

```
LoginPage (Client Component)
├── AuthLayout
│   ├── BrandLogo
│   └── Card
│       ├── CardHeader
│       │   └── Heading ("Welcome back")
│       └── CardContent
│           ├── Form (react-hook-form)
│           │   ├── FormField (email)
│           │   ├── FormField (password)
│           │   │   ├── Input (with show/hide toggle)
│           │   │   └── PasswordToggle (button)
│           │   ├── Checkbox (remember_me)
│           │   └── Button (submit, "Login")
│           ├── Alert (error, if any)
│           └── TrustNotice
└── FooterLinks
    ├── Link ("Forgot password?" → /auth/forgot-password)
    └── Link ("Don't have an account? Register" → /auth/register)
```

### 7.3 Verify Email Page

```
VerifyEmailPage (Client Component)
├── AuthLayout
│   ├── BrandLogo
│   └── Card
│       ├── StatusIcon (clock / check / alert)
│       ├── CardHeader
│       │   └── Heading ("Verify your email")
│       └── CardContent
│           ├── Text (email address shown)
│           ├── Alert (status: pending / success / failed)
│           ├── Button ("Resend Email" with cooldown)
│           ├── Button ("Continue to Dashboard" — on success)
│           └── Link ("Back to Login")
```

---

## 8. Database Tables

### 8.1 Tables Used

| Table             | Purpose in Auth                          | Book 08 §  |
| ----------------- | ---------------------------------------- | ---------- |
| `profiles`        | Created on registration; stores user data| §4.1       |
| `roles`           | Role definitions (customer, admin, etc.) | §4.2       |
| `user_roles`      | Assigns 'customer' role on registration   | §4.3       |
| `activity_logs`   | Logs login/logout/register events         | §9.2       |
| `auth.users`      | Supabase Auth managed table (not in our schema) | §13  |

### 8.2 Key Columns

**profiles** (created on registration):
- `id` = `auth.users.id` (shared UUID)
- `auth_user_id` = `auth.users.id` (FK, UNIQUE)
- `full_name` = first_name + " " + last_name
- `username` = chosen username
- `email` = registration email
- `country` = selected country
- `status` = 'active' (default)

**user_roles** (created on registration):
- `profile_id` = new profile ID
- `role_id` = ID of 'customer' role (from seed data)

**activity_logs** (created on auth events):
- `profile_id` = user's profile ID
- `action` = 'register' / 'login' / 'logout' / 'password_reset' / 'email_verify'
- `ip_address`, `device`, `browser` = request metadata

---

## 9. Supabase Queries

### 9.1 Registration (Server Action)

```ts
// 1. Create auth user (Supabase Auth)
const { data, error } = await supabaseAdmin.auth.admin.createUser({
  email,
  password,
  email_confirm: false, // require verification
  user_metadata: {
    full_name: `${firstName} ${lastName}`,
    username,
    country,
  },
});

// 2. Profile is auto-created via handle_new_user() trigger on auth.users
// (see Book 08 §13.1)

// 3. Assign 'customer' role
const { data: roleData } = await supabaseAdmin
  .from('roles')
  .select('id')
  .eq('name', 'customer')
  .single();

await supabaseAdmin
  .from('user_roles')
  .insert({ profile_id: data.user.id, role_id: roleData.id });

// 4. Log activity
await supabaseAdmin
  .from('activity_logs')
  .insert({
    profile_id: data.user.id,
    action: 'register',
    ip_address: clientIP,
    device: deviceInfo,
    browser: browserInfo,
  });

// 5. Send verification email (Supabase Auth handles this automatically)
// Or manually:
await supabaseAdmin.auth.admin.generateLink({
  type: 'signup',
  email,
});
```

### 9.2 Login (Server Action)

```ts
// 1. Authenticate with Supabase Auth
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

if (error) throw error;

// 2. Check if email is verified
if (!data.user.email_confirmed_at) {
  return { requiresVerification: true, email: data.user.email };
}

// 3. Log activity
await supabaseAdmin
  .from('activity_logs')
  .insert({
    profile_id: data.user.id,
    action: 'login',
    ip_address: clientIP,
    device: deviceInfo,
    browser: browserInfo,
  });

// 4. Set session cookies (handled by @supabase/ssr)
// Redirect to /app
```

### 9.3 Logout (Server Action)

```ts
// 1. Log activity
await supabaseAdmin
  .from('activity_logs')
  .insert({
    profile_id: userId,
    action: 'logout',
  });

// 2. Sign out
await supabase.auth.signOut();

// 3. Clear cookies (handled by @supabase/ssr)
// Redirect to /
```

### 9.4 Forgot Password (Server Action)

```ts
// Supabase Auth handles the reset email
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
});
```

### 9.5 Reset Password (Server Action)

```ts
// User clicks email link → arrives at /auth/reset-password with tokens in URL
// Supabase SSr exchanges the code for a session
const { error } = await supabase.auth.exchangeCodeForSession(code);

if (error) throw error;

// Update password
const { error: updateError } = await supabase.auth.updateUser({
  password: newPassword,
});

if (updateError) throw updateError;

// Log activity
await supabaseAdmin
  .from('activity_logs')
  .insert({ profile_id: userId, action: 'password_reset' });

// Sign out and redirect to login
await supabase.auth.signOut();
// Redirect to /auth/login
```

### 9.6 Resend Verification Email (Server Action)

```ts
await supabase.auth.resend({
  type: 'signup',
  email,
  options: {
    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify-email`,
  },
});
```

### 9.7 Check Email Verification Status (Server Component)

```ts
// In a Server Component or middleware
const { data: { user } } = await supabase.auth.getUser();

const isVerified = user?.email_confirmed_at !== null;
```

### 9.8 Get Current User Profile (Server Component)

```ts
const { data: { user } } = await supabase.auth.getUser();

if (!user) return null;

const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('auth_user_id', user.id)
  .single();

return profile;
```

---

## 10. Server Actions

All server actions are in `src/app/auth/actions.ts` (or co-located per route).

### 10.1 Action Inventory

| Action                | Route                        | Input                    | Output                    |
| --------------------- | ---------------------------- | ------------------------ | ------------------------- |
| `registerAction`      | `/auth/register`             | RegisterInput            | `{ success } \| { error }` |
| `loginAction`         | `/auth/login`                | LoginInput               | `{ success } \| { error, requiresVerification? }` |
| `logoutAction`        | Any (button)                 | —                        | `{ success }`             |
| `forgotPasswordAction`| `/auth/forgot-password`      | `{ email }`              | `{ success } \| { error }` |
| `resetPasswordAction` | `/auth/reset-password`       | ResetPasswordInput       | `{ success } \| { error }` |
| `resendVerificationAction` | `/auth/verify-email`   | `{ email }`              | `{ success } \| { error }` |

### 10.2 Server Action Pattern

```ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function registerAction(input: RegisterInput) {
  // 1. Validate input
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // 2. Create auth user (service-role client)
  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: false,
    user_metadata: {
      full_name: `${parsed.data.first_name} ${parsed.data.last_name}`,
      username: parsed.data.username,
      country: parsed.data.country,
    },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: { email: ['This email is already registered'] } };
    }
    return { error: { _form: ['Registration failed. Please try again.'] } };
  }

  // 3. Profile auto-created via trigger
  // 4. Assign 'customer' role
  const { data: roleData } = await supabaseAdmin
    .from('roles')
    .select('id')
    .eq('name', 'customer')
    .single();

  if (roleData) {
    await supabaseAdmin
      .from('user_roles')
      .insert({ profile_id: data.user.id, role_id: roleData.id });
  }

  // 5. Log activity
  await supabaseAdmin.from('activity_logs').insert({
    profile_id: data.user.id,
    action: 'register',
  });

  // 6. Redirect to verify-email
  redirect(`/auth/verify-email?email=${encodeURIComponent(parsed.data.email)}`);
}
```

---

## 11. Validation Rules

### 11.1 Zod Schemas

```ts
// src/lib/validations/auth.ts
import { z } from 'zod';

// Registration
export const registerSchema = z.object({
  first_name: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  last_name: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  confirm_password: z.string(),
  country: z.string().min(1, 'Country is required'),
  accept_terms: z
    .boolean()
    .refine(v => v === true, 'You must accept the terms to continue'),
  newsletter: z.boolean().optional().default(false),
}).refine(data => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Login
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  remember_me: z.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Forgot Password
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// Reset Password
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  confirm_password: z.string(),
}).refine(data => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
```

### 11.2 Validation Summary

| Field           | Rules                                                       |
| --------------- | ----------------------------------------------------------- |
| first_name      | Required, 2–50 chars                                        |
| last_name       | Required, 2–50 chars                                        |
| username        | Required, unique, 3–20 chars, alphanumeric + underscore     |
| email           | Required, unique, valid email format                        |
| password        | Required, min 8 chars, 1 upper, 1 lower, 1 number, 1 special |
| confirm_password| Must match password                                         |
| country         | Required (select)                                           |
| accept_terms    | Must be true                                                |
| newsletter      | Optional, boolean                                           |

---

## 12. Registration

### 12.1 Route

`/auth/register` (Client Component)

### 12.2 Fields

| Field            | Type      | Validation                    |
| ---------------- | --------- | ----------------------------- |
| First Name       | Text      | Required, 2–50 chars          |
| Last Name        | Text      | Required, 2–50 chars          |
| Username         | Text      | Required, unique, 3–20 chars  |
| Email            | Email     | Required, unique, valid email |
| Password         | Password  | Required, min 8 + complexity  |
| Confirm Password | Password  | Must match password           |
| Country          | Select    | Required                      |
| Accept Terms     | Checkbox  | Required (must be checked)    |
| Newsletter       | Checkbox  | Optional                      |

### 12.3 Registration Success

```text
Create Supabase Auth User
  ↓
Auto-create profiles row (via handle_new_user trigger)
  ↓
Assign 'customer' role (user_roles insert)
  ↓
Log 'register' activity
  ↓
Send Verification Email (Supabase Auth)
  ↓
Redirect → /auth/verify-email?email=user@example.com
```

### 12.4 Registration UX Rules

| Rule                          | Detail                                              |
| ----------------------------- | --------------------------------------------------- |
| Password strength meter       | Shows weak/fair/good/strong as user types.          |
| Email validation              | Real-time format check; uniqueness on submit.       |
| Confirm password              | Must match; error on mismatch.                      |
| Terms checkbox                | Required; link to terms opens in new tab.           |
| Submit button                 | Disabled until all fields valid + terms accepted.   |
| Error messages                | Affirmative + actionable ("Enter a valid email").   |
| Success                       | Redirect to `/auth/verify-email` with email shown.  |
| Rate limit                    | 5 registrations / 15 min / IP.                      |
| **No seed phrase field**      | **No field requests a seed or private key.**        |
| Trust notice                  | "We never ask for your recovery phrase or private keys." below the form. |

---

## 13. Email Verification

### 13.1 Flow

```text
User opens email
  ↓
Clicks verification link
  ↓
Supabase validates token
  ↓
[if valid: email_confirmed_at set → redirect to /app]
  ↓
[if expired: /auth/verify-email with "link expired, resend"]
  ↓
[if already verified: redirect to /app]
```

### 13.2 Verify Email Page Behavior

| State                | UI                                                        |
| -------------------- | --------------------------------------------------------- |
| Pending (default)    | Clock icon + "Check your email" + "Resend Email" button (30s cooldown) |
| Success (verified)   | Green check icon scales in + "Email verified" + "Continue to Dashboard" button |
| Failed (expired)     | Alert icon + "Link expired" + "Resend Email" button       |
| Already verified     | Auto-redirect to `/app`                                    |

### 13.3 Resend Cooldown

- 30 seconds between resends.
- Button shows countdown: "Resend Email (28s)" → disabled → "Resend Email" (enabled).

---

## 14. Login

### 14.1 Route

`/auth/login` (Client Component)

### 14.2 Fields

| Field        | Type     | Validation              |
| ------------ | -------- | ----------------------- |
| Email        | Email    | Required, valid email   |
| Password     | Password | Required                |
| Remember Me  | Checkbox | Optional                |

### 14.3 Login Success

```text
Authenticate (Supabase Auth)
  ↓
Check email_confirmed_at
  ↓
[if verified: log 'login' activity → redirect /app]
  ↓
[if not verified: redirect /auth/verify-email with message]
```

### 14.4 Login Failure

| Error              | Message                                      | Action                |
| ------------------ | -------------------------------------------- | --------------------- |
| Invalid credentials| "Invalid email or password"                  | Stay on page          |
| Email not verified | "Please verify your email first"             | Redirect to verify    |
| Account suspended  | "Your account has been suspended"            | Link to support       |
| Rate limited       | "Too many attempts. Try again in 15 minutes" | Disable form          |
| Network error      | "Something went wrong. Try again."           | Stay on page + retry  |

### 14.5 Login UX Rules

| Rule                          | Detail                                              |
| ----------------------------- | --------------------------------------------------- |
| Password toggle               | Eye icon shows/hides password; aria-label "Show password". |
| Error message                 | Generic "Invalid email or password" (no enumeration of which is wrong). |
| Unverified user               | Redirect to verify-email with message.              |
| Remember me                   | Session persists via Supabase Auth cookies (default). |
| Rate limit                    | 5 attempts / 15 min / IP; on exceed: "Try again later". |
| Redirect after login          | `/app` (or return URL if redirected from a guarded page). |
| Redirect if already authed    | If user visits /auth/login while authed, redirect to /app. |

---

## 15. Forgot Password

### 15.1 Route

`/auth/forgot-password` (Client Component)

### 15.2 Fields

| Field | Type  | Validation              |
| ----- | ----- | ----------------------- |
| Email | Email | Required, valid email   |

### 15.3 Flow

```text
Enter Email
  ↓
Send Reset Email (Supabase Auth)
  ↓
Show "Check your email" message (always, even if email doesn't exist — security)
  ↓
User clicks link in email
  ↓
Redirect to /auth/reset-password
```

### 15.4 UX Rules

| Rule                          | Detail                                              |
| ----------------------------- | --------------------------------------------------- |
| Always show success           | "Check your email" regardless of whether email exists (prevents enumeration). |
| Rate limit                    | 3 requests / hour / email.                          |
| Back to Login                 | Always available.                                   |

---

## 16. Reset Password

### 16.1 Route

`/auth/reset-password` (Client Component, token-gated)

### 16.2 Fields

| Field            | Type     | Validation                    |
| ---------------- | -------- | ----------------------------- |
| New Password     | Password | Required, min 8 + complexity  |
| Confirm Password | Password | Must match new password       |

### 16.3 Flow

```text
User arrives with token in URL (from email link)
  ↓
Exchange code for session (Supabase Auth)
  ↓
[if token valid: show reset form]
  ↓
[if token invalid/expired: show error + "Request new link"]
  ↓
User sets new password
  ↓
Update password (Supabase Auth)
  ↓
Log 'password_reset' activity
  ↓
Sign out → redirect /auth/login
```

### 16.4 UX Rules

| Rule                          | Detail                                              |
| ----------------------------- | --------------------------------------------------- |
| Password strength meter       | Same as registration.                               |
| Token invalid                 | Error page with "Request new reset link" button → /auth/forgot-password. |
| Success                       | Redirect to /auth/login with "Password reset successfully" toast. |
| Sign out after reset          | User must log in with new password.                 |

---

## 17. Logout

### 17.1 Flow

```text
User clicks "Logout" (in user menu)
  ↓
Log 'logout' activity
  ↓
Sign out (Supabase Auth)
  ↓
Clear session cookies
  ↓
Redirect → / (homepage)
```

### 17.2 UX Rules

| Rule                          | Detail                                              |
| ----------------------------- | --------------------------------------------------- |
| Logout button                 | In user menu (topbar dropdown) and settings page.   |
| No confirmation               | Logout is immediate (no confirm dialog needed).     |
| Redirect                      | To homepage (`/`), not to login.                    |

---

## 18. Session Management

### 18.1 Strategy

| Aspect              | Implementation                                       |
| ------------------- | ---------------------------------------------------- |
| JWT                 | Supabase Auth issues JWTs (access + refresh).        |
| Storage             | HTTP-only cookies (via `@supabase/ssr`).             |
| SameSite            | Lax (default in Supabase SSR).                       |
| Refresh             | Automatic via Supabase Auth (refresh token rotation).|
| Expiry              | Access token: 1 hour (Supabase default). Refresh token: configurable. |
| Session recovery    | Supabase Auth auto-refreshes on page load if refresh token valid. |

### 18.2 Supabase SSR Client

```ts
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}

// src/lib/supabase/admin.ts (server-only, service-role)
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// src/lib/supabase/client.ts (client-side, for client components)
import { createBrowserClient } from '@supabase/ssr';

export function createBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### 18.3 Middleware Client

```ts
// src/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export function createMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );
  return { supabase, response };
}
```

---

## 19. Route Protection

### 19.1 Middleware

```ts
// src/middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Auth routes: redirect to /app if already logged in
  if (pathname.startsWith('/auth/') && user) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  // App routes: require auth + verified email
  if (pathname.startsWith('/app')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (!user.email_confirmed_at) {
      return NextResponse.redirect(new URL('/auth/verify-email', request.url));
    }
  }

  // Admin routes: require auth + admin role
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (!user.email_confirmed_at) {
      return NextResponse.redirect(new URL('/auth/verify-email', request.url));
    }
    // Check admin role (fetched from user_roles via RLS)
    const { data: roles } = await supabase
      .from('user_roles')
      .select('roles(name)')
      .eq('profile_id', user.id);
    const isAdmin = roles?.some(r => 
      ['admin', 'super_admin', 'support', 'manager', 'finance', 'operations'].includes(r.roles.name)
    );
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/app', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/auth/:path*', '/app/:path*', '/admin/:path*'],
};
```

### 19.2 Route Access Matrix

| Route Type         | Auth Required | Email Verified | Role Required          | On Failure                     |
| ------------------ | ------------- | -------------- | --------------------- | ------------------------------ |
| `/` (public)       | No            | —              | —                     | —                              |
| `/auth/*`          | No (redirect if authed) | —     | —                     | Redirect to `/app` if authed   |
| `/app/*`           | Yes           | Yes            | Customer              | Redirect to `/auth/login`      |
| `/admin/*`         | Yes           | Yes            | Admin/SA/Support      | Redirect to `/app` or 403      |

---

## 20. Profile Creation

### 20.1 Auto-Creation on Registration

When a user registers, a `profiles` row is created automatically via a trigger on `auth.users`:

```sql
-- Defined in Book 08 §13.1
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, auth_user_id, full_name, email)
  VALUES (
    NEW.id,
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### 20.2 Role Assignment

After the profile is created, the 'customer' role is assigned via the server action (§10.2, step 4).

### 20.3 Default Settings

| Setting        | Default Value              |
| -------------- | -------------------------- |
| `status`       | `'active'`                 |
| `timezone`     | `'UTC'`                    |
| `language`     | `'en'`                     |
| Role           | `'customer'`               |

---

## 21. User Roles

### 21.1 Role Hierarchy

| Role           | Code         | Access Level                          |
| -------------- | ------------ | ------------------------------------- |
| Guest          | —            | Public pages only.                    |
| Customer       | customer     | `/app/*` — own data only.             |
| Support        | support      | `/admin/support/*` — tickets only.    |
| Manager        | manager      | `/admin/*` — most admin operations.   |
| Finance        | finance      | `/admin/payments/*`, `/admin/orders/*`|
| Operations     | operations   | `/admin/*` — orders, cards, shipping. |
| Super Admin    | super_admin  | `/admin/*` — full access + settings.  |

### 21.2 Role Assignment

- On registration: `customer` role assigned automatically.
- Admin roles: assigned by Super Admin via `/admin/users` (Book 14).
- A user can have multiple roles (e.g., `customer` + `support`).

---

## 22. Security

### 22.1 Security Measures

| Measure                  | Implementation                                       |
| ------------------------ | ---------------------------------------------------- |
| Passwords never stored   | Supabase Auth uses bcrypt hashing.                   |
| HTTPS required           | Vercel enforces HTTPS; HSTS header.                  |
| Rate limiting            | 5 auth attempts / 15 min / IP (middleware + Supabase). |
| Session validation       | Middleware checks session on every request.          |
| CSRF protection          | SameSite=Lax cookies; origin validation on mutations.|
| Input sanitization       | Zod validation on client + server.                   |
| XSS protection           | React default escaping; no dangerouslySetInnerHTML.  |
| SQL injection protection | Supabase typed query helpers (parameterized).        |
| No seed phrase collection| No field requests seeds; trust notice visible.       |
| No private key collection| No field requests keys; trust notice visible.        |
| Email enumeration prevention | Forgot-password always shows success.           |
| Generic login errors     | "Invalid email or password" (no enumeration).        |

### 22.2 Rate Limiting

| Endpoint               | Limit                     | Enforcement        |
| ---------------------- | ------------------------- | ------------------ |
| Login                  | 5 attempts / 15 min / IP  | Supabase Auth + middleware |
| Register               | 5 attempts / 15 min / IP  | Supabase Auth + middleware |
| Password reset request | 3 / hour / email          | Supabase Auth      |
| Resend verification    | 3 / hour / email          | Supabase Auth      |

### 22.3 Trust Notice

Every auth form displays a trust notice below the form:

```
🔒 We never ask for your recovery phrase or private keys.
```

This is a `TrustNotice` component with a shield icon, styled as a subtle info badge.

---

## 23. Edge Cases

| Edge Case                          | Handling                                              |
| ---------------------------------- | ----------------------------------------------------- |
| User registers with existing email | Return error "This email is already registered"       |
| User registers with existing username | Return error "This username is taken"              |
| User logs in without verifying email | Redirect to /auth/verify-email with message        |
| User clicks expired verification link | Show "Link expired" + resend button                |
| User clicks already-used reset link | Show "Link expired" + request new link button       |
| User's session expires mid-action   | Redirect to /auth/login; return URL preserved        |
| User's account is suspended         | Login fails with "Account suspended" + support link  |
| Network error during auth           | "Something went wrong. Try again." + retry button    |
| User visits /auth/login while authed | Redirect to /app                                     |
| User visits /auth/register while authed | Redirect to /app                                  |
| User visits /app without session    | Redirect to /auth/login                               |
| User visits /admin without admin role | Redirect to /app or 403                             |
| Token in URL is malformed           | Show error page + "Request new link"                  |
| Password fields don't match         | Inline error on confirm_password field               |
| Username has special characters     | Inline error "Only letters, numbers, and underscore"  |
| Supabase Auth is down               | "Something went wrong on our end. Try again later."   |

---

## 24. Loading States

| Component              | Loading Behavior                                      |
| ---------------------- | ----------------------------------------------------- |
| Register button        | Spinner replaces label; button disabled; same width.  |
| Login button           | Spinner replaces label; button disabled; same width.  |
| Forgot password button | Spinner replaces label; button disabled.              |
| Reset password button  | Spinner replaces label; button disabled.              |
| Resend email button    | Spinner + "Sending..." then cooldown countdown.       |
| Verify email page      | Progress indicator while checking verification status. |
| Page load (initial)    | Skeleton card with form field shapes (no CLS).        |

---

## 25. Empty States

| State                | UI                                                        |
| -------------------- | --------------------------------------------------------- |
| No session           | Redirect to /auth/login (no empty state shown).           |
| No auth-related data | N/A — auth pages don't display user data lists.           |

> Auth pages don't have traditional empty states. The "no session" case is handled by redirecting to login.

---

## 26. Error States

### 26.1 Error Messages

| Error              | Message                                          | Type           |
| ------------------ | ------------------------------------------------ | -------------- |
| Email exists       | "This email is already registered"               | Inline field   |
| Username exists    | "This username is taken"                         | Inline field   |
| Wrong password     | "Invalid email or password"                      | Form-level     |
| Invalid email      | "Enter a valid email"                            | Inline field   |
| Weak password      | "Password must contain..." (specific rule)       | Inline field   |
| Expired token      | "This link has expired. Request a new one."      | Page-level     |
| Network error      | "Something went wrong. Try again."               | Form-level     |
| Account disabled   | "Your account has been suspended. Contact support." | Form-level  |
| Rate limited       | "Too many attempts. Try again in 15 minutes."    | Form-level     |

### 26.2 Error Display Rules

- Field errors: below the input, `--color-danger`, `--text-small`, announced via `aria-live`.
- Form-level errors: Alert component above the form.
- Page-level errors (expired token): full card with icon + message + CTA.
- Never show technical details (stack traces, error codes, SQL).
- Log technical details server-side (Sentry).

---

## 27. Success States

| Action              | Success Behavior                                      |
| ------------------- | ----------------------------------------------------- |
| Registration        | Redirect to /auth/verify-email (with email shown).    |
| Email verified      | Green check icon + "Continue to Dashboard" button.    |
| Login               | Redirect to /app.                                     |
| Password reset      | Redirect to /auth/login + "Password reset successfully" toast. |
| Forgot password     | "Check your email for a reset link" message.          |
| Logout              | Redirect to / (homepage).                             |
| Resend verification | "Verification email sent" + cooldown starts.          |

---

## 28. Accessibility

| Requirement                  | Implementation                                       |
| ---------------------------- | ---------------------------------------------------- |
| Keyboard navigation          | All form fields reachable via Tab; submit via Enter. |
| Focus indicators             | `:focus-visible` ring on all interactive elements.   |
| Labels associated            | `<Label>` associated with `<Input>` via htmlFor.      |
| Error announcement           | Errors in `aria-live="polite"` region.               |
| Password toggle              | Button with `aria-label="Show password"` / `"Hide password"`. |
| Form validation              | `aria-invalid="true"` on fields with errors.         |
| Heading hierarchy            | h1 for page title; h2 for sections.                  |
| Screen reader                | Semantic HTML; no aria-overload.                     |
| Color contrast               | All text meets WCAG 2.1 AA (Book 04 §4.5).           |
| Reduced motion               | Password strength meter and status icons respect `prefers-reduced-motion`. |
| Skip link                    | Skip-to-content link on auth pages.                  |

---

## 29. SEO

Auth pages are **not indexable**.

| Page               | Meta Robots                    |
| ------------------ | ------------------------------ |
| `/auth/register`   | `noindex, nofollow`            |
| `/auth/login`      | `noindex, nofollow`            |
| `/auth/forgot-password` | `noindex, nofollow`       |
| `/auth/reset-password` | `noindex, nofollow`        |
| `/auth/verify-email` | `noindex, nofollow`          |

Implementation:

```ts
// In each auth page's metadata export
export const metadata = {
  title: 'Login | TWallet Services',
  robots: { index: false, follow: false },
};
```

---

## 30. Future Authentication

Reserved for post-MVP (hooks in architecture, not implemented):

| Provider     | Type     | Version |
| ------------ | -------- | ------- |
| Google       | OAuth    | v2      |
| GitHub       | OAuth    | v2      |
| Apple        | OAuth    | v2      |
| Microsoft    | OAuth    | v2      |
| Discord      | OAuth    | v2      |
| Magic Link   | Passwordless | v2  |
| Passkeys     | WebAuthn | v2      |
| MFA (TOTP)   | Multi-factor | v2  |

> Supabase Auth supports all of these. The architecture (Supabase Auth + `@supabase/ssr`) allows adding providers without rework.

---

## 31. Acceptance Criteria

| AC ID    | Criterion                                                      |
| -------- | -------------------------------------------------------------- |
| AC-AU-01 | Given a new email, when user registers, then a verification email is sent. |
| AC-AU-02 | Given an unverified user, when they access /app, then they are redirected to /auth/verify-email. |
| AC-AU-03 | Given a verified user, when they log in with correct credentials, then they reach /app. |
| AC-AU-04 | Given a forgotten password, when user requests reset, then a reset email is sent. |
| AC-AU-05 | Given a valid reset token, when user sets a new password, then they can log in with it. |
| AC-AU-06 | Given any auth form, then no field requests a recovery phrase or private key. |
| AC-AU-07 | Given 5 failed login attempts, then the IP is rate-limited for 15 minutes. |
| AC-AU-08 | Given a user with a session, when they visit /auth/login, then they are redirected to /app. |
| AC-AU-09 | Given a registered user, then a profiles row is auto-created with default settings. |
| AC-AU-10 | Given a registered user, then the 'customer' role is assigned. |
| AC-AU-11 | Given a user, when they click logout, then the session is cleared and they are redirected to /. |
| AC-AU-12 | Given a user, when they log in, then an activity_logs entry is created with action='login'. |
| AC-AU-13 | Given a password that doesn't meet complexity rules, then inline validation shows the specific rule that failed. |
| AC-AU-14 | Given the forgot-password form, then it always shows "Check your email" regardless of whether the email exists. |
| AC-AU-15 | Given an expired verification link, then the verify-email page shows "Link expired" with a resend button. |
| AC-AU-16 | Given any auth page, then it is fully keyboard navigable with visible focus indicators. |

---

## 32. Testing Checklist

### 32.1 Unit Tests (Vitest)

- [ ] `registerSchema` validates all fields correctly
- [ ] `loginSchema` validates email + password
- [ ] `forgotPasswordSchema` validates email
- [ ] `resetPasswordSchema` validates password + confirm match
- [ ] `registerAction` creates user + profile + role
- [ ] `loginAction` authenticates + checks verification
- [ ] `logoutAction` signs out + logs activity
- [ ] `forgotPasswordAction` sends reset email
- [ ] `resetPasswordAction` updates password
- [ ] `resendVerificationAction` resends email

### 32.2 Integration Tests (Vitest + Supabase local)

- [ ] Registration creates auth user + profiles row + user_roles row
- [ ] Login with correct credentials succeeds
- [ ] Login with wrong password fails with generic error
- [ ] Login with unverified email redirects to verify-email
- [ ] Logout clears session
- [ ] Password reset flow end-to-end
- [ ] Email verification flow end-to-end
- [ ] Rate limiting triggers after 5 attempts

### 32.3 E2E Tests (Playwright)

- [ ] Guest can navigate to register page
- [ ] User can fill and submit registration form
- [ ] Verification email is sent (mocked or real)
- [ ] User can verify email via link
- [ ] User can log in after verification
- [ ] User is redirected to /app after login
- [ ] Unverified user cannot access /app
- [ ] User can log out and is redirected to /
- [ ] User can request password reset
- [ ] User can reset password via email link
- [ ] Auth pages are keyboard navigable
- [ ] Auth pages have noindex meta tag
- [ ] No field requests seed phrase or private key
- [ ] Trust notice is visible on all auth forms

### 32.4 Accessibility Tests

- [ ] Axe DevTools passes on all auth pages
- [ ] Keyboard-only walkthrough of register, login, forgot-password, reset-password, verify-email
- [ ] Screen reader (NVDA/VoiceOver) announces errors and status changes

---

## 33. OpenCode Prompt

```
Build a production-ready authentication system for TWallet Services using Next.js 15 (App Router), Supabase Auth, TypeScript (strict), Tailwind CSS v4, and shadcn/ui (customized to Book 04 design tokens).

## Routes to Build

1. /auth/register — Registration page
2. /auth/login — Login page
3. /auth/forgot-password — Forgot password page
4. /auth/reset-password — Reset password page (token-gated)
5. /auth/verify-email — Email verification status page

## Requirements

### Architecture
- Use Server Components for page shells where possible.
- Use Server Actions for form submissions (register, login, forgot-password, reset-password, resend-verification).
- Use Client Components for interactive form elements (react-hook-form, password toggle, strength meter).
- Use @supabase/ssr for session management (createServerClient for server, createBrowserClient for client).
- Create a service-role admin client for server-side admin operations (createUser, role assignment).
- NEVER put SUPABASE_SERVICE_ROLE_KEY in a client bundle.

### Middleware (src/middleware.ts)
- Protect /app/* routes: redirect to /auth/login if no session.
- Protect /admin/* routes: redirect to /auth/login if no session; check admin role.
- Redirect authenticated users away from /auth/* to /app.
- Check email_confirmed_at for /app and /admin access.
- Matcher: ['/auth/:path*', '/app/:path*', '/admin/:path*']

### Registration (/auth/register)
- Fields: first_name, last_name, username, email, password, confirm_password, country (select), accept_terms (checkbox required), newsletter (checkbox optional)
- Validate with Zod (registerSchema from src/lib/validations/auth.ts)
- Use react-hook-form for form state
- Password strength meter (4-segment: weak/fair/good/strong)
- On submit: create Supabase Auth user (email_confirm: false), profile auto-created via trigger, assign 'customer' role, log activity, redirect to /auth/verify-email
- Rate limit: 5 / 15 min / IP
- Trust notice below form: "We never ask for your recovery phrase or private keys."
- NEVER request a recovery phrase or private key in any field

### Login (/auth/login)
- Fields: email, password (with show/hide toggle), remember_me (checkbox)
- Validate with Zod (loginSchema)
- On submit: signInWithPassword, check email_confirmed_at, log activity, redirect to /app
- If not verified: redirect to /auth/verify-email
- Error: "Invalid email or password" (generic, no enumeration)
- Rate limit: 5 / 15 min / IP
- Redirect to /app if already authenticated

### Forgot Password (/auth/forgot-password)
- Fields: email
- On submit: resetPasswordForEmail with redirectTo /auth/reset-password
- Always show "Check your email" (prevent email enumeration)
- Rate limit: 3 / hour / email

### Reset Password (/auth/reset-password)
- Fields: password, confirm_password
- Token-gated: exchange code for session on load
- If token invalid/expired: error page with "Request new link" button
- On submit: updateUser({ password }), log activity, sign out, redirect to /auth/login
- Password strength meter

### Verify Email (/auth/verify-email)
- Shows pending state with "Resend Email" button (30s cooldown)
- On verification success: green check icon + "Continue to Dashboard" button
- On expired link: error + "Resend Email" button
- If already verified: auto-redirect to /app

### Logout
- Server action: log activity, signOut, redirect to /

### Design System (Book 04)
- Auth layout: centered card on muted background, brand logo, no public nav
- Use design tokens: --color-primary (#2563EB), --color-surface (#FFFFFF), --color-border (#E2E8F0), --radius-card (20px), --shadow-md
- Buttons: primary variant, full width on mobile
- Inputs: 56px height, --radius-button (14px), label above input
- Error text: --color-danger (#DC2626), --text-small, aria-live
- Loading: spinner in button, button disabled
- Fonts: Geist (via next/font)
- Icons: Lucide React (outline, 24px)

### Validation (src/lib/validations/auth.ts)
- registerSchema: first_name (2-50), last_name (2-50), username (3-20, alphanumeric+_), email (valid), password (min 8, 1 upper, 1 lower, 1 number, 1 special), confirm_password (must match), country (required), accept_terms (must be true), newsletter (optional)
- loginSchema: email (required, valid), password (required), remember_me (optional)
- forgotPasswordSchema: email (required, valid)
- resetPasswordSchema: password (same rules as register), confirm_password (must match)

### Supabase Clients
- src/lib/supabase/server.ts — createClient() for Server Components and Server Actions (uses @supabase/ssr createServerClient with cookies)
- src/lib/supabase/admin.ts — createAdminClient() for service-role operations (server-only, uses SUPABASE_SERVICE_ROLE_KEY)
- src/lib/supabase/client.ts — createBrowserClient() for Client Components
- src/lib/supabase/middleware.ts — createMiddlewareClient() for middleware

### Security
- HTTPS only (Vercel enforces)
- HTTP-only cookies (Supabase SSR default)
- SameSite=Lax cookies
- Rate limiting on auth endpoints
- No seed phrase or private key collection (ever)
- Generic login errors (no email enumeration)
- Forgot password always shows success
- Input validation (Zod) on client + server
- RLS on profiles, user_roles, activity_logs

### Accessibility (WCAG 2.1 AA)
- All form fields keyboard navigable
- Labels associated with inputs (htmlFor)
- Error text in aria-live region
- Password toggle is a button with aria-label
- Focus indicators (:focus-visible ring)
- Heading hierarchy: h1 for page title

### SEO
- All auth pages: noindex, nofollow
- Page titles: "Login | TWallet Services", "Register | TWallet Services", etc.

### File Structure
src/
├── middleware.ts
├── app/
│   └── auth/
│       ├── layout.tsx              (AuthLayout — centered card, brand logo)
│       ├── register/page.tsx
│       ├── login/page.tsx
│       ├── forgot-password/page.tsx
│       ├── reset-password/page.tsx
│       └── verify-email/page.tsx
├── lib/
│   ├── supabase/
│   │   ├── server.ts
│   │   ├── admin.ts
│   │   ├── client.ts
│   │   └── middleware.ts
│   └── validations/
│       └── auth.ts
└── components/
    └── auth/
        ├── AuthLayout.tsx
        ├── PasswordStrengthMeter.tsx
        ├── TrustNotice.tsx
        └── PasswordToggle.tsx

### Environment Variables
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=... (server-only, never in client)
NEXT_PUBLIC_SITE_URL=https://twalletservices.com

Generate all files with full TypeScript types, strict mode, no `any`. Follow the TWallet Services Design System (Book 04) for all visual elements. Ensure all acceptance criteria (AC-AU-01 through AC-AU-16) are satisfied.
```

---

## 34. Glossary

| Term                | Definition                                                        |
| ------------------- | ----------------------------------------------------------------- |
| JWT                 | JSON Web Token — used for session management by Supabase Auth.    |
| HTTP-only cookie    | Cookie inaccessible to JavaScript; prevents XSS-based theft.      |
| SameSite            | Cookie attribute controlling cross-site sending.                  |
| Service-role key    | Supabase server-side key bypassing RLS; server-only.              |
| RLS                 | Row Level Security — per-row access control in Postgres.          |
| Zod                 | TypeScript-first schema validation library.                       |
| Server Action       | Next.js 15 feature for server-side form handling.                 |
| Middleware          | Next.js edge middleware for route guarding.                       |
| OTP                 | One-Time Password (used in email verification and reset links).   |
| `auth.uid()`        | Supabase function returning the current user's UUID.              |

---

## 35. References

- Book 02 — Business Requirements (FR-02-001..008, §9.2)
- Book 04 — Design System (component APIs, tokens, states)
- Book 05 — Software Requirements Specification (SFR-02-001..008, §8.1; auth state machine, §6.1; acceptance criteria, §23.1)
- Book 06 — User Experience & User Flows (registration flow, §8; login flow, §9; verification flow, §10; page specs, §5.2)
- Book 08 — Database Schema (profiles, §4.1; roles, §4.2; user_roles, §4.3; activity_logs, §9.2; handle_new_user trigger, §13.1)
- Book 03 — Information Architecture (auth routes, §8; access control, §13)
- `00-Project/TECH_STACK.md`
- `AGENTS.md`

---

## Next Book

**Book 10 — Wallet Integration** (`06-Wallet/BOOK_10_WALLET_INTEGRATION.md`): the complete, implementation-ready specification for the wallet connection module — WalletConnect v2, MetaMask, Coinbase Wallet, and Trust Wallet via wagmi + viem. Covers connection/disconnect flows, network validation, Supabase queries, server actions, and a full OpenCode prompt. The platform never requests or stores private keys or seed phrases.

---

> End of Book 09 — Authentication System. This document is the complete, implementation-ready specification for the authentication module. Any change to auth flows, validation, security, or routes requires a version bump in this book and a `00-Project/CHANGELOG.md` entry.
