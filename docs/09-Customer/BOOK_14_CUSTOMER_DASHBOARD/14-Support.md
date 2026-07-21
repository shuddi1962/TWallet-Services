# 14 — Support

> Component ID: DB-014 | Status: Approved
> Support ticket system with tabs, ticket chat, attachments, and status timeline.

## Purpose

Provide customer support within the dashboard. Create, track, and respond to support tickets.

## Route

`/app/support` — Hybrid: RSC shell + Client Component (forms + chat)

## Tabs

| Tab | Content |
|-----|---------|
| Open Tickets | status IN ('open', 'pending') |
| Resolved | status IN ('resolved', 'closed') |
| Create Ticket | New ticket form |
| Knowledge Base | Future (FAQ articles) |

## Ticket List

Each ticket row:
| Field | Content |
|-------|---------|
| Ticket # | `TKT-00001` (monospace) |
| Subject | Ticket subject (16px, 600) |
| Category | Badge: General, Orders, Payments, Security, Account |
| Status | Badge: Open (warning), Pending (info), Resolved (success), Closed (muted) |
| Priority | Badge: Low, Medium, High, Urgent |
| Created | Date (14px, muted) |
| Last Reply | "2 hours ago" (14px, muted) |
| Action | "View" → ticket detail |

## Create Ticket Form

| Field | Type | Validation |
|-------|------|------------|
| Subject | Text | Required, 5–200 chars |
| Category | Select | Required: General, Orders, Payments, Security, Account |
| Priority | Select | Low, Medium, High, Urgent (default: Medium) |
| Related Order | Select (optional) | List of user's orders |
| Description | Textarea | Required, 10–2000 chars |
| Attachment | File upload (optional) | Max 10MB, PDF/PNG/JPEG |

- On submit: creates ticket + first message → navigates to ticket detail
- "Submit Ticket" button (primary)

## Ticket Chat

Chat-style message thread:
| Element | Customer Message | Support Message |
|---------|-----------------|----------------|
| Alignment | Left | Right |
| Bubble bg | `--color-primary-light` | `--color-surface` (with border) |
| Sender name | "You" | "[Agent Name]" or "Support" |
| Message | Text (14px) | Text (14px) |
| Attachment | Link with icon (if attached) | Link with icon |
| Timestamp | 12px, muted | 12px, muted |

## Status Timeline (Within Ticket)

Visual status changes:
```
●───────●───────○───────○
Open    Pending  Resolved Closed
Jul 21  Jul 21   —       —
```

## Ticket Actions

| Action | When Available |
|--------|---------------|
| Reply | Ticket is open or pending |
| Reopen | Ticket is resolved (within 7 days) |
| Close | Ticket is open or pending (user closes) |
| Add Attachment | With reply |

## Component Tree

```
SupportPage (Server Component shell)
├── AppLayout
└── SupportContent (Client Component)
    ├── PageHeader
    │   ├── Heading ("Support")
    │   └── Subtext ("Get help with your orders, payments, or account.")
    ├── SupportTabs
    │   ├── Tab ("Open Tickets", count)
    │   ├── Tab ("Resolved", count)
    │   ├── Tab ("Create Ticket")
    │   └── Tab ("Knowledge Base" — future)
    ├── [Open Tickets View]
    │   ├── TicketList
    │   │   └── TicketRow[] (ticket #, subject, category, status, priority, dates, view)
    │   └── EmptyState (if none: "No open tickets" + "Create Ticket" CTA)
    ├── [Resolved View]
    │   └── TicketList (resolved/closed tickets)
    ├── [Create Ticket View]
    │   └── CreateTicketForm (subject, category, priority, related order, description, attachment)
    └── [Ticket Detail View]
        ├── TicketHeader (ticket #, subject, status, priority, category badges)
        ├── StatusTimeline (Open → Pending → Resolved → Closed)
        ├── TicketMeta (created date, related order link)
        ├── MessageThread
        │   └── MessageBubble[] (customer left / support right, with sender + message + attachment + timestamp)
        ├── ReplyForm (textarea + attachment + "Send Reply" button)
        └── TicketActions (reopen / close)
```

## Database Tables

- `support_tickets` — id, profile_id, ticket_number, subject, department, priority, status, related_order_id
- `ticket_messages` — id, ticket_id, sender, sender_id, message, attachment, created_at

## Supabase Queries

```ts
// List tickets by tab
const { data: tickets } = await supabase
  .from('support_tickets')
  .select('*')
  .eq('profile_id', userId)
  .is('deleted_at', null)
  .in('status', tab === 'open' ? ['open', 'pending'] : ['resolved', 'closed'])
  .order('created_at', { ascending: false });

// Ticket details with messages
const { data: ticket } = await supabase
  .from('support_tickets')
  .select('*, ticket_messages(*)')
  .eq('id', ticketId)
  .eq('profile_id', userId)
  .single();

// Create ticket (Server Action)
const { data: newTicket } = await supabaseAdmin
  .from('support_tickets')
  .insert({ profile_id: userId, ticket_number: generateTicketNumber(), subject, department, priority, related_order_id })
  .select()
  .single();

await supabaseAdmin
  .from('ticket_messages')
  .insert({ ticket_id: newTicket.id, sender: 'customer', sender_id: userId, message, attachment });

// Reply
await supabaseAdmin
  .from('ticket_messages')
  .insert({ ticket_id: ticketId, sender: 'customer', sender_id: userId, message, attachment });

// Realtime for new support messages
const channel = supabase
  .channel(`ticket:${ticketId}`)
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'ticket_messages', filter: `ticket_id=eq.${ticketId}` },
    (payload) => addMessage(payload.new)
  )
  .subscribe();
```

## States

| State | UI |
|------|-----|
| Loading | Skeleton ticket list |
| Tickets present | List with tabs |
| No tickets | Empty state + "Create Ticket" CTA |
| Creating ticket | Button spinner + fields disabled |
| Ticket created | Navigate to ticket detail + toast "Ticket created" |
| Sending reply | Button spinner + textarea disabled |
| Reply sent | Message appears in thread + textarea cleared |
| Error | Error card + retry |

## Accessibility

- `<section aria-label="Support">`
- Tabs: ARIA tabs (`role="tablist"`, `role="tab"`)
- Ticket list: table or list with `aria-label`
- Create form: labels above inputs, `aria-live` for errors
- Message thread: `aria-live="polite"` for new messages
- Reply form: `aria-label="Reply to ticket"`
- Attachments: `aria-label="Attach file"`
- Status badges: text + icon (not color alone)
