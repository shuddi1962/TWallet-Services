# Payment Card (UI-028)

Displays payment transaction details.

## Status

| Status | Badge |
|--------|-------|
| `pending` | Warning |
| `confirmed` | Success |
| `failed` | Error |
| `flagged` | Error |
| `refunded` | Info |

## Props

| Prop | Type |
|------|------|
| amount | `string` |
| currency | `string` |
| network | `string` |
| status | `PaymentStatus` |
| txHash | `string` |
| confirmations | `number` |
| minConfirmations | `number` |
| onViewExplorer | `() => void` |
| onCopyTx | `() => void` |

## Features

- Gradient green card background
- Status badge
- Large amount display
- Transaction hash (shortened + copy/explorer)
- Confirmation progress (colored based on threshold)

## Implementation

`src/components/ui/crypto/payment-card.tsx`
