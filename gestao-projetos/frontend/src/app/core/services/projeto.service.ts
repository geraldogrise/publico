import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CriarProjetoRequest, Projeto } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProjetoService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/projetos`;

  listar(): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(this.base);
  }

  obter(id: string): Observable<Projeto> {
    return this.http.get<Projeto>(`${this.base}/${id}`);
  }

  criar(req: CriarProjetoRequest): Observable<Projeto> {
    return this.http.post<Projeto>(this.base, req);
  }

  remover(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
