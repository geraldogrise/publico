import { useState, type FormEvent } from 'react';
import { categoryService } from '../../services/financeService';
import { useAsync } from '../../hooks/useAsync';
import { Card, ErrorMsg, Loading, PageHeader } from '../../components/ui';
import type { TransactionType } from '../../types';

/** CRUD de Categorias. */
export function CategoriesPage() {
  const state = useAsync(() => categoryService.list(), []);
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [color, setColor] = useState('#3b82f6');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      await categoryService.create({ name, type, color, icon: null });
      setName('');
      state.reload();
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await categoryService.remove(id);
    state.reload();
  };

  return (
    <div>
      <PageHeader title="Categorias" />

      <Card className="form-card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Nome
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Tipo
            <select value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
              <option value="EXPENSE">Despesa</option>
              <option value="INCOME">Receita</option>
            </select>
          </label>
          <label>
            Cor
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
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
                <th>Cor</th>
                <th>Nome</th>
                <th>Tipo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(state.data ?? []).map((c) => (
                <tr key={c.id}>
                  <td>
                    <span className="color-dot" style={{ background: c.color }} />
                  </td>
                  <td>{c.name}</td>
                  <td>{c.type === 'INCOME' ? 'Receita' : 'Despesa'}</td>
                  <td className="right">
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {(state.data ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} className="state-msg">
                    Nenhuma categoria cadastrada.
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
