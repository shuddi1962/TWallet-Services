# 12 — Profile

> Component ID: DB-012 | Status: Approved
> Full profile management — personal info, avatar, shipping addresses, preferences, and account status.

## Purpose

Let users view and update their personal information, manage shipping addresses, and view account status.

## Route

`/app/profile` — Hybrid: RSC shell + Client Component (forms)

## Sections

1. Personal Information
2. Profile Photo
3. Contact Details
4. Country & Location
5. Shipping Addresses
6. Preferences
7. Account Status

## Section 1: Personal Information

| Field | Type | Editable | Validation |
|-------|------|----------|------------|
| First Name | Text | ✓ | 2–50 chars |
| Last Name | Text | ✓ | 2–50 chars |
| Username | Text | ✓ | 3–20 chars, alphanumeric + underscore, unique |
| Email | Email | ✗ (read-only) | Display only; change requires re-verification |

## Section 2: Profile Photo

- Circular avatar (80px)
- "Upload" button → file picker → Supabase Storage (`avatars` bucket)
- Path: `{userId}/avatar-[timestamp].png`
- Preview before save
- "Remove Avatar" button → reverts to initials placeholder
- Max 5MB, PNG/JPEG/WebP

## Section 3: Contact Details

| Field | Type | Editable | Validation |
|-------|------|----------|------------|
| Phone | Text | ✓ | Optional, valid phone format |

## Section 4: Country & Location

| Field | Type | Editable | Validation |
|-------|------|----------|------------|
| Country | Select | ✓ | Required, from supported countries list |
| State | Text | ✓ | Optional |
| City | Text | ✓ | Optional |
| Timezone | Select | ✓ | IANA timezone (default: UTC) |
| Language | Select | ✓ | ISO 639-1 (default: en; more coming) |

## Section 5: Shipping Addresses

List of saved addresses + add/edit/delete:
| Field | Type | Validation |
|-------|------|------------|
| Recipient Name | Text | Required, 2–100 chars |
| Phone | Text | Optional |
| Country | Select | Required |
| State | Text | Required |
| City | Text | Required |
| Address Line 1 | Text | Required |
| Address Line 2 | Text | Optional |
| Postal Code | Text | Required |
| Landmark | Text | Optional |
| Default | Checkbox | Optional |

- Multiple addresses allowed
- "Add New Address" button
- "Edit" and "Delete" per address
- Default address indicated by badge
- Used for physical card orders

## Section 6: Preferences

| Setting | Control | Default |
|---------|---------|---------|
| Email language | Select | English |
| Date format | Select | MMM D, YYYY |
| Number format | Select | 1,234.56 |

## Section 7: Account Status

| Field | Display |
|-------|---------|
| Account status | Badge: Active (success), Suspended (warning) |
| Email verified | Badge: Verified (success) / Not Verified (warning) |
| Member since | "Jul 21, 2026" (14px, `--color-muted`) |
| Last login | "Jul 21, 2026 at 10:30 AM" (14px, `--color-muted`) |
| Total orders | "5 orders" (14px, `--color-muted`) |

## Component Tree

```
ProfilePage (Server Component shell)
├── AppLayout
└── ProfileContent (Client Component — forms)
    ├── PageHeader
    │   ├── Heading ("Profile")
    │   └── Subtext ("Manage your personal information and preferences.")
    ├── PersonalInfoCard
    │   ├── AvatarUpload (80px circle + upload/remove)
    │   └── Form (react-hook-form + Zod)
    │       ├── FormField (First Name)
    │       ├── FormField (Last Name)
    │       ├── FormField (Username — unique check)
    │       ├── FormField (Email — read-only)
    │       ├── FormField (Phone)
    │       ├── FormField (Country — select)
    │       ├── FormField (State)
    │       ├── FormField (City)
    │       ├── FormField (Timezone — select)
    │       ├── FormField (Language — select)
    │       └── Button ("Save Changes" — primary)
    ├── ShippingAddressesCard
    │   ├── CardHeader ("Shipping Addresses")
    │   ├── AddressList
    │   │   └── AddressItem[] (recipient, address, default badge, edit, delete)
    │   ├── AddAddressForm (modal or inline)
    │   └── Button ("Add New Address")
    ├── PreferencesCard
    │   ├── CardHeader ("Preferences")
    │   └── Form (email language, date format, number format)
    └── AccountStatusCard
        ├── CardHeader ("Account Status")
        ├── StatusRow ("Account", "Active" — success badge)
        ├── StatusRow ("Email", "Verified" — success badge)
        ├── StatusRow ("Member since", date)
        ├── StatusRow ("Last login", date)
        └── StatusRow ("Total orders", count)
```

## Validation

```ts
const profileSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters').max(50),
  last_name: z.string().min(2).max(50),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscore'),
  phone: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  state: z.string().optional(),
  city: z.string().optional(),
  timezone: z.string().default('UTC'),
  language: z.string().default('en'),
});

const addressSchema = z.object({
  recipient_name: z.string().min(2).max(100),
  phone: z.string().optional(),
  country: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),
  address_line_1: z.string().min(1),
  address_line_2: z.string().optional(),
  postal_code: z.string().min(1),
  landmark: z.string().optional(),
  is_default: z.boolean().default(false),
});
```

## States

| State | UI |
|------|-----|
| Loading | Skeleton form fields |
| Ready | Form with current values |
| Saving | Button spinner + disabled fields |
| Saved | Toast: "Profile updated" / "Address added" |
| Error | Inline validation; form-level for server errors |
| Username taken | Inline: "This username is taken" |

## Accessibility

- `<section aria-label="Profile">`
- Labels above inputs (htmlFor associated)
- Email: `aria-readonly="true"` + note "Contact support to change email"
- Avatar: `aria-label="Upload avatar image"` / `"Remove avatar"`
- Errors: `aria-live="polite"`
- Keyboard: full form navigation via Tab
