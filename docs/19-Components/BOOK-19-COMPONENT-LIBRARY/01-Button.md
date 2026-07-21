# Button

> **Import:** `import { Button } from '@/components/ui/button'`

## Variants

| Variant | Class | Usage |
|---------|-------|-------|
| Primary | `variant="primary"` | Main CTA, submit forms |
| Secondary | `variant="secondary"` | Alternative actions |
| Outline | `variant="outline"` | Subtle actions |
| Ghost | `variant="ghost"` | Minimal, toolbars |
| Danger | `variant="danger"` | Destructive actions (delete) |
| Link | `variant="link"` | Text-only button |

## Sizes

| Size | Class | Height |
|------|-------|--------|
| xs | `size="xs"` | 28px |
| sm | `size="sm"` | 32px |
| md | `size="md"` | 40px (default) |
| lg | `size="lg"` | 48px |
| xl | `size="xl"` | 56px |

## States

| State | Visual |
|-------|--------|
| Default | Normal colors |
| Hover | Slightly darker bg / underline (link) |
| Active | Press effect (scale 0.98) |
| Disabled | Opacity 50%, pointer-events none |
| Loading | Spinner replaces icon, text preserved |
| Focus | Ring-2 offset-2 (keyboard only) |

## Props

```ts
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  asChild?: boolean;  // Slot support (Radix)
}
```

## Accessibility

- `role="button"` (default for `<button>`)
- `aria-disabled` when disabled
- `aria-busy="true"` when loading
- Focus visible ring on keyboard nav only
