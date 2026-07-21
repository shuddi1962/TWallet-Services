# Task 012: Auth Pages

## Goal
Build all authentication pages with full UI, validation, error/loading/success states, and accessibility.

## Requirements
- /auth/login — Email input, submit, loading, error states
- /auth/register — Name, email, password, confirm password
- /auth/verify — OTP/email verification with resend
- /auth/forgot-password — Email input, success state
- /auth/reset-password — New password, confirm, success
- /auth/callback — Magic link / OAuth callback handler
- All pages: noindex (SEO), responsive, WCAG 2.1 AA

## Dependencies
- Task 010 (Supabase client setup)
- Task 011 (middleware + route guards)
- Task 013 (auth server actions)
- Task 006 (UI components)

## Files
```
src/app/auth/
├── login/
│   └── page.tsx
├── register/
│   └── page.tsx
├── verify/
│   └── page.tsx
├── forgot-password/
│   └── page.tsx
├── reset-password/
│   └── page.tsx
└── callback/
    └── route.ts
```

## References
- `docs/BOOK-09/BOOK_09_AUTHENTICATION_SYSTEM.md`
- `docs/BOOK-06/BOOK_06_USER_EXPERIENCE_AND_USER_FLOWS.md` (auth flows)

## Acceptance Criteria
- [ ] All auth pages render with correct forms
- [ ] 14+ error states handled (invalid email, weak password, expired link, etc.)
- [ ] Loading states with skeleton/spinner
- [ ] Success states with clear next steps
- [ ] All forms keyboard-navigable
- [ ] Screen reader friendly (aria-labels, live regions)
- [ ] Responsive (mobile + desktop)
- [ ] noindex meta tag on all auth pages
- [ ] All translations/internationalization hooks ready

## Testing
- E2E: Register → Verify → Login → Logout
- E2E: Forgot password → Reset → Login
- E2E: Invalid email shows error
- E2E: Weak password shows error
- E2E: Expired link shows error
- A11y: axe-core scan passes on all auth pages
- Responsive: All pages at 375px, 768px, 1440px
