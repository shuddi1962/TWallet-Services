# Select (UI-004)

Dropdown select with optional search. Built on Radix Select.

## Variants

| Size | Class |
|------|-------|
| `sm` | h-8 text-xs |
| `md` | h-10 text-sm |
| `lg` | h-12 text-base |

## Props

| Prop | Type | Default |
|------|------|---------|
| options | `SelectOption[]` | required |
| value | `string` | — |
| onValueChange | `(value: string) => void` | — |
| label | `string` | — |
| placeholder | `string` | `'Select...'` |
| error | `string` | — |
| disabled | `boolean` | — |
| searchable | `boolean` | `false` |
| size | `'sm' \| 'md' \| 'lg'` | `md` |

## Accessibility

- Radix Select ARIA attributes
- Keyboard navigation (arrow keys)
- Search filter for large option lists

## Implementation

`src/components/ui/select/select.tsx`
