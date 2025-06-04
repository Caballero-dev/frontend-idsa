import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.routes') },
  {
    path: 'panel',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: '', pathMatch: 'full' },
      {
        path: '',
        loadChildren: () => import('./feactures/feactures.routes'),
      },
      { path: '', redirectTo: '', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'auth', pathMatch: 'full' },
];
