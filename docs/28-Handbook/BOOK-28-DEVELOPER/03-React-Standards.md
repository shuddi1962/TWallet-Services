# React Standards

## Component Architecture

### Functional Components Only

All components MUST be functional components. No class components.

```typescript
// ✅ Functional component
export function WalletCard({ address, balance }: WalletCardProps) {
  return (
    <div className="rounded-xl border p-4">
      <p>{address}</p>
      <p>{balance} ETH</p>
    </div>
  );
}

// ❌ Never use class components
```

### Server Components by Default

Components default to Server Components. Only add `"use client"` when necessary.

```typescript
// ✅ Server Component (default — no "use client")
export async function OrderList() {
  const orders = await getOrders();
  return orders.map((order) => <OrderCard key={order.id} order={order} />);
}

// ✅ Client Component (only when interactivity required)
'use client';
export function ConnectWalletButton() {
  const { connect } = useWallet();
  return <Button onClick={() => connect()}>Connect Wallet</Button>;
}
```

### When to Use Client Components

| Need | Example |
|------|---------|
| useState / useReducer | Form inputs, toggle states |
| useEffect | Browser API calls, subscriptions |
| onClick / onSubmit | Event handlers |
| useRouter / usePathname | Client navigation |
| Browser APIs | localStorage, IntersectionObserver |
| Custom hooks with state | `useWallet()`, `useMediaQuery()` |
| Context providers | Theme, auth, analytics |

## Hooks Rules

### Custom Hook Pattern

```typescript
// src/hooks/use-wallet.ts
export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAddress(accounts[0] as string);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  return { address, isConnecting, connect };
}
```

### Hook Naming

- Always prefix with `use`
- camelCase: `useWallet`, `useMediaQuery`, `useDebounce`
- Return an object (not array) for more than 2 values

## State Management

| State Type | Solution |
|-----------|----------|
| Server state | Server Components + Server Actions |
| Client form state | `useState` / `useReducer` |
| URL state | `useSearchParams` |
| Global client state | React Context (sparingly) |
| Real-time state | Supabase Realtime subscriptions |
| Cache | React `cache()` + Next.js revalidation |

## Reusability

- Extract reusable logic into hooks (`src/hooks/`)
- Extract reusable UI into components (`src/components/ui/`)
- Extract feature-specific components into `src/features/{name}/components/`
- Keep components focused — one responsibility per component

## What NOT to Do

```typescript
// ❌ No useEffect for data fetching — use Server Components
'use client';
useEffect(() => { fetch('/api/data').then(setData); }, []);

// ❌ No prop drilling — use composition or context
function Parent() { return <Child user={user} />; }
function Child({ user }: { user: User }) { return <Grandchild user={user} />; }

// ❌ No inline styles (use Tailwind classes)
<div style={{ color: 'red', padding: '16px' }}>Bad</div>

// ✅ Instead, use Server Components for data fetching
export async function Page() {
  const data = await fetchData();
  return <Display data={data} />;
}
```
