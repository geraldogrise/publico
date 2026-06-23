import { useState, type FormEvent } from 'react';
import { budgetService, categoryService } from '../../services/financeService';
import { useAsync } from '../../hooks/useAsync';
import { formatBRL } from '../../hooks/useCurrency';
import { Card, ErrorMsg, Loading, PageHeader } from '../../components/ui';

const MESES = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

/** CRUD de Orcamentos por categoria/mes. */
export function BudgetsPage() {
  const state = useAsync(() => budgetService.list(), []);
  const categoriesState = useAsync(() => categoryService.list(), []);
  const now = new Date();

  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [categoryId, setCategoryId] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const categories = categoriesState.data ?? [];
  const nameOf = (id: string) => categories.find((c) => c.id === id)?.name ?? '-';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!categoryId) {
      setFormError('Selecione uma categoria.');
      return;
    }
    setSaving(true);
    try {
      await budgetService.create({ amount: Number(amount), month, year, categoryId });
      setAmount('');
      state.reload();
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await budgetService.remove(id);
    state.reload();
  };

  return (
    <div>
      <PageHeader title="Orcamentos" />

      <Card className="form-card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Categoria
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              <option value="">Selecione...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Valor limite
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
          <label>
            Mes
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {MESES.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label>
            Ano
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              required
            />
          </label>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>
        </form>
        {formError && <div className="state-error">{formError}</div>}
      </Card>

      {state.loading ? (
        <Loading />
      ) : state.error ? (
        <ErrorMsg message={state.error} />
      ) : (
        <Card>
          <table className="table">
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Periodo</th>
                <th className="right">Limite</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(state.data ?? []).map((b) => (
                <tr key={b.id}>
                  <td>{nameOf(b.categoryId)}</td>
                  <td>
                    {MESES[b.month - 1]}/{b.year}
                  </td>
                  <td className="right">{formatBRL(b.amount)}</td>
                  <td className="right">
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {(state.data ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} className="state-msg">
                    Nenhum orcamento cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
