# Analytics

## Tracking Requirements

| Category | Events | Tool |
|----------|--------|------|
| Traffic | Page views, sessions, referrers | Vercel Analytics + PostHog |
| Engagement | Scroll depth, time on page, clicks | PostHog |
| Conversion | Signups, orders, payments | PostHog + Custom |
| Marketing | Campaign attribution, UTM params | PostHog |
| Performance | Core Web Vitals | Vercel Analytics |
| Errors | JS errors, API failures | Sentry |

## Tracked Events

### Page Views

```typescript
// src/lib/analytics.ts
import { posthog } from 'posthog-js';

export function trackPageView(url: string) {
  posthog.capture('$pageview', { url });
}
```

### User Actions

```typescript
// Events to track
export function trackEvent(name: string, properties?: Record<string, unknown>) {
  posthog.capture(name, properties);
}

// Usage
trackEvent('wallet_connected', { walletType: 'metaMask', network: 'ethereum' });
trackEvent('order_created', { cardType: 'virtual', amount: 50 });
trackEvent('payment_submitted', { txHash: '0x...', amount: 0.5, token: 'USDC' });
```

### User Identification

```typescript
// After user registers / logs in
export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  posthog.identify(userId, traits);
}

// Usage
identifyUser(user.id, {
  email: user.email,
  role: user.role,
  walletConnected: user.wallets.length > 0,
  createdAt: user.created_at,
});
```

## Analytics Integration

```typescript
// src/components/providers/analytics-provider.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { posthog } from 'posthog-js';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false,
      loaded: (ph) => {
        if (process.env.NODE_ENV !== 'production') ph.opt_out_capturing();
      },
    });
  }, []);

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    posthog.capture('$pageview', { url });
  }, [pathname, searchParams]);

  return <>{children}</>;
}
```

## Dashboard Metrics

| Dashboard | Metrics | Refresh |
|-----------|---------|---------|
| Traffic | Visitors, page views, top pages, bounce rate | Real-time |
| Acquisition | Referral sources, campaigns, UTM analysis | Daily |
| Behavior | Flow, retention, session duration | Daily |
| Conversion | Funnel analysis, conversion rate | Daily |
| Revenue | MRR, ARPU, LTV, churn rate | Daily |
| Marketing | Campaign ROI, CAC, channel attribution | Weekly |

## UTM Parameter Strategy

All marketing links use UTM parameters:

```
https://twallet.app/?utm_source=twitter&utm_medium=social&utm_campaign=product-launch
https://twallet.app/pricing?utm_source=newsletter&utm_medium=email&utm_campaign=weekly-digest
https://twallet.app/blog/web3-wallet-guide?utm_source=google&utm_medium=organic
```

## Data Privacy

- Analytics must not collect PII beyond business necessity
- IP anonymization enabled
- Opt-out mechanism available for users
- GDPR-compliant cookie consent (see Book 21)
- No analytics data shared with third parties
