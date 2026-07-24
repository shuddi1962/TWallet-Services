import { getAdminRoles } from "@/lib/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

// Role definitions with permission matrix

const roleDefinitions = [
  {
    id: "super_admin",
    label: "Super Admin",
    description: "Full system access. Manage users, orders, payments, cards, tickets, settings, audit logs, and analytics.",
    badgeVariant: "default" as const,
    permissions: [
      "dashboard", "users_view", "users_manage",
      "orders_view", "orders_manage",
      "payments_view", "payments_manage",
      "cards_view", "cards_manage",
      "tickets_view", "tickets_manage",
      "settings_view", "settings_manage",
      "audit_logs", "analytics",
    ],
  },
  {
    id: "operations",
    label: "Operations",
    description: "Manage orders, cards, shipping, and support tickets. View user information.",
    badgeVariant: "info" as const,
    permissions: [
      "dashboard", "users_view",
      "orders_view", "orders_manage",
      "cards_view", "cards_manage",
      "tickets_view",
    ],
  },
  {
    id: "finance",
    label: "Finance",
    description: "Handle payments, refunds, revenue reporting, and analytics dashboards.",
    badgeVariant: "success" as const,
    permissions: [
      "dashboard",
      "orders_view",
      "payments_view", "payments_manage",
      "analytics",
    ],
  },
  {
    id: "support",
    label: "Support",
    description: "Manage support tickets and view user profiles and order details.",
    badgeVariant: "warning" as const,
    permissions: [
      "dashboard", "users_view",
      "orders_view",
      "tickets_view", "tickets_manage",
    ],
  },
  {
    id: "viewer",
    label: "Viewer",
    description: "Read-only access to dashboards, users, orders, payments, cards, tickets, and analytics.",
    badgeVariant: "secondary" as const,
    permissions: [
      "dashboard", "users_view",
      "orders_view",
      "payments_view",
      "cards_view",
      "tickets_view",
      "analytics",
    ],
  },
] as const;

const permissionsMeta = [
  { key: "dashboard",     label: "Dashboard",       category: "General" },
  { key: "users_view",    label: "Users (View)",    category: "Users" },
  { key: "users_manage",  label: "Users (Manage)",  category: "Users" },
  { key: "orders_view",   label: "Orders (View)",   category: "Orders" },
  { key: "orders_manage", label: "Orders (Manage)", category: "Orders" },
  { key: "payments_view",   label: "Payments (View)",   category: "Payments" },
  { key: "payments_manage", label: "Payments (Manage)", category: "Payments" },
  { key: "cards_view",    label: "Cards (View)",    category: "Cards" },
  { key: "cards_manage",  label: "Cards (Manage)",  category: "Cards" },
  { key: "tickets_view",   label: "Tickets (View)",   category: "Support" },
  { key: "tickets_manage", label: "Tickets (Manage)", category: "Support" },
  { key: "settings_view",   label: "Settings (View)",   category: "System" },
  { key: "settings_manage", label: "Settings (Manage)", category: "System" },
  { key: "audit_logs",    label: "Audit Logs",      category: "System" },
  { key: "analytics",     label: "Analytics",       category: "General" },
];

function getPermClass(permissions: readonly string[], key: string): string {
  if (!(permissions as string[]).includes(key)) return "bg-surface-100 text-body";
  return "bg-primary/10 text-primary";
}

export default async function AdminRolesPage() {
  const { admins } = await getAdminRoles();

  // Count admins per role
  const roleCounts: Record<string, number> = {};
  for (const a of admins) {
    const r = a.role;
    roleCounts[r] = (roleCounts[r] ?? 0) + 1;
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Roles &amp; Permissions</h1>
          <p className="text-sm text-body">
            {admins.length} admin user{admins.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {roleDefinitions.map((roleDef) => {
          const count = roleCounts[roleDef.id] ?? 0;
          return (
            <Card key={roleDef.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant={roleDef.badgeVariant}>{roleDef.label}</Badge>
                  <span className="text-xs font-medium text-body">
                    {count} admin{count !== 1 ? "s" : ""}
                  </span>
                </div>
                <CardTitle className="sr-only">{roleDef.label}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4 pt-0">
                <p className="text-xs text-body leading-relaxed">
                  {roleDef.description}
                </p>

                {/* Permissions matrix */}
                <div className="border-t border-white/5 pt-3 mt-auto">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-body mb-2">
                    Permissions
                  </p>
                  <div className="space-y-1">
                    {permissionsMeta.map((perm) => {
                      const has = (roleDef.permissions as unknown as string[]).includes(perm.key);
                      return (
                        <div
                          key={perm.key}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span
                            className={`inline-flex items-center justify-center w-4 h-4 rounded-sm text-[10px] font-bold leading-none ${
                              has
                                ? "text-white"
                                : "text-body bg-surface-800/50"
                            } ${getPermClass(roleDef.permissions, perm.key)}`}
                            aria-hidden="true"
                          >
                            {has ? "\u2713" : "\u2014"}
                          </span>
                          <span
                            className={
                              has ? "text-heading font-medium" : "text-body"
                            }
                          >
                            {perm.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Admin Users Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100">
          <h2 className="text-lg font-semibold text-heading">Admin Users</h2>
          <p className="text-xs text-body mt-0.5">
            {admins.length} user{admins.length !== 1 ? "s" : ""} with administrative access
          </p>
        </div>

        {admins.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-body text-sm">No admin users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => {
                  const profile = admin.profiles;
                  const roleDef = roleDefinitions.find((r) => r.id === admin.role);
                  return (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                            {profile?.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-heading truncate">
                              {profile?.full_name ?? "Unknown"}
                            </p>
                            <p className="text-xs text-body truncate">
                              {profile?.email ?? "\u2014"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={roleDef?.badgeVariant ?? "secondary"}>
                          {roleDef?.label ?? admin.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          profile?.status === "active"
                            ? "bg-success/10 text-success"
                            : profile?.status === "suspended"
                              ? "bg-warning/10 text-warning"
                              : "bg-surface-200 text-body"
                        }`}>
                          {profile?.status ?? "unknown"}
                        </span>
                      </TableCell>
                      <TableCell className="text-body text-xs whitespace-nowrap">
                        {formatDistanceToNow(new Date(admin.created_at), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
