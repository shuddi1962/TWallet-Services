# Accessibility Tests

> **Tool:** axe-core (Playwright integration) | **Standard:** WCAG 2.1 AA

## Automated

```ts
import { injectAxe, checkA11y } from 'axe-playwright';

test('landing page has no a11y violations', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page, null, {
    includedImpacts: ['critical', 'serious'],
  });
});
```

## Manual Checklist

- [ ] All images have `alt` text
- [ ] All forms have `<label>` elements
- [ ] Color contrast ≥ 4.5:1 for text, ≥ 3:1 for large text
- [ ] All interactive elements keyboard-accessible
- [ ] Focus indicators visible (2px ring)
- [ ] ARIA landmarks: `<nav>`, `<main>`, `<header>`, `<footer>`
- [ ] Error messages linked to inputs via `aria-describedby`
- [ ] Modals trap focus + dismiss on Escape
- [ ] Touch targets ≥ 44×44px
- [ ] Page title is descriptive

# Performance Tests

> **Tools:** Lighthouse CI (page speed), k6 (API load testing)

```js
// tests/k6/api-load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 100 },
    { duration: '1m', target: 0 },
  ],
  thresholds: { http_req_duration: ['p(95)<500'] },
};

export default function () {
  const res = http.get('https://staging.twalletservices.com/api/v1/cards');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

## Lighthouse Budgets

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| TBT | < 200ms |

# Security Tests

> **Areas:** RLS enforcement, auth bypass, SQL injection, XSS, CSRF

```ts
it('cannot access admin without admin role', async () => {
  const { data } = await supabaseRegularUser
    .from('system_settings')
    .select('*');
  expect(data).toBeNull();
});

it('service role bypasses RLS', async () => {
  const { data } = await supabaseAdmin
    .from('system_settings')
    .select('*');
  expect(data?.length).toBeGreaterThan(0);
});
```
