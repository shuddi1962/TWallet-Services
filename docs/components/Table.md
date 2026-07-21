# Table (UI-015)

Generic data table with sortable columns.

## Features

- Sortable columns (click header to sort)
- Loading skeleton rows
- Sticky header
- Empty state
- Row click handler
- Column width customization

## Column Props

| Prop | Type | Default |
|------|------|---------|
| key | `string` | required |
| header | `string` | required |
| sortable | `boolean` | — |
| render | `(row: T) => ReactNode` | — |
| width | `string` | — |
| className | `string` | — |

## Props

| Prop | Type | Default |
|------|------|---------|
| columns | `Column<T>[]` | required |
| data | `T[]` | required |
| sortColumn | `string` | — |
| sortDirection | `'asc' \| 'desc'` | — |
| onSort | `(column: string) => void` | — |
| onRowClick | `(row: T) => void` | — |
| loading | `boolean` | false |
| stickyHeader | `boolean` | false |
| emptyState | `ReactNode` | — |

## Implementation

`src/components/ui/table/table.tsx`
