export interface RecentOrder {
  id: string;
  status: string;
  amount?: number;
  created_at: string;
  profiles?: { full_name: string; email: string } | null;
  card_products?: { name: string; type: string } | null;
}

export interface RecentPayment {
  id: string;
  tx_hash?: string;
  amount?: number;
  status: string;
  created_at: string;
  supported_networks?: { name: string } | null;
}

export interface RecentSignup {
  full_name: string;
  email: string;
  country: string;
  created_at: string;
}

export interface RecentTicket {
  id: string;
  subject: string;
  priority: string;
  status: string;
  created_at: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  target_type?: string;
  target_id?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
  admins?: { profile_id: string; profiles?: { full_name: string } } | null;
}

export interface CardProduct {
  id: string;
  name: string;
  type: string;
  price?: number;
  status?: string;
  created_at: string;
}

export interface WalletRecord {
  id: string;
  user_id: string;
  address: string;
  network: string;
  network_id: number;
  label?: string | null;
  is_default: boolean;
  connected_at?: string | null;
  last_used_at?: string | null;
  created_at: string;
  deleted_at?: string | null;
  profiles?: { full_name: string; email: string } | null;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  status: string;
  country: string;
  created_at: string;
  user_roles?: { role: string }[];
  wallets?: { address: string }[];
}

/** Health status for a monitored service. */
export type HealthStatus = "healthy" | "degraded" | "down";

/** Represents the current health of a single platform service. */
export interface ServiceHealth {
  service: string;
  status: HealthStatus;
  /** Response time in milliseconds. */
  responseTime: number;
  /** ISO-8601 timestamp of the last health check. */
  lastChecked: string;
}

/** Represents a reported or ongoing incident. */
export interface HealthIncident {
  id: string;
  service: string;
  title: string;
  status: "resolved" | "ongoing";
  severity: "minor" | "major" | "critical";
  created_at: string;
  resolved_at?: string;
}

export interface AdminNotification {
  id: string;
  admin_id: string;
  type: string;
  title: string;
  message?: string | null;
  related_type?: string | null;
  related_id?: string | null;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminTicket {
  id: string;
  ticket_number: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  assigned_to?: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  profiles?: { full_name: string; email: string } | null;
  assigned_admin?: { profile_id: string; profiles: { full_name: string } } | null;
}

export interface AdminInfo {
  id: string;
  profile_id: string;
  profiles: { full_name: string; email: string };
}

// ---------------------------------------------------------------------------
// Report types
// ---------------------------------------------------------------------------

export type ReportType =
  | "revenue"
  | "order_summary"
  | "user_growth"
  | "transaction_volume"
  | "payment_summary"
  | "card_product_stats"
  | "support_metrics";

export type ReportFormat = "csv" | "excel" | "pdf";

export interface GeneratedReport {
  id: string;
  type: ReportType;
  format: ReportFormat;
  startDate: string;
  endDate: string;
  fileName: string;
  generatedAt: string;
  data: Record<string, unknown>[];
  summary?: Record<string, unknown>;
}

export interface AdminRoleUser {
  id: string;
  profile_id: string;
  role: string;
  created_at: string;
  updated_at: string;
  profiles: {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
    status: string;
    created_at: string;
  } | null;
}