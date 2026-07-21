# UI Rules

## Design Style

| Attribute | Specification |
|-----------|---------------|
| Style | Modern SaaS, professional, enterprise-grade |
| Theme | Light theme first, dark theme via CSS variables |
| Primary color | Blue (see design tokens) |
| Border radius | `rounded-xl` for cards, `rounded-lg` for buttons |
| Shadows | Soft, layered (see design tokens — 5 levels) |
| Animations | Smooth, purposeful (Framer Motion) |
| Layout | Minimal, clean, generous whitespace |
| Typography | Inter (headings + body), JetBrains Mono (code) |

## UI Component Patterns

### Button

```typescript
<Button variant="primary" size="md" disabled={isLoading}>
  {isLoading ? <Spinner /> : 'Connect Wallet'}
</Button>
```

### Card

```typescript
<Card variant="elevated" padding="lg">
  <CardHeader>
    <CardTitle>Balance</CardTitle>
    <CardDescription>Your current wallet balance</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-3xl font-bold">{balance} ETH</p>
  </CardContent>
</Card>
```

### Form

```typescript
<form action={createOrder}>
  <FormField name="cardType" label="Card Type">
    <Select>
      <option value="virtual">Virtual Card</option>
      <option value="physical">Physical Card</option>
    </Select>
  </FormField>
  <Button type="submit">Order Card</Button>
</form>
```

## Accessibility Requirements

| Requirement | Standard |
|-------------|----------|
| Keyboard navigation | All interactive elements reachable via Tab |
| Focus indicators | Visible focus ring on all interactive elements |
| ARIA labels | Every icon button has `aria-label` |
| Screen reader | Semantic HTML, proper heading hierarchy |
| Color contrast | WCAG AA (4.5:1 for text, 3:1 for large text) |
| Touch targets | Minimum 44×44px for mobile |
| Form labels | Every input has associated `<label>` |
| Error messages | Errors associated with inputs via `aria-describedby` |

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column |
| Tablet | 640–1024px | 2 columns |
| Desktop | > 1024px | Multi-column |

## Animation Guidelines

| Use | Avoid |
|-----|-------|
| Page transitions (fade) | Unnecessary movement |
| Micro-interactions (hover, click) | Slow animations (> 300ms) |
| Skeleton loading | Layout-shifting content |
| Staggered list reveals | Animations that block interaction |

## What NOT to Do

```typescript
// ❌ No hardcoded colors
<div className="text-[#1a73e8]">Bad</div>

// ✅ Use theme tokens
<div className="text-primary">Good</div>

// ❌ No unscoped global styles
// .my-class { color: red; }

// ✅ Use Tailwind utility classes
<div className="text-red-500">Good</div>
```
