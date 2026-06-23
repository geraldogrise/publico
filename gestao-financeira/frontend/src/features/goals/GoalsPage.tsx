import { useState, type FormEvent } from 'react';
import { goalService } from '../../services/financeService';
import { useAsync } from '../../hooks/useAsync';
import { formatBRL } from '../../hooks/useCurrency';
import { Card, ErrorMsg, Loading, PageHeader } from '../../components/ui';

/** CRUD de Metas de economia (com barra de progresso). */
export function GoalsPage() {
  const state = useAsync(() => goalService.list(), []);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [deadline, setDeadline] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      await goalService.create({
        name,
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount),
        deadline: deadline ? new Date(deadline).toISOString() : null,
      });
      setName('');
      setTargetAmount('');
      setCurrentAmount('0');
      setDeadline('');
      state.reload();
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await goalService.remove(id);
    state.reload();
  };

  return (
    <div>
      <PageHeader title="Metas" />

      <Card className="form-card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Nome
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Valor alvo
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
            />
          </label>
          <label>
            Valor atual
            <input
              type="number"
              step="0.01"
              min="0"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
            />
          </label>
          <label>
            Prazo (opcional)
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
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
        <div className="goals-grid">
          {(state.data ?? []).map((g) => {
            const pct = Math.min(
              100,
              Math.round((g.currentAmount / (g.targetAmount || 1)) * 100),
            );
            return (
              <Card key={g.id} className="goal-card">
                <div className="goal-head">
                  <h3>{g.name}</h3>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(g.id)}>
                    Excluir
                  </button>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${pct}%` }} />
                </div>
                <div className="goal-values">
                  <span>{formatBRL(g.currentAmount)}</span>
                  <span className="muted">de {formatBRL(g.targetAmount)}</span>
                  <span className="goal-pct">{pct}%</span>
                </div>
                {g.deadline && (
                  <p className="muted">
                    Prazo: {new Date(g.deadline).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </Card>
            );
          })}
          {(state.data ?? []).length === 0 && (
            <Card>
              <p className="state-msg">Nenhuma meta cadastrada.</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
