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
