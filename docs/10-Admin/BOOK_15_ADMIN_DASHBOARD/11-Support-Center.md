# 11 — Support Center

> Component ID: ADM-011 | Status: Approved
> Full ticket management — queue, assign, reply, escalate, internal notes, attachments.

## Route

`/admin/support` — Server Component + Client

## Access

- Super Admin, Support, Operations: CRUD
- Finance, Viewer: read-only

## Features

### Ticket Queue (Table)

| Column | Filterable | Sortable |
|--------|-----------|----------|
| Ticket # | Search | Yes |
| Subject | Search | Yes |
| Customer | Search (name/email) | Yes |
| Priority | Badge (Low/Med/High/Urgent) | Yes |
| Status | Multi-select | Yes |
| Assigned To | Dropdown | Yes |
| Category | Dropdown | Yes |
| Last Reply | From customer/admin | Yes |
| Age | Days open | Yes |
| Actions | Menu | — |

### Ticket Statuses

`open` → `pending` (awaiting customer) → `resolved` → `closed`
`escalated` (can branch from any open/pending)

### Actions (Dropdown per row)

| Action | Behavior |
|--------|----------|
| View | Opens ticket detail |
| Assign To | Dropdown of support agents |
| Assign To Me | Quick assign |
| Change Priority | Dropdown |
| Escalate | Sets status to `escalated`, adds escalation note |
| Mark Resolved | Status → `resolved` |
| Close | Status → `closed` |
| Reopen | If closed, sets to `open` |

### Ticket Detail

| Section | Data |
|---------|------|
| Ticket Info | #, subject, status, priority, category, created |
| Customer | Name, email, link to user profile |
| Messages | Thread (customer + admin replies, timestamped) |
| Reply Box | Textarea + attachment upload + Internal Note toggle |
| Internal Notes | Admin-only notes (not visible to customer) |
| Attachments | Files per message (image, PDF) |
| Activity Log | Status changes, assignments, escalations |

### Filters

| Filter | Type |
|--------|------|
| Search (#, subject, customer) | Text, debounced |
| Status | Multi-select badges |
| Priority | Multi-select badges |
| Category | Dropdown |
| Assigned To | Dropdown (admin list + Unassigned) |
| Date Range | Date pickers |

### Quick Filters

| Filter | Behavior |
|--------|----------|
| My Tickets | `assigned_to = currentAdmin` |
| Unassigned | `assigned_to IS NULL` |
| Overdue | Age > 48 hours and status ≠ closed |

## Component Tree

```
AdminSupportPage (Server Component)
├── PageHeader ("Support" + open ticket count)
├── QuickFilterTabs (All, My Tickets, Unassigned, Overdue)
├── FilterBar (search, status, priority, category, assigned, date)
├── TicketsTable (Client)
│   ├── TableHeader
│   └── TicketRow
│       ├── TicketNumber
│       ├── SubjectCell
│       ├── CustomerCell
│       ├── PriorityBadge (color-coded — Low=gray, Med=blue, High=amber, Urgent=red)
│       ├── StatusBadge (color-coded)
│       ├── AssignedCell (avatar + name or "Unassigned")
│       ├── CategoryBadge
│       ├── LastReplyCell (time + sender indicator)
│       ├── AgeCell (days/hours)
│       └── ActionsDropdown
├── Pagination
└── TicketDetail (Client — full page or drawer)
    ├── TicketHeader (status, priority, assigned)
    ├── MessagesThread
    │   ├── Message (customer — left, gray bg)
    │   └── Message (admin — right, primary bg)
    ├── ReplyBox
    │   ├── Textarea (rich text: bold, list, link)
    │   ├── AttachmentUpload (image, PDF, up to 10MB)
    │   └── InternalNoteToggle
    └── InternalNotesSection
```

## Server Actions

```ts
assignTicket(ticketId: string, adminId: string | null): Promise<ActionResult>
assignToMe(ticketId: string): Promise<ActionResult>
updateTicketPriority(ticketId: string, priority: TicketPriority): Promise<ActionResult>
escalateTicket(ticketId: string, reason: string): Promise<ActionResult>
replyToTicket(ticketId: string, message: string, attachments?: File[], internal?: boolean): Promise<ActionResult>
closeTicket(ticketId: string): Promise<ActionResult>
reopenTicket(ticketId: string): Promise<ActionResult>
addInternalNote(ticketId: string, note: string): Promise<ActionResult>
```

## Real-time

- Supabase Realtime channel on `support_tickets` table
- New tickets appear in queue without refresh
- Badge count in sidebar updates in real-time
- Notification shown when high/urgent ticket arrives

## States

| State | UI |
|-------|-----|
| Loading | Skeleton table |
| Empty | "No tickets" + illustration |
| Unassigned | "Unassigned" badge, "+ Assign" prompt |
| Urgent | Red badge, row highlighted, shake animation |
| Escalated | "Escalated" badge (warning color) |
| Error | "Failed to load tickets" + Retry |
