# Card (UI-017)

Content container with multiple visual variants.

## Variants

| Variant | Usage |
|---------|-------|
| `default` | General purpose white card |
| `glass` | Frosted glass effect |
| `dashboard` | Dashboard stat cards |
| `wallet` | Gradient blue wallet card |
| `payment` | Gradient green payment card |
| `analytics` | Chart/analytics container |
| `order` | Order summary card |
| `notification` | Notification with color border |
| `support` | Support ticket card |
| `admin` | Admin panel card |

## Sub-components

- `CardHeader` — header section
- `CardTitle` — h3 title
- `CardDescription` — subtitle text
- `CardContent` — main body
- `CardFooter` — bottom actions with border

## Props

| Prop | Type | Default |
|------|------|---------|
| variant | `CardVariant` | `default` |
| padding | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `md` |
| onClick | `() => void` | — |

## Implementation

`src/components/ui/card/card.tsx`
