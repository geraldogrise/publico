export enum StatusTarefa {
  Backlog = 0,
  AFazer = 1,
  EmAndamento = 2,
  Concluido = 3,
}

export enum PrioridadeTarefa {
  Baixa = 0,
  Media = 1,
  Alta = 2,
  Critica = 3,
}

export enum StatusProjeto {
  Planejado = 0,
  EmAndamento = 1,
  Pausado = 2,
  Concluido = 3,
  Cancelado = 4,
}

export const ROTULO_STATUS_TAREFA: Record<StatusTarefa, string> = {
  [StatusTarefa.Backlog]: 'Backlog',
  [StatusTarefa.AFazer]: 'A Fazer',
  [StatusTarefa.EmAndamento]: 'Em Andamento',
  [StatusTarefa.Concluido]: 'Concluido',
};

export const ROTULO_PRIORIDADE: Record<PrioridadeTarefa, string> = {
  [PrioridadeTarefa.Baixa]: 'Baixa',
  [PrioridadeTarefa.Media]: 'Media',
  [PrioridadeTarefa.Alta]: 'Alta',
  [PrioridadeTarefa.Critica]: 'Critica',
};

export const ROTULO_STATUS_PROJETO: Record<StatusProjeto, string> = {
  [StatusProjeto.Planejado]: 'Planejado',
  [StatusProjeto.EmAndamento]: 'Em Andamento',
  [StatusProjeto.Pausado]: 'Pausado',
  [StatusProjeto.Concluido]: 'Concluido',
  [StatusProjeto.Cancelado]: 'Cancelado',
};

export const COLUNAS_KANBAN: StatusTarefa[] = [
  StatusTarefa.Backlog,
  StatusTarefa.AFazer,
  StatusTarefa.EmAndamento,
  StatusTarefa.Concluido,
];
