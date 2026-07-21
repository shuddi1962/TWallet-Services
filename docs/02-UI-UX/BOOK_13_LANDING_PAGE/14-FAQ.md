# 14 — FAQ

> Component ID: LP-013 | Status: Approved
> Accordion with 10 frequently asked questions. One item expanded at a time.

## Purpose

Answer the most common questions visitors have before registering. Reduce friction in the conversion funnel.

## Section Specs

| Property | Value |
|----------|-------|
| Background | `--color-surface` (#FFFFFF) |
| Section heading | "Frequently Asked Questions" (`--text-section`, 700, `--color-heading`) |
| Subtext | "Everything you need to know about TWallet Services." (`--text-body`, `--color-body`) |
| Padding | `--space-30` (120px) vertical desktop, `--space-16` (64px) mobile |
| Layout | Centered, max-width 768px |

## Questions (10)

| # | Question | Answer |
|---|----------|--------|
| 1 | What is TWallet Services? | TWallet Services is a non-custodial crypto card platform. Connect your wallet, order a virtual or physical card, pay with crypto, and manage everything from one dashboard. |
| 2 | How do I connect my wallet? | Navigate to the Wallet page in your dashboard, click "Connect Wallet," and choose MetaMask, Coinbase Wallet, Trust Wallet, or any WalletConnect-compatible wallet. We never ask for your seed phrase. |
| 3 | Which cryptocurrencies are supported? | We support USDC, USDT, ETH, BNB, and MATIC across Ethereum, Polygon, BNB Smart Chain, Arbitrum, Optimism, Base, and Avalanche. |
| 4 | How long does card delivery take? | Virtual cards are delivered instantly after payment verification. Physical cards are shipped within 3-5 business days. |
| 5 | Can I order a virtual card? | Yes. Virtual cards are available for $25 USDC and are delivered instantly. Perfect for online purchases. |
| 6 | Which countries are supported? | We currently support 50+ countries for physical card shipping. Check the order form for your country availability. |
| 7 | Can I track my order? | Yes. Once your payment is verified, you can track your order from the Orders page in your dashboard. You'll see status updates in real-time. |
| 8 | Do you store my private keys? | No. We never store private keys, seed phrases, or recovery phrases. We only see your public wallet address. Your wallet stays yours. |
| 9 | Can I connect multiple wallets? | In the MVP, you can connect one wallet at a time. You can disconnect and reconnect with a different wallet anytime. Multiple simultaneous wallets will be supported in a future release. |
| 10 | How do refunds work? | Refunds are handled on a case-by-case basis by our support team. If you need a refund, open a support ticket from your dashboard and our team will assist you. |

## Component

- **Accordion** — Radix UI Accordion (styled per Book 04)
- **One item expanded at a time** — `type="single"` with `collapsible`
- **First item open by default** — helps users see the pattern
- **Search functionality** — Future (not in MVP)

## Accordion Item Design

| Property | Value |
|----------|-------|
| Background | `--color-surface` (#FFFFFF) |
| Border | 1px `--color-border` (between items) |
| Radius | `--radius-button` (14px) on each item |
| Padding | `--space-4` (16px) vertical, `--space-6` (24px) horizontal |
| Trigger | Question text (16px, 500, `--color-heading`) + chevron icon (right) |
| Content | Answer text (14px, `--color-body`, line-height 1.6) |
| Open state | `--color-primary-light` bg tint on trigger; chevron rotates 180deg |

## Below Accordion

- "View All FAQs" link → `/faq` (secondary button, centered)
- "Still have questions? Contact Support" link → `/support` (ghost link)

## Component Tree

```
FAQ (Client Component — Radix Accordion)
├── SectionHeader
│   ├── Heading ("Frequently Asked Questions")
│   └── Subtext ("Everything you need to know about TWallet Services.")
├── Accordion (Radix UI, type="single", collapsible)
│   ├── AccordionItem ("What is TWallet Services?")
│   ├── AccordionItem ("How do I connect my wallet?")
│   ├── AccordionItem ("Which cryptocurrencies are supported?")
│   ├── AccordionItem ("How long does card delivery take?")
│   ├── AccordionItem ("Can I order a virtual card?")
│   ├── AccordionItem ("Which countries are supported?")
│   ├── AccordionItem ("Can I track my order?")
│   ├── AccordionItem ("Do you store my private keys?")
│   ├── AccordionItem ("Can I connect multiple wallets?")
│   └── AccordionItem ("How do refunds work?")
└── Links
    ├── LinkButton ("View All FAQs" → /faq)
    └── Link ("Still have questions? Contact Support" → /support)
```

## Animations

| Animation | Element | Duration | Trigger |
|-----------|---------|----------|---------|
| Accordion expand | Content height | 200ms easeOut | Click/Enter/Space |
| Chevron rotate | Icon | 200ms | Toggle |
| Section fade-in | Whole section | 300ms | Scroll into view |

### prefers-reduced-motion
- Disable: height animation (instant expand/collapse)
- Chevron: instant rotate

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Accordion | Radix UI (ARIA-compliant by default) |
| Section label | `<section aria-label="FAQ">` |
| Accordion root | `aria-label="Frequently Asked Questions"` |
| Keyboard | Tab to move between triggers; Enter/Space to toggle; Up/Down to navigate |
| Screen reader | Announces expanded/collapsed state |
| First item | Open by default (`defaultValue="item-0"`) |

## Schema.org (JSON-LD)

Add `FAQPage` structured data for rich search results:

```ts
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};
```

Render in `<script type="application/ld+json">` at page level.
