import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CriarTarefaRequest, MoverTarefaRequest, Tarefa } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TarefaService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/tarefas`;

  listarPorProjeto(projetoId: string): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.base, { params: { projetoId } });
  }

  criar(req: CriarTarefaRequest): Observable<Tarefa> {
    return this.http.post<Tarefa>(this.base, req);
  }

  mover(id: string, req: MoverTarefaRequest): Observable<Tarefa> {
    return this.http.patch<Tarefa>(`${this.base}/${id}/mover`, req);
  }

  remover(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
