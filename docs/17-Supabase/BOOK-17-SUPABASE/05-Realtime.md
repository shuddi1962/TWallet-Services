# Realtime

> Supabase Realtime for live updates — notifications, order status, support chat, admin dashboard.

---

## Channels & Subscriptions

| Channel | Table | Event | Purpose |
|---------|-------|-------|---------|
| `notifications:{userId}` | `notifications` | INSERT | New notification for user |
| `orders:{userId}` | `card_orders` | UPDATE | Order status changes |
| `payments:{userId}` | `payment_transactions` | INSERT, UPDATE | Payment confirmations |
| `ticket:{ticketId}` | `ticket_messages` | INSERT | Live support chat |
| `admin:dashboard` | `admin_notifications` | INSERT | Admin alerts |
| `admin:orders` | `card_orders` | INSERT, UPDATE | Admin order monitoring |
| `admin:support` | `support_tickets` | INSERT, UPDATE | Admin ticket queue |

---

## Client Subscriptions

```ts
// src/lib/realtime/notifications.ts
import { createBrowserClient } from '@/lib/supabase/client';

export function subscribeToNotifications(userId: string, onNotification: (n: Notification) => void) {
  const supabase = createBrowserClient();
  return supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
      (payload) => onNotification(payload.new as Notification)
    )
    .subscribe();
}

// Usage in a Client Component
useEffect(() => {
  const channel = subscribeToNotifications(user.id, (notification) => {
    toast(notification.title);
    setNotifications(prev => [notification, ...prev]);
  });
  return () => { supabase.removeChannel(channel); };
}, [user.id]);
```

---

## Order Status Subscription

```ts
export function subscribeToOrderStatus(orderId: string, onUpdate: (order: CardOrder) => void) {
  const supabase = createBrowserClient();
  return supabase
    .channel(`order:${orderId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'card_orders', filter: `id=eq.${orderId}` },
      (payload) => onUpdate(payload.new as CardOrder)
    )
    .subscribe();
}
```

---

## Support Chat (Real-time)

```ts
export function subscribeToTicketMessages(ticketId: string, onMessage: (msg: TicketMessage) => void) {
  const supabase = createBrowserClient();
  return supabase
    .channel(`ticket:${ticketId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'ticket_messages', filter: `ticket_id=eq.${ticketId}` },
      (payload) => onMessage(payload.new as TicketMessage)
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'support_tickets', filter: `id=eq.${ticketId}` },
      (payload) => onTicketUpdate(payload.new)
    )
    .subscribe();
}
```

---

## Admin Dashboard Subscription

```ts
export function subscribeToAdminDashboard() {
  const supabase = createBrowserClient();
  return supabase
    .channel('admin:dashboard')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'admin_notifications' },
      (payload) => { toast(payload.new.title); updateBadgeCount(); })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_tickets' },
      (payload) => { updateTicketBadge(); })
    .subscribe();
}
```

---

## Presence (Future)

For admin team awareness:

```ts
const presenceChannel = supabase.channel('admin:presence');
presenceChannel
  .on('presence', { event: 'sync' }, () => {
    const state = presenceChannel.presenceState();
    // { 'user-1': { online_at: '...' }, 'user-2': { online_at: '...' } }
  })
  .on('presence', { event: 'join' }, ({ key, newPresences }) => {
    // Admin came online
  })
  .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    // Admin went offline
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await presenceChannel.track({ online_at: new Date().toISOString() });
    }
  });
```

---

## Realtime Configuration

| Setting | Value | Notes |
|---------|-------|-------|
| Max channels per client | 10 | Default limit |
| Enable on tables | All notification/order/ticket tables | Enable in Supabase dashboard |
| Replication | Logical decoding | Standard for Postgres |
| Region | Same as database | Minimize latency |
