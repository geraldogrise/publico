export type TransactionType = 'INCOME' | 'EXPENSE';
export type AccountType = 'CHECKING' | 'SAVINGS' | 'WALLET' | 'CREDIT_CARD' | 'INVESTMENT';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  initialBalance: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string | null;
  createdAt: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  accountId: string;
  categoryId: string;
  tagIds: string[];
  createdAt: string;
}

export interface Budget {
  id: string;
  amount: number;
  month: number;
  year: number;
  categoryId: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  progress: number;
  deadline: string | null;
  createdAt: string;
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  color: string;
  total: number;
}

export interface Summary {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
  spendingByCategory: CategorySpending[];
}
