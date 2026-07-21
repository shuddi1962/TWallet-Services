# Badge

> **Import:** `import { Badge } from '@/components/ui/badge'`

## Variants
| Variant | Usage |
|---------|-------|
| `variant="info"` | Neutral info (blue) |
| `variant="success"` | Confirmed, completed (green) |
| `variant="warning"` | Pending, flagged (amber) |
| `variant="danger"` | Failed, urgent (red) |
| `variant="outline"` | Subtle badge |

## Sizes
`sm` (16px), `md` (20px, default), `lg` (24px)

## Shapes
- Pill (default, fully rounded)
- Dot (`variant="dot"` — small colored circle)
- Count (number badge, absolute positioned)

# Modal

> **Import:** `import { Modal, ModalTrigger, ModalContent, ModalHeader, ModalFooter } from '@/components/ui/modal'`

## Variants
| Variant | Width | Usage |
|---------|-------|-------|
| `dialog` | 480px | Confirmations, forms |
| `drawer` | 640px (right) | Detail panels |
| `fullscreen` | 100% | Image viewer |
| `bottom-sheet` | 100% × auto | Mobile actions |

## Props
```ts
interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: 'dialog' | 'drawer' | 'fullscreen' | 'bottom-sheet';
  preventClose?: boolean;
}
```

# EmptyState

> **Import:** `import { EmptyState } from '@/components/ui/empty-state'`

## Props
```ts
interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  illustration?: 'no-data' | 'no-results' | 'success' | 'error';
}
```

# Skeleton

> **Import:** `import { Skeleton } from '@/components/ui/skeleton'`

## Shapes
| Shape | Class |
|-------|-------|
| Text | `className="h-4 w-[250px]"` |
| Avatar | `className="h-10 w-10 rounded-full"` |
| Card | `className="h-[200px] rounded-xl"` |
| Table | `className="h-10 w-full"` (x5 rows) |

# Toast

> **Import:** `import { toast } from '@/components/ui/use-toast'`

## Types
```ts
toast({ title: "Success", description: "Order created", variant: "success" });
toast.error({ title: "Error", description: "Payment failed" });
toast.loading({ title: "Processing..." });  // Auto-dismiss on completion
```

# Tabs

> **Import:** `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'`

## Variants
| Variant | Style |
|---------|-------|
| `underline` | Line under active tab (default) |
| `pills` | Filled pill for active tab |
| `segmented` | Connected segments |

# Form

> **Import:** `import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'`

## Structure
```tsx
<Form onSubmit={handleSubmit}>
  <FormField name="email">
    <FormItem>
      <FormLabel>Email</FormLabel>
      <Input {...field} />
      <FormMessage />
    </FormItem>
  </FormField>
  <Button type="submit">Submit</Button>
</Form>
```

# DataTable

> **Import:** `import { DataTable } from '@/components/ui/data-table'`

## Props
```ts
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  totalCount: number;
  pageSize: number;
  page: number;
  onPageChange: (page: number) => void;
  onSort: (column: string, direction: 'asc' | 'desc') => void;
  isLoading: boolean;
  onRowClick?: (row: T) => void;
  selectedRows?: string[];
  onSelectionChange?: (ids: string[]) => void;
  emptyState?: React.ReactNode;
}
```
