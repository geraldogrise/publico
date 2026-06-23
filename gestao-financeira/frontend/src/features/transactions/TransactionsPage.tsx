import { useState, type FormEvent } from 'react';
import {
  accountService,
  categoryService,
  transactionService,
} from '../../services/financeService';
import { useAsync } from '../../hooks/useAsync';
import { formatBRL } from '../../hooks/useCurrency';
import { Card, ErrorMsg, Loading, PageHeader } from '../../components/ui';
import type { TransactionType } from '../../types';

/** CRUD de Transacoes (receitas/despesas). Consome a API Node via JWT. */
export function TransactionsPage() {
  const txState = useAsync(() => transactionService.list(), []);
  const accountsState = useAsync(() => accountService.list(), []);
  const categoriesState = useAsync(() => categoryService.list(), []);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const accounts = accountsState.data ?? [];
  const categories = categoriesState.data ?? [];

  const nameOf = (list: { id: string; name: string }[], id: string) =>
    list.find((x) => x.id === id)?.name ?? '-';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!accountId || !categoryId) {
      setFormError('Selecione conta e categoria.');
      return;
    }
    setSaving(true);
    try {
      await transactionService.create({
        description,
        amount: Number(amount),
        type,
        accountId,
        categoryId,
        date: new Date(date).toISOString(),
      });
      setDescription('');
      setAmount('');
      txState.reload();
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await transactionService.remove(id);
    txState.reload();
  };

  return (
    <div>
      <PageHeader title="Transacoes" />

      <Card className="form-card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Descricao
            <input value={description} onChange={(e) => setDescription(e.target.value)} required />
          </label>
          <label>
            Valor
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
            Tipo
            <select value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
              <option value="EXPENSE">Despesa</option>
              <option value="INCOME">Receita</option>
            </select>
          </label>
          <label>
            Conta
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
              <option value="">Selecione...</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
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
            Data
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </label>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>
        </form>
        {formError && <div className="state-error">{formError}</div>}
      </Card>

      {txState.loading ? (
        <Loading />
      ) : txState.error ? (
        <ErrorMsg message={txState.error} />
      ) : (
        <Card>
          <table className="table">
            <thead>
              <tr>
                <th>Descricao</th>
                <th>Categoria</th>
                <th>Conta</th>
                <th>Data</th>
                <th className="right">Valor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(txState.data ?? []).map((t) => (
                <tr key={t.id}>
                  <td>{t.description}</td>
                  <td>{nameOf(categories, t.categoryId)}</td>
                  <td>{nameOf(accounts, t.accountId)}</td>
                  <td>{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                  <td className={`right ${t.type === 'INCOME' ? 'text-income' : 'text-expense'}`}>
                    {t.type === 'INCOME' ? '+' : '-'} {formatBRL(t.amount)}
                  </td>
                  <td className="right">
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {(txState.data ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="state-msg">
                    Nenhuma transacao cadastrada.
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
