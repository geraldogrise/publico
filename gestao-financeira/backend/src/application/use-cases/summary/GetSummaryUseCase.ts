import {
  ISummaryRepository,
  FinancialSummary,
} from '../../../domain/repositories/ISummaryRepository';

/** Caso de uso: resumo financeiro (saldo, receitas, despesas, gastos por categoria). */
export class GetSummaryUseCase {
  constructor(private readonly repo: ISummaryRepository) {}

  async execute(userId: string, from?: Date, to?: Date): Promise<FinancialSummary> {
    return this.repo.getSummary(userId, from, to);
  }
}
