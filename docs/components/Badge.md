# Badge (UI-007)

Status indicator with color variants.

## Variants

| Variant | Color |
|---------|-------|
| `success` | Green (emerald) |
| `warning` | Amber |
| `error` | Red |
| `info` | Blue |
| `primary` | Solid blue |
| `secondary` | Gray |
| `neutral` | Light gray |

## Sizes

`sm` · `md` · `lg`

## Props

| Prop | Type | Default |
|------|------|---------|
| variant | `BadgeVariant` | `secondary` |
| size | `'sm' \| 'md' \| 'lg'` | `md` |
| dot | `boolean` | — |
| count | `number` | — |

## Use Cases

- Order status (`success`, `warning`, `error`)
- Payment status
- Admin roles (`primary`, `secondary`)
- Notification counts (`count` prop)

## Implementation

`src/components/ui/badge/badge.tsx`
