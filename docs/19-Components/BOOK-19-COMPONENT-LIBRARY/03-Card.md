# Card

> **Import:** `import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'`

## Variants

| Variant | Usage |
|---------|-------|
| `variant="default"` | Standard white card with shadow |
| `variant="interactive"` | Hover lift effect, clickable |
| `variant="stat"` | Stat display (icon + value + label) |
| `variant="product"` | Card product display (image + price) |
| `variant="bordered"` | Border only, no shadow |

## Props

```ts
interface CardProps {
  variant?: 'default' | 'interactive' | 'stat' | 'product' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  asChild?: boolean;
}
```

## Sub-components

```ts
CardHeader  — title + subtitle + action slot
CardContent — main content area
CardFooter  — action buttons, metadata
```
