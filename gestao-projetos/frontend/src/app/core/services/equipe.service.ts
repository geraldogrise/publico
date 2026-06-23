import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Equipe } from '../models/models';

@Injectable({ providedIn: 'root' })
export class EquipeService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/equipes`;

  listar(): Observable<Equipe[]> {
    return this.http.get<Equipe[]>(this.base);
  }
}
