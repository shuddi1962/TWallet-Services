# Button (UI-001)

Primary user action component.

## Variants

| Variant | Usage |
|---------|-------|
| `primary` | Primary CTA on every page |
| `secondary` | Secondary action (e.g., Cancel) |
| `outline` | Subtle bordered action |
| `ghost` | Minimal hover-only action |
| `destructive` | Irreversible actions (delete) |
| `success` | Confirm/success actions |
| `warning` | Caution actions |
| `link` | Inline link styled as text |

## Sizes

`xs` · `sm` · `md` · `lg` · `xl`

## States

Default · Hover · Focus · Active · Loading · Disabled

## Props

| Prop | Type | Default |
|------|------|---------|
| variant | `ButtonVariant` | `primary` |
| size | `ButtonSize` | `md` |
| loading | `boolean` | `false` |
| icon | `ReactNode` | — |
| iconPosition | `'left' \| 'right'` | `left` |
| asChild | `boolean` | `false` |
| disabled | `boolean` | `false` |

## Accessibility

- Keyboard focus ring (2px offset)
- `aria-busy` during loading
- `disabled` attribute prevents interaction
- Radix Slot support for custom child elements

## Implementation

`src/components/ui/button/button.tsx`
