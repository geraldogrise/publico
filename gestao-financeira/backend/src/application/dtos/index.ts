/** DTOs de entrada/saida da camada de aplicacao. */

// Auth
export interface LoginInputDTO {
  email: string;
  password: string;
}
export interface AuthOutputDTO {
  token: string;
  user: { id: string; name: string; email: string };
}

// Account
export interface CreateAccountDTO {
  name: string;
  type: string;
  initialBalance?: number;
}
export interface UpdateAccountDTO {
  name?: string;
  type?: string;
  initialBalance?: number;
}
export interface AccountOutputDTO {
  id: string;
  name: string;
  type: string;
  initialBalance: number;
  createdAt: string;
}

// Category
export interface CreateCategoryDTO {
  name: string;
  type: string;
  color?: string;
  icon?: string | null;
}
export interface UpdateCategoryDTO {
  name?: string;
  type?: string;
  color?: string;
  icon?: string | null;
}
export interface CategoryOutputDTO {
  id: string;
  name: string;
  type: string;
  color: string;
  icon: string | null;
  createdAt: string;
}

// Transaction
export interface CreateTransactionDTO {
  description: string;
  amount: number;
  type: string;
  date?: string;
  accountId: string;
  categoryId: string;
  tagIds?: string[];
}
export interface UpdateTransactionDTO {
  description?: string;
  amount?: number;
  type?: string;
  date?: string;
  accountId?: string;
  categoryId?: string;
  tagIds?: string[];
}
export interface TransactionOutputDTO {
  id: string;
  description: string;
  amount: number;
  type: string;
  date: string;
  accountId: string;
  categoryId: string;
  tagIds: string[];
  createdAt: string;
}

// Budget
export interface CreateBudgetDTO {
  amount: number;
  month: number;
  year: number;
  categoryId: string;
}
export interface UpdateBudgetDTO {
  amount?: number;
  month?: number;
  year?: number;
  categoryId?: string;
}
export interface BudgetOutputDTO {
  id: string;
  amount: number;
  month: number;
  year: number;
  categoryId: string;
  createdAt: string;
}

// Goal
export interface CreateGoalDTO {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  deadline?: string | null;
}
export interface UpdateGoalDTO {
  name?: string;
  targetAmount?: number;
  currentAmount?: number;
  deadline?: string | null;
}
export interface GoalOutputDTO {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  progress: number;
  deadline: string | null;
  createdAt: string;
}
