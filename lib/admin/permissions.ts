export type AdminRoleId = "super_admin" | "operations" | "finance" | "support" | "viewer";

export const ADMIN_ROLE_IDS: AdminRoleId[] = ["super_admin", "operations", "finance", "support", "viewer"];

export const ALL_PERMISSIONS = [
  "dashboard",
  "users_view",
  "users_manage",
  "orders_view",
  "orders_manage",
  "payments_view",
  "payments_manage",
  "cards_view",
  "cards_manage",
  "tickets_view",
  "tickets_manage",
  "settings_view",
  "settings_manage",
  "audit_logs",
  "analytics",
] as const;

export type Permission = (typeof ALL_PERMISSIONS)[number];

export interface RoleDefinition {
  id: AdminRoleId;
  label: string;
  description: string;
  badgeVariant: "default" | "secondary" | "info" | "success" | "warning";
}

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    id: "super_admin",
    label: "Super Admin",
    description:
      "Full system access. Manage users, orders, payments, cards, tickets, settings, audit logs, and analytics.",
    badgeVariant: "default",
  },
  {
    id: "operations",
    label: "Operations",
    description: "Manage orders, cards, shipping, and support tickets. View user information.",
    badgeVariant: "info",
  },
  {
    id: "finance",
    label: "Finance",
    description: "Handle payments, refunds, revenue reporting, and analytics dashboards.",
    badgeVariant: "success",
  },
  {
    id: "support",
    label: "Support",
    description: "Manage support tickets and view user profiles and order details.",
    badgeVariant: "warning",
  },
  {
    id: "viewer",
    label: "Viewer",
    description: "Read-only access to dashboards, users, orders, payments, cards, tickets, and analytics.",
    badgeVariant: "secondary",
  },
];

export const DEFAULT_ROLE_PERMISSIONS: Record<AdminRoleId, Permission[]> = {
  super_admin: [...ALL_PERMISSIONS],
  operations: [
    "dashboard",
    "users_view",
    "orders_view",
    "orders_manage",
    "cards_view",
    "cards_manage",
    "tickets_view",
  ],
  finance: ["dashboard", "orders_view", "payments_view", "payments_manage", "analytics"],
  support: ["dashboard", "users_view", "orders_view", "tickets_view", "tickets_manage"],
  viewer: [
    "dashboard",
    "users_view",
    "orders_view",
    "payments_view",
    "cards_view",
    "tickets_view",
    "analytics",
  ],
};

export function isAdminRoleId(value: string): value is AdminRoleId {
  return (ADMIN_ROLE_IDS as string[]).includes(value);
}

export function isPermission(value: string): value is Permission {
  return (ALL_PERMISSIONS as readonly string[]).includes(value);
}