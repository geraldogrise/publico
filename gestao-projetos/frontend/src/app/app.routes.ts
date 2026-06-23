import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'projetos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/projetos/projetos.component').then((m) => m.ProjetosComponent),
  },
  {
    path: 'projetos/:id/board',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/board/board.component').then((m) => m.BoardComponent),
  },
  { path: '', redirectTo: 'projetos', pathMatch: 'full' },
  { path: '**', redirectTo: 'projetos' },
];
