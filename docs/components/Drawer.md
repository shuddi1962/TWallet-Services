# Drawer (UI-011)

Slide-in panel for secondary content. Built on Radix Dialog + Framer Motion.

## Positions

`left` · `right` · `bottom` · `top`

## Props

| Prop | Type | Default |
|------|------|---------|
| open | `boolean` | required |
| onOpenChange | `(open: boolean) => void` | required |
| title | `string` | — |
| position | `DrawerPosition` | `right` |

## Use Cases

- Mobile navigation (left)
- Order details (right)
- Notifications (right)
- Filter panels (bottom)
- Search (top)

## Animations

- Spring-based slide (damping 30, stiffness 300)
- Backdrop blur + fade

## Implementation

`src/components/ui/drawer/drawer.tsx`
