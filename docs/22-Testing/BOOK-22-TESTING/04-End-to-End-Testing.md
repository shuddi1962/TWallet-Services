# End-to-End Testing

## Framework

**Playwright** — cross-browser, mobile emulation, network interception.

## Critical User Journeys

| # | Journey | Priority |
|---|---------|----------|
| 1 | Register → Verify email → Login | Critical |
| 2 | Browse cards → Select product | High |
| 3 | Connect wallet → Sign message | Critical |
| 4 | Create order → Enter shipping → Submit | Critical |
| 5 | Copy receiving address → Make payment | Critical |
| 6 | View order → Track status updates | High |
| 7 | Customer dashboard → View stats | Medium |
| 8 | Open support ticket → Send message | Medium |
| 9 | Admin login → View dashboard | Critical |
| 10 | Admin → Manage orders → Change status | High |
| 11 | Admin → Reply to support ticket | Medium |
| 12 | User → Settings → Update profile | Medium |
| 13 | User → Settings → Delete account | High |

## Playwright Configuration

```ts
// playwright.config.ts
import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"]],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "firefox", use: { browserName: "firefox" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
})
```

## E2E Test Pattern

```ts
// e2e/auth.spec.ts
import { test, expect } from "@playwright/test"

test("user can register, verify, and login", async ({ page }) => {
  await page.goto("/auth/register")
  await page.fill("[name=email]", "test@example.com")
  await page.fill("[name=password]", "TestPass123!")
  await page.click("button[type=submit]")
  await expect(page.locator("text=Verify your email")).toBeVisible()
})

test("user can connect wallet", async ({ page }) => {
  await page.goto("/app/wallet")
  await page.click("text=Connect Wallet")
  await expect(page.locator("text=Connected")).toBeVisible()
})
```

## Test Environments

| Environment | URL | Data |
|-------------|-----|------|
| Local | http://localhost:3000 | Fresh seed data |
| Preview | PR-specific URL | Branch Supabase |
| Staging | staging.twalletservices.com | Copy of prod data |
