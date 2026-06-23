import { api, setToken } from './apiClient';
import type {
  Account,
  AuthResponse,
  Budget,
  Category,
  Goal,
  Summary,
  Transaction,
} from '../types';

/** Servicos de dominio (uma funcao por endpoint). Camada de acesso a API. */

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    setToken(res.token);
    return res;
  },
};

export const accountService = {
  list: () => api.get<Account[]>('/accounts'),
  create: (data: Partial<Account>) => api.post<Account>('/accounts', data),
  update: (id: string, data: Partial<Account>) => api.put<Account>(`/accounts/${id}`, data),
  remove: (id: string) => api.delete<void>(`/accounts/${id}`),
};

export const categoryService = {
  list: () => api.get<Category[]>('/categories'),
  create: (data: Partial<Category>) => api.post<Category>('/categories', data),
  update: (id: string, data: Partial<Category>) => api.put<Category>(`/categories/${id}`, data),
  remove: (id: string) => api.delete<void>(`/categories/${id}`),
};

export const transactionService = {
  list: () => api.get<Transaction[]>('/transactions'),
  create: (data: Partial<Transaction>) => api.post<Transaction>('/transactions', data),
  update: (id: string, data: Partial<Transaction>) =>
    api.put<Transaction>(`/transactions/${id}`, data),
  remove: (id: string) => api.delete<void>(`/transactions/${id}`),
};

export const budgetService = {
  list: () => api.get<Budget[]>('/budgets'),
  create: (data: Partial<Budget>) => api.post<Budget>('/budgets', data),
  update: (id: string, data: Partial<Budget>) => api.put<Budget>(`/budgets/${id}`, data),
  remove: (id: string) => api.delete<void>(`/budgets/${id}`),
};

export const goalService = {
  list: () => api.get<Goal[]>('/goals'),
  create: (data: Partial<Goal>) => api.post<Goal>('/goals', data),
  update: (id: string, data: Partial<Goal>) => api.put<Goal>(`/goals/${id}`, data),
  remove: (id: string) => api.delete<void>(`/goals/${id}`),
};

export const summaryService = {
  get: () => api.get<Summary>('/summary'),
};
