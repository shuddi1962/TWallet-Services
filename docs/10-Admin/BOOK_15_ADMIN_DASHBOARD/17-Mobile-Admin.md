# 17 — Mobile Admin

> Component ID: ADM-017 | Status: Approved
> Admin dashboard on mobile — priority features, responsive layout, limitations.

## Design Principles

Admin dashboards are typically desktop-first, but critical operations must work on mobile for on-call admins.

### Priority (Must work on mobile)
- Dashboard overview (stats + charts simplified)
- Order list + basic status changes
- Payment monitoring
- Support tickets (reply, assign)
- Notification center

### Non-essential (Desktop-only messages)
- Settings (complex forms)
- Reports (fine-grained config)
- Wallet management (security)
- Audit logs (data density)
- Role management (complexity)

## Responsive Behavior

### Sidebar
- Desktop: fixed sidebar
- Mobile: hamburger → full-screen drawer (overlay, 280px)
- Swipe left to close
- Backdrop: `--color-overlay` at 50%

### Top Header
- Desktop: breadcrumb, search, profile, actions
- Mobile: hamburger + page title + notification bell only

### Tables → Cards
| Desktop | Mobile |
|---------|--------|
| Full table | Card per row |
| Columns | Label: value pairs |
| Sortable headers | Sort dropdown |
| Row selection | Tap card → actions |

### Dashboard Stats
- 8 cards → 4 cards (top 4 by importance: users, orders, revenue, tickets)
- 5 charts → 2 charts (orders trend, revenue trend) stacked vertically
- Charts: full-width, height reduced to 200px

### Modals
- Desktop: centered modal / right drawer
- Mobile: bottom sheet (drag to dismiss)

### Filters
- Desktop: inline filter bar above table
- Mobile: collapsible filter panel (accordion pattern)
- Each filter expands: status, date, search, etc.

## Navigation

Bottom tab bar (replaces sidebar on mobile):

| Tab | Icon | Route |
|-----|------|-------|
| Dashboard | LayoutDashboard | `/admin` |
| Orders | ShoppingBag | `/admin/orders` |
| Support | LifeBuoy | `/admin/support` |
| Notifications | Bell | `/admin/notifications` |
| Menu | MoreHorizontal | Opens sidebar drawer |

## Component Adaptations

### DataTable mobile
```tsx
// Mobile row: card instead of table row
<MobileCard>
  <div className="flex justify-between">
    <span className="text-sm text-muted">Order #1234</span>
    <StatusBadge status="paid" />
  </div>
  <div className="flex justify-between mt-2">
    <span>John Doe</span>
    <span>$50 USDC</span>
  </div>
  <div className="flex justify-between mt-1 text-sm text-muted">
    <span>Visa Physical</span>
    <span>2h ago</span>
  </div>
  <Button size="sm" className="mt-2">Actions</Button>
</MobileCard>
```

### Filter panel mobile
```tsx
<FilterAccordion>
  <AccordionItem value="status">
    <AccordionTrigger>Status</AccordionTrigger>
    <AccordionContent>
      <StatusCheckboxes />
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="date">
    <AccordionTrigger>Date Range</AccordionTrigger>
    <AccordionContent>
      <DateRangePicker />
    </AccordionContent>
  </AccordionItem>
</FilterAccordion>
```

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Desktop | ≥ 1024px | Full sidebar + header + content |
| Tablet | 768-1023px | Collapsed sidebar + content |
| Mobile | < 768px | Hamburger drawer + bottom tabs |

## Touch Interactions

| Gesture | Action |
|---------|--------|
| Swipe left on row | Reveal action buttons (Mark Paid, Flag) |
| Long press on item | Open context menu |
| Pull down on list | Refresh data |
| Tap notification | Navigate to relevant section |

## Accessibility

- Bottom tab bar: `role="tablist"`, `aria-label="Admin navigation"`
- Bottom sheets: `role="dialog"`, `aria-modal="true"`, focus trap
- Swipe actions: fallback buttons for screen reader users
- Touch targets: minimum 44x44px
