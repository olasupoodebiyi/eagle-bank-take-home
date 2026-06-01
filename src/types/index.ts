// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

// ─── Accounts ─────────────────────────────────────────────────────────────────

export type AccountType = "savings" | "credit" | "checking";
export type AccountStatus = "active" | "frozen" | "closed";

export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  type: AccountType;
  status: AccountStatus;
  balance: number;
  availableBalance: number;
  currency: string;
  createdAt: string;
}

// ─── Transactions ──────────────────────────────────────────────────────────────

export type TransactionType = "deposit" | "withdrawal" | "transfer";
export type TransactionStatus = "completed" | "pending" | "failed";

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  status: TransactionStatus;
  date: string;
  reference: string;
  recipientName?: string;
  recipientAccount?: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalBalance: number;
  currentBalance: number;
  monthlyDeposits: number;
  monthlyWithdrawals: number;
  currency: string;
}

export interface DashboardData {
  user: User;
  stats: DashboardStats;
  recentTransactions: Transaction[];
  accounts: Account[];
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
