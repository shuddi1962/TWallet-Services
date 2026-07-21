# TypeScript Standards

## Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": false,
    "forceConsistentCasingInFileNames": true
  }
}
```

## Rules

| Rule | Enforcement | Notes |
|------|-------------|-------|
| `strict: true` | Required | No exceptions |
| No `any` | Required | Use `unknown` and type narrowing |
| No `as` casts | Preferred | Use type guards instead |
| No `@ts-ignore` | Required | Use `@ts-expect-error` with reason if absolutely necessary |
| No `// @ts-nocheck` | Required | Never disable type checking |
| Prefer `interface` | Preferred | Use for object types (extendable) |
| Use `type` for unions | Preferred | Use for union/intersection types |
| `readonly` when possible | Preferred | On props, state, and immutable data |

## Interface vs Type

```typescript
// ✅ Interface — extendable, preferred for objects
interface User {
  id: string;
  email: string;
  name: string;
}

// ✅ Type alias — use for unions, intersections, and complex types
type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'cancelled';
type ApiResponse<T> = { data: T; error: null } | { data: null; error: ApiError };
```

## Type Patterns

### Generic Types

```typescript
interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  total: number;
}

interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}
```

### Discriminated Unions

```typescript
type PaymentResult =
  | { status: 'confirmed'; txHash: string; blockNumber: bigint }
  | { status: 'pending'; txHash: string; confirmations: number }
  | { status: 'failed'; errorCode: string; reason: string };
```

### Type Guards

```typescript
function isConfirmedPayment(result: PaymentResult): result is Extract<PaymentResult, { status: 'confirmed' }> {
  return result.status === 'confirmed';
}
```

### Utility Types

```typescript
// Prefer built-in utility types
type UserProfile = Pick<User, 'id' | 'name' | 'email'>;
type UserUpdate = Partial<Omit<User, 'id' | 'createdAt'>>;
type ImmutableUser = Readonly<User>;
type UserMap = Record<string, User>;
```

## What NOT to Do

```typescript
// ❌ Never use any
const data: any = await fetchData();

// ❌ Never cast without checking
const user = data as User;

// ❌ Never disable type checking
// @ts-ignore
const result = someFunction();

// ❌ Never use object instead of proper type
function process(obj: object) { ... }

// ✅ Instead
const data: unknown = await fetchData();
if (isUser(data)) {
  const user: User = data;
}
```
