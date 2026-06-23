import { PrioridadeTarefa, StatusProjeto } from './enums';

export function corPrioridade(p: PrioridadeTarefa): string {
  switch (p) {
    case PrioridadeTarefa.Baixa:
      return 'var(--prio-baixa)';
    case PrioridadeTarefa.Media:
      return 'var(--prio-media)';
    case PrioridadeTarefa.Alta:
      return 'var(--prio-alta)';
    case PrioridadeTarefa.Critica:
      return 'var(--prio-critica)';
    default:
      return 'var(--prio-media)';
  }
}

export function corStatusProjeto(s: StatusProjeto): string {
  switch (s) {
    case StatusProjeto.Planejado:
      return '#94a3b8';
    case StatusProjeto.EmAndamento:
      return '#f59e0b';
    case StatusProjeto.Pausado:
      return '#a78bfa';
    case StatusProjeto.Concluido:
      return '#22c55e';
    case StatusProjeto.Cancelado:
      return '#ef4444';
    default:
      return '#94a3b8';
  }
}
