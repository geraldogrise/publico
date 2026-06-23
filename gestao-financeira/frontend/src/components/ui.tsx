import type { ReactNode } from 'react';

/** Componentes de UI reutilizaveis (clean code, baixa responsabilidade). */

export function PageHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="page-header">
      <h1>{title}</h1>
      {action}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`card ${className ?? ''}`}>{children}</div>;
}

export function StatCard({
  label,
  value,
  variant,
}: {
  label: string;
  value: string;
  variant?: 'income' | 'expense' | 'balance';
}) {
  return (
    <div className={`stat-card stat-${variant ?? 'balance'}`}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}

export function Loading() {
  return <div className="state-msg">Carregando...</div>;
}

export function ErrorMsg({ message }: { message: string }) {
  return <div className="state-msg state-error">{message}</div>;
}

export function Empty({ message }: { message: string }) {
  return <div className="state-msg">{message}</div>;
}
