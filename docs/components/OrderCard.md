# Order Card (UI-015)

Displays order summary with status and actions.

## Displays

- Order number
- Card type / product name
- Order status badge
- Shipping status
- Tracking number
- Estimated delivery date
- Amount paid

## Actions

- Track package (when shipped)
- View receipt
- Contact support
- Cancel (when pending)

## States

- Loading
- Pending payment
- Processing
- Shipped (with tracking info)
- Delivered
- Cancelled
- Refunded

## Implementation

Refer to `src/components/ui/data-grid/data-grid.tsx` and card patterns in `src/components/ui/card/card.tsx`.
