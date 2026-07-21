# Marketing Funnel

## Funnel Stages

```text
Awareness        Consideration       Decision          Retention        Advocacy
   │                  │                  │                  │                │
   ▼                  ▼                  ▼                  ▼                ▼
Visitor ──► Landing ──► Wallet    ──► Order   ──► Payment ──► Card    ──► Referral
         SEO    Page   Connect        Card       Confirm     Active         Friend
```

## Funnel by Page

| Stage | Page | Primary Actions | Metric |
|-------|------|-----------------|--------|
| Awareness | Blog, Social, Ads | Visit landing page | Sessions, Impressions |
| Consideration | Pricing, Features, Security | Browse plans, read FAQ | Time on page, scroll depth |
| Decision | Signup, Card selection | Connect wallet, create account | Registration rate |
| Conversion | Checkout | Pay, confirm order | Payment completion rate |
| Retention | Dashboard, Support | Use card, contact support | Active users, ticket volume |
| Advocacy | Referral | Share, invite friends | Referral conversion rate |

## Conversion Tracking Events

### Top-of-Funnel

| Event | Trigger | Destination |
|-------|---------|-------------|
| `page_view` | Any page load | Analytics |
| `blog_read` | Scroll to 75% of blog post | Analytics |
| `cta_click` | Click on CTA button | Analytics |
| `pricing_viewed` | Pricing page visit | Analytics |

### Middle-of-Funnel

| Event | Trigger | Destination |
|-------|---------|-------------|
| `wallet_connect_start` | User initiates wallet connection | Analytics |
| `wallet_connect_success` | Wallet connected successfully | Analytics |
| `wallet_connect_failed` | Wallet connection failed | Analytics + Sentry |
| `card_product_viewed` | User views a card product | Analytics |
| `registration_started` | User begins registration | Analytics |
| `registration_completed` | User completes registration | Analytics |

### Bottom-of-Funnel

| Event | Trigger | Destination |
|-------|---------|-------------|
| `order_started` | User begins checkout | Analytics |
| `order_completed` | Order confirmed | Analytics |
| `payment_initiated` | Payment transaction sent | Analytics |
| `payment_confirmed` | On-chain verification success | Analytics + Business |
| `payment_failed` | On-chain verification failure | Analytics + Sentry |

## Funnel Optimization

| Funnel Stage | Optimization | Metric |
|-------------|--------------|--------|
| Landing → Connect | Improve hero CTA, reduce friction | CTA click rate |
| Connect → Register | Social proof, trust signals | Connection-to-registration rate |
| Register → Order | Simplify card selection, show pricing | Registration-to-order rate |
| Order → Pay | Streamline checkout, multiple tokens | Checkout abandonment rate |
| Pay → Confirm | Improve verification UX, status updates | Payment confirmation rate |
| Confirm → Referral | Post-purchase email, referral incentive | Referral rate |
