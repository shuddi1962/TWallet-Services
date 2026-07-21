# Cross-Browser Testing

## Supported Browsers

| Browser | Versions | Test Priority |
|---------|----------|---------------|
| Google Chrome | Latest 2 major | Critical |
| Mozilla Firefox | Latest 2 major | High |
| Apple Safari | Latest 2 major | High |
| Microsoft Edge | Latest 2 major | Medium |

## Testing Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Auth (login/register) | ✓ | ✓ | ✓ | ✓ |
| Wallet connection | ✓ | ✓ | ✓ | ✓ |
| Card ordering | ✓ | ✓ | ✓ | ✓ |
| Payment flow | ✓ | ✓ | ✓ | ✓ |
| Customer dashboard | ✓ | ✓ | ✓ | ✓ |
| Admin dashboard | ✓ | ✓ | ✓ | ✓ |
| File uploads | ✓ | ✓ | ✓ | ✓ |
| Notifications | ✓ | ✓ | ✓ | ✓ |
| Landing page | ✓ | ✓ | ✓ | ✓ |
| Animations | ✓ | ✓ | ✓ — reduced motion | ✓ |

## Automated Testing

Playwright runs E2E tests across all three browser engines (chromium, firefox, webkit) in CI.

## Manual Testing

Before every release:

1. Run E2E test suite in all browsers
2. Visual regression check (Safari layout differences)
3. WalletConnect modal behavior (Safari + Firefox)
4. File upload in all browsers
5. Form submission and validation in all browsers
