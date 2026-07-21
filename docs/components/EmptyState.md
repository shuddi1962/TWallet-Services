# Empty State (UI-020)

Placeholder for empty data views.

## Preset Illustrations

| Illustration | Title | Description |
|-------------|-------|-------------|
| `orders` | No orders yet | Place your first card order |
| `wallet` | No wallet connected | Connect your crypto wallet |
| `notifications` | All clear | No new notifications |
| `transactions` | No transactions | Transactions appear here |
| `tickets` | No support tickets | Support requests appear here |
| `search` | No results found | Try adjusting your search |

## Props

| Prop | Type | Default |
|------|------|---------|
| illustration | `EmptyStateIllustration` | — |
| icon | `ReactNode` | — |
| title | `string` | Preset title |
| description | `string` | Preset description |
| action | `ReactNode` | — |

## Implementation

`src/components/ui/empty-state/empty-state.tsx`
