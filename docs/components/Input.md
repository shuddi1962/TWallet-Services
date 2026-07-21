# Input (UI-002)

Form text input component with validation states.

## Types

`text` · `email` · `password` · `phone` · `number` · `search` · `url`

## States

Default · Focus · Error · Success · Disabled · Loading · ReadOnly

## Props

| Prop | Type | Default |
|------|------|---------|
| type | `InputType` | `text` |
| label | `string` | — |
| error | `string` | — |
| hint | `string` | — |
| success | `boolean` | — |
| loading | `boolean` | — |
| icon | `ReactNode` | — |
| disabled | `boolean` | — |

## Accessibility

- Label linked via `htmlFor`/`id`
- `aria-invalid` on error
- `aria-describedby` for error/hint
- Password toggle with `aria-label`
- Focus ring (2px offset)

## Implementation

`src/components/ui/input/input.tsx`
