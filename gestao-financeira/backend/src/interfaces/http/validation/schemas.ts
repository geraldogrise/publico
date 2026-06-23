import { z } from 'zod';

const transactionTypes = ['INCOME', 'EXPENSE'] as const;
const accountTypes = ['CHECKING', 'SAVINGS', 'WALLET', 'CREDIT_CARD', 'INVESTMENT'] as const;

export const loginSchema = z.object({
  email: z.string().email('E-mail invalido.'),
  password: z.string().min(1, 'Senha obrigatoria.'),
});

export const createAccountSchema = z.object({
  name: z.string().min(1, 'Nome obrigatorio.'),
  type: z.enum(accountTypes),
  initialBalance: z.number().optional(),
});
export const updateAccountSchema = createAccountSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Nome obrigatorio.'),
  type: z.enum(transactionTypes),
  color: z.string().optional(),
  icon: z.string().nullable().optional(),
});
export const updateCategorySchema = createCategorySchema.partial();

export const createTransactionSchema = z.object({
  description: z.string().min(1, 'Descricao obrigatoria.'),
  amount: z.number().positive('Valor deve ser positivo.'),
  type: z.enum(transactionTypes),
  date: z.string().optional(),
  accountId: z.string().min(1, 'Conta obrigatoria.'),
  categoryId: z.string().min(1, 'Categoria obrigatoria.'),
  tagIds: z.array(z.string()).optional(),
});
export const updateTransactionSchema = createTransactionSchema.partial();

export const createBudgetSchema = z.object({
  amount: z.number().positive('Valor deve ser positivo.'),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  categoryId: z.string().min(1, 'Categoria obrigatoria.'),
});
export const updateBudgetSchema = createBudgetSchema.partial();

export const createGoalSchema = z.object({
  name: z.string().min(1, 'Nome obrigatorio.'),
  targetAmount: z.number().positive('Valor alvo deve ser positivo.'),
  currentAmount: z.number().min(0).optional(),
  deadline: z.string().nullable().optional(),
});
export const updateGoalSchema = createGoalSchema.partial();
