# Timeline (UI-021)

Chronological step sequence for order tracking, activity logs, and ticket history.

## Variants

| Variant | Layout |
|---------|--------|
| `vertical` | Column with connecting lines |
| `horizontal` | Row with progress bar |

## Step Status

| Status | Icon | Color |
|--------|------|-------|
| `completed` | Check | Emerald |
| `current` | Spinner | Blue |
| `pending` | Clock | Gray |
| `failed` | X | Red |

## Props

| Prop | Type | Default |
|------|------|---------|
| steps | `TimelineStep[]` | required |
| variant | `'vertical' \| 'horizontal'` | `vertical` |

## Implementation

`src/components/ui/timeline/timeline.tsx`
