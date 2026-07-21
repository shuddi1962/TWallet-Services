# Modal/Dialog (UI-010)

Overlay dialog for focused tasks. Built on Radix Dialog + Framer Motion.

## Sizes

`sm` (384px) · `md` (448px) · `lg` (512px) · `xl` (576px) · `full` (90vw)

## Props

| Prop | Type | Default |
|------|------|---------|
| open | `boolean` | required |
| onOpenChange | `(open: boolean) => void` | required |
| title | `string` | — |
| description | `string` | — |
| size | `DialogSize` | `md` |
| showClose | `boolean` | `true` |

## Accessibility

- Focus trap within modal
- Escape key closes
- Backdrop click closes (via Radix default)
- `aria-labelledby` via title
- `aria-describedby` via description

## Animations

- Scale + fade in (0.95 → 1, 200ms)
- Backdrop blur + fade

## Implementation

`src/components/ui/dialog/dialog.tsx`
