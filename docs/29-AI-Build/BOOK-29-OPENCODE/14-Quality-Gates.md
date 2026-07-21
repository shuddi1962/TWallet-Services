# Quality Gates

## No Feature Is Complete Until

| Gate | Check | Tool/Command |
|------|-------|--------------|
| ✓ TypeScript passes | `npm run typecheck` | TypeScript |
| ✓ ESLint passes | `npm run lint` | ESLint |
| ✓ Tests pass | `npm run test` | Vitest |
| ✓ E2E tests pass | `npm run test:e2e` | Playwright |
| ✓ Build passes | `npm run build` | Next.js |
| ✓ Documentation updated | PR includes doc changes | Manual |
| ✓ Responsive | Tested on mobile + tablet + desktop | Browser DevTools |
| ✓ Accessible | WCAG 2.1 AA verified | axe-core + manual |
| ✓ Secure | No secrets, RLS, validation | Code review |
| ✓ Production Ready | All gates passed | CI pipeline |

## Definition of Done

```text
Code Complete
    ↓
Tests Pass (unit + integration + E2E)
    ↓
Documentation Updated (code + API + DB + changelog)
    ↓
Code Review Passed (at least 1 approval)
    ↓
Production Build Succeeds (npm run build)
    ↓
Deploy Preview Successful
    ↓
Ready for Production
```

## Error Handling Standard

```text
User:    Friendly message (no stack traces, no technical jargon)
         ↓
App:     Structured error with code + message
         ↓
Logs:    Detailed error with context (requestId, userId, action)
         ↓
Monitor: Sentry capture + alert if critical
```

## AI Decision Tree

```text
Need a new component?
    │
    ├── Does one already exist?
    │   ├── YES → Reuse it
    │   └── NO → Create it (reusable, typed, tested, documented)
    │
Need a new page?
    │
    ├── metadata, loading, error, empty states added?
    │   ├── YES → Good
    │   └── NO → Add them
    │
Need a database query?
    │
    ├── Indexed? Paginated? RLS checked?
    │   ├── YES → Good
    │   └── NO → Fix
    │
Need to deploy?
    │
    ├── All quality gates passed?
    │   ├── YES → Deploy
    │   └── NO → Fix
```

## File Size Limits

| File Type | Preferred Max |
|-----------|---------------|
| React component | < 300 lines |
| Service | < 250 lines |
| Hook | < 200 lines |
| Utility | Small and focused |

Split large files. No "god files."

## Completion Checklist

```text
Project Structure     ☐ (set up before coding)
Authentication        ☐
Wallet Integration    ☐
Payments              ☐
Dashboard             ☐
Admin                 ☐
Support               ☐
Notifications         ☐
Database              ☐
Storage               ☐
Testing               ☐
Deployment            ☐
Performance           ☐
Security              ☐
Monitoring            ☐
Documentation         ☐
Production Ready      ☐
```
