import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, Usuario } from '../models/models';

const CHAVE_TOKEN = 'gp_token';
const CHAVE_USUARIO = 'gp_usuario';

/**
 * Servico de autenticacao. Mantem o estado do usuario/token com signals
 * e persiste em localStorage para sobreviver a recargas.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/auth`;

  private readonly _token = signal<string | null>(this.lerToken());
  private readonly _usuario = signal<Usuario | null>(this.lerUsuario());

  readonly usuario = this._usuario.asReadonly();
  readonly autenticado = computed(() => this._token() !== null);

  login(credenciais: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/login`, credenciais).pipe(
      tap((resp) => this.guardarSessao(resp)),
    );
  }

  logout(): void {
    localStorage.removeItem(CHAVE_TOKEN);
    localStorage.removeItem(CHAVE_USUARIO);
    this._token.set(null);
    this._usuario.set(null);
  }

  obterToken(): string | null {
    return this._token();
  }

  private guardarSessao(resp: LoginResponse): void {
    localStorage.setItem(CHAVE_TOKEN, resp.token);
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(resp.usuario));
    this._token.set(resp.token);
    this._usuario.set(resp.usuario);
  }

  private lerToken(): string | null {
    return localStorage.getItem(CHAVE_TOKEN);
  }

  private lerUsuario(): Usuario | null {
    const bruto = localStorage.getItem(CHAVE_USUARIO);
    return bruto ? (JSON.parse(bruto) as Usuario) : null;
  }
}
