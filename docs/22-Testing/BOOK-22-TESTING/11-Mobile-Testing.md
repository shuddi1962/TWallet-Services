# Mobile Testing

## Devices

| Category | Devices | Screen Size |
|----------|---------|-------------|
| Phone | iPhone SE, iPhone 14/15 Pro, Samsung Galaxy S23 | 375px – 430px |
| Large phone | iPhone 15 Pro Max, Samsung Galaxy S24 Ultra | 430px |
| Tablet | iPad mini, iPad Air, Samsung Galaxy Tab | 768px – 1024px |

## Playwright Mobile Configuration

```ts
import { devices } from "@playwright/test"

export const mobileProjects = [
  {
    name: "mobile-safari",
    use: { ...devices["iPhone 15 Pro"] },
  },
  {
    name: "mobile-chrome",
    use: { ...devices["Pixel 7"] },
  },
  {
    name: "tablet",
    use: { ...devices["iPad Air"] },
  },
]
```

## Mobile-Specific Tests

| Test | Why |
|------|-----|
| Bottom navigation works | Primary mobile nav pattern |
| Touch targets ≥ 44px | WCAG AA requirement |
| WalletConnect deeplink | Mobile wallet connection flow |
| Modal becomes bottom sheet | Mobile dialog adaptation |
| Horizontal scroll prevented | No overflow on small screens |
| Form inputs don't zoom | Proper viewport meta tag |
| Pull-to-refresh behavior | Native-feeling interaction |

## Emulation vs Real Devices

| Environment | Use | When |
|-------------|-----|------|
| Playwright emulation | Functional testing | Every PR |
| BrowserStack (future) | Real device testing | Pre-release |
| Physical devices | UX + performance | Monthly |

## Mobile Performance Budgets

| Metric | Target (4G) |
|--------|-------------|
| LCP | < 3s |
| TTI | < 5s |
| Bundle size | < 200KB JS |
| First input delay | < 100ms |
