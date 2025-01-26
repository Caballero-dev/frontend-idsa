import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.routes') },
  { path: '**', redirectTo: 'auth', pathMatch: 'full' },
];
