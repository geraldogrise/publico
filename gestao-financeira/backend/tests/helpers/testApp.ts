import { Application } from 'express';
import { createApp } from '../../src/main/app';
import { Container } from '../../src/main/container';

import {
  InMemoryUserRepository,
  InMemoryAccountRepository,
  InMemoryCategoryRepository,
  InMemoryTransactionRepository,
  InMemoryBudgetRepository,
  InMemoryGoalRepository,
  InMemorySummaryRepository,
} from './inMemoryRepositories';

import { BcryptPasswordHasher } from '../../src/infrastructure/security/BcryptPasswordHasher';
import { JwtTokenService } from '../../src/infrastructure/security/JwtTokenService';
import { UuidGenerator } from '../../src/infrastructure/security/UuidGenerator';

import { LoginUseCase } from '../../src/application/use-cases/auth/LoginUseCase';
import {
  CreateAccountUseCase,
  ListAccountsUseCase,
  GetAccountUseCase,
  UpdateAccountUseCase,
  DeleteAccountUseCase,
} from '../../src/application/use-cases/account/AccountUseCases';
import {
  CreateCategoryUseCase,
  ListCategoriesUseCase,
  GetCategoryUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
} from '../../src/application/use-cases/category/CategoryUseCases';
import {
  CreateTransactionUseCase,
  ListTransactionsUseCase,
  GetTransactionUseCase,
  UpdateTransactionUseCase,
  DeleteTransactionUseCase,
} from '../../src/application/use-cases/transaction/TransactionUseCases';
import {
  CreateBudgetUseCase,
  ListBudgetsUseCase,
  UpdateBudgetUseCase,
  DeleteBudgetUseCase,
} from '../../src/application/use-cases/budget/BudgetUseCases';
import {
  CreateGoalUseCase,
  ListGoalsUseCase,
  UpdateGoalUseCase,
  DeleteGoalUseCase,
} from '../../src/application/use-cases/goal/GoalUseCases';
import { GetSummaryUseCase } from '../../src/application/use-cases/summary/GetSummaryUseCase';
import { User } from '../../src/domain/entities/User';
import { randomUUID } from 'crypto';

const TEST_JWT_SECRET = 'test-secret';

/**
 * Monta um app de teste com repositorios em memoria.
 * Faz o seed do usuario admin@demo.com / 123456.
 */
export async function buildTestApp(): Promise<{ app: Application; container: Container }> {
  const userRepo = new InMemoryUserRepository();
  const accountRepo = new InMemoryAccountRepository();
  const categoryRepo = new InMemoryCategoryRepository();
  const transactionRepo = new InMemoryTransactionRepository();
  const budgetRepo = new InMemoryBudgetRepository();
  const goalRepo = new InMemoryGoalRepository();
  const summaryRepo = new InMemorySummaryRepository(accountRepo, transactionRepo, categoryRepo);

  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(TEST_JWT_SECRET, '1d');
  const idGenerator = new UuidGenerator();

  // Seed do usuario admin
  const hashed = await passwordHasher.hash('123456');
  await userRepo.create(
    User.create({
      id: randomUUID(),
      name: 'Administrador Demo',
      email: 'admin@demo.com',
      password: hashed,
    }),
  );

  const container: Container = {
    // prisma nao e usado no app de teste; cast controlado
    prisma: undefined as unknown as Container['prisma'],
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

  const app = createApp(container, { corsOrigin: '*' });
  return { app, container };
}
