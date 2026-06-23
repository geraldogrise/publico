import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { summaryService } from '../../services/financeService';
import { useAsync } from '../../hooks/useAsync';
import { formatBRL } from '../../hooks/useCurrency';
import { Card, ErrorMsg, Loading, PageHeader, StatCard } from '../../components/ui';

/** Dashboard: cards de saldo/receitas/despesas + grafico de gastos por categoria. */
export function DashboardPage() {
  const { data, loading, error } = useAsync(() => summaryService.get(), []);

  const chartData = useMemo(
    () =>
      (data?.spendingByCategory ?? []).map((c) => ({
        name: c.categoryName,
        value: c.total,
        color: c.color,
      })),
    [data],
  );

  if (loading) return <Loading />;
  if (error) return <ErrorMsg message={error} />;
  if (!data) return null;

  return (
    <div>
      <PageHeader title="Dashboard" />

      <div className="stat-grid">
        <StatCard label="Saldo atual" value={formatBRL(data.balance)} variant="balance" />
        <StatCard label="Receitas" value={formatBRL(data.totalIncome)} variant="income" />
        <StatCard label="Despesas" value={formatBRL(data.totalExpense)} variant="expense" />
        <StatCard label="Transacoes" value={String(data.transactionCount)} variant="balance" />
      </div>

      <div className="dashboard-charts">
        <Card>
          <h2>Gastos por categoria</h2>
          {chartData.length === 0 ? (
            <p className="state-msg">Sem despesas registradas.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label={(e) => e.name}
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatBRL(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h2>Comparativo por categoria</h2>
          {chartData.length === 0 ? (
            <p className="state-msg">Sem despesas registradas.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(v: number) => formatBRL(v)} />
                <Bar dataKey="value">
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
}
