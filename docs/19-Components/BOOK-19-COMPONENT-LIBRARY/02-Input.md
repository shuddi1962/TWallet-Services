# Input

> **Import:** `import { Input, Textarea, Select } from '@/components/ui/input'`

## Types

| Type | HTML | Usage |
|------|------|-------|
| Text | `type="text"` | Names, short text |
| Email | `type="email"` | Email addresses |
| Password | `type="password"` | With show/hide toggle |
| Number | `type="number"` | Numeric values (amounts, fees) |
| Search | `type="search"` | Search bars with clear button |
| Phone | `type="tel"` | Phone number input |

## Props

```ts
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}
```

## States

- **Default** — border, label, placeholder
- **Focus** — primary ring
- **Error** — danger border + error message
- **Disabled** — opacity 50%, no interaction
- **Read-only** — muted bg, no border change
- **With icon** — icon inside input (left: prefix, right: password toggle)

## Password Input

- Show/hide toggle button (eye icon)
- `aria-label="Toggle password visibility"`

## Accessibility

- `<label>` element linked via `htmlFor`
- `aria-invalid` on error
- `aria-describedby` for hint/error
- Error message has `role="alert"`
