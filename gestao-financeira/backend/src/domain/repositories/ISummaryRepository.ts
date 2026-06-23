/** Port para consultas de resumo/agregacao financeira. */
export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  color: string;
  total: number;
}

export interface FinancialSummary {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
  spendingByCategory: CategorySpending[];
}

export interface ISummaryRepository {
  getSummary(userId: string, from?: Date, to?: Date): Promise<FinancialSummary>;
}
