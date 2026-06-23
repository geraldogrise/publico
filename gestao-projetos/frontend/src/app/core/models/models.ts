import { PrioridadeTarefa, StatusProjeto, StatusTarefa } from './enums';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  expiraEm: string;
  usuario: Usuario;
}

export interface MembroEquipe {
  usuarioId: string;
  nome: string;
  email: string;
  papel: number;
}

export interface Equipe {
  id: string;
  nome: string;
  descricao?: string | null;
  membros: MembroEquipe[];
  totalProjetos: number;
}

export interface Projeto {
  id: string;
  nome: string;
  descricao?: string | null;
  status: StatusProjeto;
  equipeId: string;
  equipeNome?: string | null;
  dataInicio?: string | null;
  dataFimPrevista?: string | null;
  totalTarefas: number;
  criadoEm: string;
}

export interface CriarProjetoRequest {
  nome: string;
  descricao?: string | null;
  equipeId: string;
  dataInicio?: string | null;
  dataFimPrevista?: string | null;
}

export interface Etiqueta {
  id: string;
  nome: string;
  cor: string;
}

export interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string | null;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
  ordem: number;
  prazo?: string | null;
  projetoId: string;
  sprintId?: string | null;
  responsavelId?: string | null;
  responsavelNome?: string | null;
  etiquetas: Etiqueta[];
  totalComentarios: number;
  criadoEm: string;
}

export interface CriarTarefaRequest {
  titulo: string;
  descricao?: string | null;
  projetoId: string;
  sprintId?: string | null;
  responsavelId?: string | null;
  prioridade: PrioridadeTarefa;
  status: StatusTarefa;
  prazo?: string | null;
}

export interface MoverTarefaRequest {
  status: StatusTarefa;
  ordem?: number | null;
}
