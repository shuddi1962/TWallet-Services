export interface DashboardStats {
  activeCards: number;
  totalOrders: number;
  walletCount: number;
  totalSpent: number;
}

export interface DashboardData {
  userName: string;
  userEmail: string;
  stats: DashboardStats;
  recentOrders: RecentOrderItem[];
  wallets: WalletInfoItem[];
  recentTransactions: TransactionInfoItem[];
  notifications: NotificationInfoItem[];
}

export interface RecentOrderItem {
  id: string;
  order_number: string;
  status: string;
  amount_usdc: number;
  network: string;
  token: string;
  created_at: string;
  paid_at: string | null;
  tracking_number: string | null;
  carrier: string | null;
  card_products: { name: string; type: string; slug?: string } | null;
}

export interface WalletInfoItem {
  id: string;
  address: string;
  network: string;
  label: string | null;
  is_default: boolean;
  connected_at: string;
}

export interface TransactionInfoItem {
  id: string;
  amount: number;
  status: string;
  tx_hash: string | null;
  network_id: string;
  created_at: string;
}

export interface NotificationInfoItem {
  id: string;
  type: string;
  title: string;
  message: string | null;
  read: boolean;
  created_at: string;
}
