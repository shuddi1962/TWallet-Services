# Realtime Performance

## Supabase Realtime Optimization

### Connection Strategy

Use a single Realtime connection per page, subscribing only to necessary channels:

```typescript
// ✅ Single connection with targeted subscriptions
const channel = supabase.channel('dashboard-updates');

const ordersSub = channel.on(
  'postgres_changes',
  { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${userId}` },
  (payload) => updateOrders(payload),
);

const notificationsSub = channel.on(
  'postgres_changes',
  { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
  (payload) => addNotification(payload),
);

channel.subscribe();
```

### Subscription Cleanup

Always unsubscribe when the component unmounts or the user navigates away:

```typescript
useEffect(() => {
  const channel = supabase.channel('page-updates');
  // ... subscriptions
  channel.subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

### Selective Channels

| Feature | Channel | Filter | Priority |
|---------|---------|--------|----------|
| Order status | `orders` | User-specific | High |
| Payment confirmation | `payments` | User-specific | High |
| Notifications | `notifications` | User-specific | High |
| Admin — new orders | `orders` | Admin role | Medium |
| Admin — support tickets | `support_tickets` | Admin role | Medium |
| Card status | `cards` | User-specific | Medium |
| Wallet balance | Custom Realtime broadcast | User-specific | Low |

### Reconnect Logic

Supabase Realtime client has built-in reconnection. Configure:

```typescript
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  },
);
```

### Heartbeat Monitoring

Monitor Realtime connection health:

```typescript
// Ping/pong mechanism
setInterval(() => {
  if (channel.state !== 'joined') {
    console.warn('Realtime channel disconnected, reconnecting...');
    channel.subscribe();
  }
}, 30000); // Every 30 seconds
```

## Performance Considerations

- Each Realtime connection uses WebSocket resources. Limit concurrent connections per user.
- Use narrow filters to reduce payload size and server CPU.
- For non-critical updates (e.g., wallet balance polling), prefer periodic polling over Realtime.
- Supabase has a max connections limit on the Realtime service depending on plan.
