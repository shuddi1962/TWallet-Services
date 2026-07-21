# Toast (UI-023)

Temporary notification popup. Built on Radix Toast.

## Types

| Type | Icon | Style |
|------|------|-------|
| `success` | CheckCircle2 | Emerald background |
| `info` | Info | Blue background |
| `warning` | AlertTriangle | Amber background |
| `error` | AlertCircle | Red background |
| `loading` | Loader2 | White background |

## Props

| Prop | Type | Default |
|------|------|---------|
| open | `boolean` | required |
| onOpenChange | `(open: boolean) => void` | required |
| type | `ToastType` | `info` |
| title | `string` | required |
| message | `string` | — |
| duration | `number` | `5000` |

## Accessibility

- Radix Toast ARIA live region
- Swipe to dismiss
- Close button with focus ring

## Implementation

`src/components/ui/toast/toast.tsx`
