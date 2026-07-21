# Component Rules

## Every Component MUST

| Requirement | Description |
|-------------|-------------|
| Single responsibility | One component, one job |
| Reusable | Generic props, no hardcoded business logic |
| Fully typed | TypeScript interface for all props |
| Accessible | WCAG 2.1 AA, keyboard navigation, aria attributes |
| Responsive | Mobile-first, works at all breakpoints |
| Dark theme ready | Uses CSS variables from theme tokens |
| Light theme first | Implement light theme, dark theme follows |
| Documented | JSDoc or markdown documentation |
| Tested | Unit tests for logic, integration for interactions |

## Component File Structure

```typescript
// component-name.tsx
'use client'; // Only if needed

import { ... } from '...';

interface ComponentNameProps {
  // Fully typed props
}

export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  return (
    // Accessible, responsive JSX
  );
}
```

## Component Categories

| Category | Location | Description |
|----------|----------|-------------|
| UI primitives | `src/components/ui/` | Button, Input, Card, Badge, etc. |
| Feature components | `src/features/{name}/components/` | WalletCard, OrderList, PaymentForm |
| Layout components | `src/components/` | Header, Footer, Sidebar |
| Domain components | `src/components/domain/` | WalletCard, PaymentCard (complex domain) |

## AI Decision Tree for Components

```text
Need a new component?
    │
    ▼
Does one already exist in src/components/ui/?
    │
    ├── YES → Reuse it (or extend with composition)
    │
    └── NO → Create a reusable component
                │
                ├── Place in src/components/ui/ (if generic)
                ├── Place in src/features/{name}/components/ (if feature-specific)
                │
                ├── Document it (JSDoc + docs/components/{name}.md)
                ├── Add tests
                └── Use it everywhere it's needed
```

## File Size Limits

| File Type | Preferred Max |
|-----------|---------------|
| React component | < 300 lines |
| Service | < 250 lines |
| Hook | < 200 lines |
| Utility | Small and focused |

Split large files instead of creating "god files."

## What NOT to Do

```typescript
// ❌ No class components
class MyComponent extends React.Component { ... }

// ❌ No default exports (use named exports)
export default function Button() { ... }

// ❌ No inline styles
<div style={{ color: 'red' }} />

// ❌ No prop spreading without typing
function Button(props: any) { ... }

// ✅ Named export, typed props, Tailwind classes
export function Button({ variant = 'primary', children }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }))}>{children}</button>;
}
```
