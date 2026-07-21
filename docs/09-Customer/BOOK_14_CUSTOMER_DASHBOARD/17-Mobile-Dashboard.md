# 17 — Mobile Dashboard

> Responsive specifications for all dashboard pages at 320px–767px.

## Mobile Navigation

### Bottom Navigation (5 items)
| Tab | Icon | Route |
|-----|------|-------|
| Home | Home | `/app` |
| Orders | Package | `/app/orders` |
| Wallet | Wallet | `/app/wallet` |
| Notifications | Bell | `/app/notifications` |
| Profile | User | `/app/profile` |

- Fixed bottom, 56px height, white bg, 1px top border
- Active: `--color-primary` icon + label (10px)
- Inactive: `--color-muted` icon + label
- "More" accessible from Profile page (Security, Settings, Support, Logout)

## Global Mobile Rules

| Rule | Spec |
|------|------|
| Layout | Single column, stacked |
| Container | 100% with 16px horizontal padding |
| Section gap | 24px (`--space-6`) |
| Cards | Full width, 24px radius |
| Touch targets | Min 44x44px |
| Top nav | 56px (logo + bell + avatar — no search bar) |
| Swipeable cards | Yes (order cards, transaction cards) |
| Collapsible sections | Yes (settings categories, security cards) |
| Sticky bottom nav | Yes (always visible) |

## Section-by-Section Mobile Specs

### Dashboard Overview
- All widgets stacked vertically
- Stats: 2x2 grid
- Quick Actions: 2x3 grid
- Wallet + Notifications: full width (stacked)
- Orders + Transactions: full width (stacked)
- Activity Timeline: full width

### Top Navigation
- 56px height (shorter than desktop 72px)
- Left: Logo (24px)
- Right: Bell + Avatar (28px)
- No search bar (search via icon → full-screen search overlay)
- No breadcrumb

### Orders
- Card list (not table)
- Filter tabs: scrollable horizontal
- Search: full-width input above tabs
- Order details: full-screen panel (not drawer)
- Swipe left on card: quick actions (view, receipt)

### Transactions
- Card list (not table)
- Date range: dropdown
- Status tabs: scrollable horizontal
- Tx hash: smaller truncation (0x12...78)
- Swipe left: copy, explorer, receipt

### Notifications
- Full width list
- Filter tabs: scrollable
- Swipe left: mark read, delete

### Profile
- Form fields: full width
- Avatar: centered, 64px
- Sections: collapsible (tap to expand/collapse)
- Save button: full width

### Settings
- Categories: collapsible (accordion-style)
- Only one category expanded at a time
- Switches: full width, label + switch
- "Logout All": full-width danger button

### Support
- Ticket list: card list
- Tabs: scrollable horizontal
- Create ticket: full-screen form (not modal)
- Ticket chat: chat bubbles full width
- Message input: sticky bottom (above bottom nav)

### Security Center
- All cards stacked, collapsible
- Change password: full-width form
- Sessions: card list (not table)
- Revoke: full-width button per session

### Activity Timeline
- Full width timeline
- Icons: 20px
- Items: single column, left-aligned

## Performance (Mobile)

| Concern | Mitigation |
|---------|-----------|
| Data load | Fetch only initial view; lazy load below fold |
| Infinite scroll | Load 20 items at a time; load more on scroll near bottom |
| Bottom nav | Fixed position; GPU accelerated; add padding-bottom to main |
| Realtime | Only subscribe when page is active |
| Images | next/image with `sizes="(max-width: 768px) 100vw"` |
| JS bundle | Lazy-load client islands (wallet, notifications, forms) |
| Swipeable cards | Use framer-motion drag or react-swipeable (lightweight) |
| Collapsible | CSS height transition or Framer Motion AnimatePresence |

## Infinite Scroll Implementation

```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['orders', userId],
  queryFn: ({ pageParam = 0 }) => fetchOrders(userId, pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});

// Intersection observer at bottom of list
const { ref } = useInView({
  onChange: (inView) => inView && hasNextPage && fetchNextPage(),
});
```

## Testing

- Test on: iPhone SE (320px), iPhone 14 (390px), Android (360px), iPad Mini (768px)
- Chrome DevTools responsive mode at 320, 375, 390, 414, 768
- Lighthouse mobile: 95+
- Touch targets: all buttons ≥ 44x44px
- No horizontal scroll at any width
- Bottom nav doesn't overlap content (padding-bottom: 56px on main)
- Swipeable cards work with touch
- Collapsible sections expand/collapse smoothly
