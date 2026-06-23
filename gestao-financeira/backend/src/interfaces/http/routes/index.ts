import { Router } from 'express';
import { Container } from '../../../main/container';
import { createAuthMiddleware } from '../middlewares/authMiddleware';
import { asyncHandler } from '../middlewares/asyncHandler';

import { AuthController } from '../controllers/AuthController';
import { AccountController } from '../controllers/AccountController';
import { CategoryController } from '../controllers/CategoryController';
import { TransactionController } from '../controllers/TransactionController';
import { BudgetController } from '../controllers/BudgetController';
import { GoalController } from '../controllers/GoalController';
import { SummaryController } from '../controllers/SummaryController';

/** Monta todas as rotas da API a partir do container (DI manual). */
export function buildRoutes(container: Container): Router {
  const router = Router();
  const auth = createAuthMiddleware(container.tokenService);

  const authController = new AuthController(container);
  const accountController = new AccountController(container);
  const categoryController = new CategoryController(container);
  const transactionController = new TransactionController(container);
  const budgetController = new BudgetController(container);
  const goalController = new GoalController(container);
  const summaryController = new SummaryController(container);

  // Health
  router.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Auth (publico)
  router.post('/auth/login', asyncHandler(authController.login));

  // Accounts (protegido)
  router.post('/accounts', asyncHandler(auth), asyncHandler(accountController.create));
  router.get('/accounts', asyncHandler(auth), asyncHandler(accountController.list));
  router.get('/accounts/:id', asyncHandler(auth), asyncHandler(accountController.get));
  router.put('/accounts/:id', asyncHandler(auth), asyncHandler(accountController.update));
  router.delete('/accounts/:id', asyncHandler(auth), asyncHandler(accountController.remove));

  // Categories
  router.post('/categories', asyncHandler(auth), asyncHandler(categoryController.create));
  router.get('/categories', asyncHandler(auth), asyncHandler(categoryController.list));
  router.get('/categories/:id', asyncHandler(auth), asyncHandler(categoryController.get));
  router.put('/categories/:id', asyncHandler(auth), asyncHandler(categoryController.update));
  router.delete('/categories/:id', asyncHandler(auth), asyncHandler(categoryController.remove));

  // Transactions
  router.post('/transactions', asyncHandler(auth), asyncHandler(transactionController.create));
  router.get('/transactions', asyncHandler(auth), asyncHandler(transactionController.list));
  router.get('/transactions/:id', asyncHandler(auth), asyncHandler(transactionController.get));
  router.put('/transactions/:id', asyncHandler(auth), asyncHandler(transactionController.update));
  router.delete('/transactions/:id', asyncHandler(auth), asyncHandler(transactionController.remove));

  // Budgets
  router.post('/budgets', asyncHandler(auth), asyncHandler(budgetController.create));
  router.get('/budgets', asyncHandler(auth), asyncHandler(budgetController.list));
  router.put('/budgets/:id', asyncHandler(auth), asyncHandler(budgetController.update));
  router.delete('/budgets/:id', asyncHandler(auth), asyncHandler(budgetController.remove));

  // Goals
  router.post('/goals', asyncHandler(auth), asyncHandler(goalController.create));
  router.get('/goals', asyncHandler(auth), asyncHandler(goalController.list));
  router.put('/goals/:id', asyncHandler(auth), asyncHandler(goalController.update));
  router.delete('/goals/:id', asyncHandler(auth), asyncHandler(goalController.remove));

  // Summary
  router.get('/summary', asyncHandler(auth), asyncHandler(summaryController.get));

  return router;
}
