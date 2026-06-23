import { PrismaClient } from '@prisma/client';

import { PrismaUserRepository } from '../infrastructure/persistence/repositories/PrismaUserRepository';
import { PrismaAccountRepository } from '../infrastructure/persistence/repositories/PrismaAccountRepository';
import { PrismaCategoryRepository } from '../infrastructure/persistence/repositories/PrismaCategoryRepository';
import { PrismaTransactionRepository } from '../infrastructure/persistence/repositories/PrismaTransactionRepository';
import { PrismaBudgetRepository } from '../infrastructure/persistence/repositories/PrismaBudgetRepository';
import { PrismaGoalRepository } from '../infrastructure/persistence/repositories/PrismaGoalRepository';
import { PrismaSummaryRepository } from '../infrastructure/persistence/repositories/PrismaSummaryRepository';

import { BcryptPasswordHasher } from '../infrastructure/security/BcryptPasswordHasher';
import { JwtTokenService } from '../infrastructure/security/JwtTokenService';
import { UuidGenerator } from '../infrastructure/security/UuidGenerator';

import { LoginUseCase } from '../application/use-cases/auth/LoginUseCase';
import {
  CreateAccountUseCase,
  ListAccountsUseCase,
  GetAccountUseCase,
  UpdateAccountUseCase,
  DeleteAccountUseCase,
} from '../application/use-cases/account/AccountUseCases';
import {
  CreateCategoryUseCase,
  ListCategoriesUseCase,
  GetCategoryUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
} from '../application/use-cases/category/CategoryUseCases';
import {
  CreateTransactionUseCase,
  ListTransactionsUseCase,
  GetTransactionUseCase,
  UpdateTransactionUseCase,
  DeleteTransactionUseCase,
} from '../application/use-cases/transaction/TransactionUseCases';
import {
  CreateBudgetUseCase,
  ListBudgetsUseCase,
  UpdateBudgetUseCase,
  DeleteBudgetUseCase,
} from '../application/use-cases/budget/BudgetUseCases';
import {
  CreateGoalUseCase,
  ListGoalsUseCase,
  UpdateGoalUseCase,
  DeleteGoalUseCase,
} from '../application/use-cases/goal/GoalUseCases';
import { GetSummaryUseCase } from '../application/use-cases/summary/GetSummaryUseCase';
import { ITokenService } from '../application/ports/ITokenService';

export interface AppConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
}

/**
 * Composition Root. Injecao manual de dependencias (sem container magico).
 * Monta adapters -> use cases e expoe tudo de forma tipada.
 */
export interface Container {
  prisma: PrismaClient;
  tokenService: ITokenService;
  useCases: {
    login: LoginUseCase;
    createAccount: CreateAccountUseCase;
    listAccounts: ListAccountsUseCase;
    getAccount: GetAccountUseCase;
    updateAccount: UpdateAccountUseCase;
    deleteAccount: DeleteAccountUseCase;
    createCategory: CreateCategoryUseCase;
    listCategories: ListCategoriesUseCase;
    getCategory: GetCategoryUseCase;
    updateCategory: UpdateCategoryUseCase;
    deleteCategory: DeleteCategoryUseCase;
    createTransaction: CreateTransactionUseCase;
    listTransactions: ListTransactionsUseCase;
    getTransaction: GetTransactionUseCase;
    updateTransaction: UpdateTransactionUseCase;
    deleteTransaction: DeleteTransactionUseCase;
    createBudget: CreateBudgetUseCase;
    listBudgets: ListBudgetsUseCase;
    updateBudget: UpdateBudgetUseCase;
    deleteBudget: DeleteBudgetUseCase;
    createGoal: CreateGoalUseCase;
    listGoals: ListGoalsUseCase;
    updateGoal: UpdateGoalUseCase;
    deleteGoal: DeleteGoalUseCase;
    getSummary: GetSummaryUseCase;
  };
}

export function buildContainer(prisma: PrismaClient, config: AppConfig): Container {
  // Adapters de persistencia
  const userRepo = new PrismaUserRepository(prisma);
  const accountRepo = new PrismaAccountRepository(prisma);
  const categoryRepo = new PrismaCategoryRepository(prisma);
  const transactionRepo = new PrismaTransactionRepository(prisma);
  const budgetRepo = new PrismaBudgetRepository(prisma);
  const goalRepo = new PrismaGoalRepository(prisma);
  const summaryRepo = new PrismaSummaryRepository(prisma);

  // Adapters de seguranca/infra
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(config.jwtSecret, config.jwtExpiresIn);
  const idGenerator = new UuidGenerator();

  return {
    prisma,
    tokenService,
    useCases: {
      login: new LoginUseCase(userRepo, passwordHasher, tokenService),
      createAccount: new CreateAccountUseCase(accountRepo, idGenerator),
      listAccounts: new ListAccountsUseCase(accountRepo),
      getAccount: new GetAccountUseCase(accountRepo),
      updateAccount: new UpdateAccountUseCase(accountRepo),
      deleteAccount: new DeleteAccountUseCase(accountRepo),
      createCategory: new CreateCategoryUseCase(categoryRepo, idGenerator),
      listCategories: new ListCategoriesUseCase(categoryRepo),
      getCategory: new GetCategoryUseCase(categoryRepo),
      updateCategory: new UpdateCategoryUseCase(categoryRepo),
      deleteCategory: new DeleteCategoryUseCase(categoryRepo),
      createTransaction: new CreateTransactionUseCase(
        transactionRepo,
        accountRepo,
        categoryRepo,
        idGenerator,
      ),
      listTransactions: new ListTransactionsUseCase(transactionRepo),
      getTransaction: new GetTransactionUseCase(transactionRepo),
      updateTransaction: new UpdateTransactionUseCase(transactionRepo),
      deleteTransaction: new DeleteTransactionUseCase(transactionRepo),
      createBudget: new CreateBudgetUseCase(budgetRepo, categoryRepo, idGenerator),
      listBudgets: new ListBudgetsUseCase(budgetRepo),
      updateBudget: new UpdateBudgetUseCase(budgetRepo),
      deleteBudget: new DeleteBudgetUseCase(budgetRepo),
      createGoal: new CreateGoalUseCase(goalRepo, idGenerator),
      listGoals: new ListGoalsUseCase(goalRepo),
      updateGoal: new UpdateGoalUseCase(goalRepo),
      deleteGoal: new DeleteGoalUseCase(goalRepo),
      getSummary: new GetSummaryUseCase(summaryRepo),
    },
  };
}
