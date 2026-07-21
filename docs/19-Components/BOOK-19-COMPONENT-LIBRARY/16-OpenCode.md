# OpenCode — Build Prompt

> Implement the full UI component library from `@/components/ui/` using Radix UI primitives, Tailwind CSS v4, Lucide icons, and Framer Motion. Reference Book 04 (Design System) for all design tokens. Read all 14 spec files in this folder for component APIs, variants, states, and accessibility requirements.

## Pattern

```tsx
'use client';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva('inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', {
  variants: {
    variant: { primary: 'bg-primary text-white hover:bg-primary/90', secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80', outline: 'border border-border bg-transparent hover:bg-accent', ghost: 'hover:bg-accent hover:text-accent-foreground', danger: 'bg-danger text-white hover:bg-danger/90', link: 'text-primary underline-offset-4 hover:underline' },
    size: { xs: 'h-7 px-2 text-xs', sm: 'h-8 px-3 text-sm', md: 'h-10 px-4 text-sm', lg: 'h-12 px-6 text-base', xl: 'h-14 px-8 text-lg' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, loading, icon: Icon, children, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} disabled={loading || props.disabled} {...props}>
      {loading ? <Spinner className="mr-2 h-4 w-4" /> : Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </Comp>
  );
});
Button.displayName = 'Button';
```

## Components to build (15)
Button, Input, Card, Badge, Modal, DataTable, DropdownMenu, EmptyState, Skeleton, Toast, Tabs, Form (react-hook-form + zod), Sidebar, Breadcrumb, Pagination, Alert, Spinner, Avatar, StatCard, Select, Checkbox, Switch, Textarea, Tooltip, Sheet (drawer), Dialog, Popover, Command, Separator, Accordion, Calendar, DateRangePicker.

## Verification
- [ ] All components render without errors
- [ ] All variants render correctly
- [ ] All states (hover, focus, disabled, loading, error) work
- [ ] Keyboard navigation works (Tab, Enter, Escape, Arrow keys)
- [ ] Screen reader announces correctly (VoiceOver, NVDA)
- [ ] Dark mode renders correctly
- [ ] Mobile touch targets ≥ 44×44px
- [ ] Animations use Framer Motion, not CSS animations
- [ ] No unused imports or props
