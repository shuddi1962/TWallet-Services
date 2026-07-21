# Skeleton (UI-021)

Loading placeholder with shimmer animation.

## Shapes

| Shape | CSS |
|-------|-----|
| `text` | h-4 w-full rounded-xl |
| `title` | h-6 w-3/4 rounded-xl |
| `avatar` | size-10 rounded-full |
| `card` | h-40 w-full rounded-2xl |
| `chart` | h-64 w-full rounded-2xl |
| `table` | h-8 w-full rounded-xl |
| `badge` | h-6 w-16 rounded-full |
| `button` | h-10 w-24 rounded-xl |
| `input` | h-10 w-full rounded-xl |

## Composite Skeletons

- `SkeletonCard` — card layout skeleton
- `SkeletonTable` — table layout skeleton with configurable rows/cols

## Props

| Prop | Type | Default |
|------|------|---------|
| shape | `SkeletonShape` | `text` |
| count | `number` | 1 |

## Implementation

`src/components/ui/skeleton/skeleton.tsx`
