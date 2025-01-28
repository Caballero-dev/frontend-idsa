import { Routes } from '@angular/router';

const dashboardRoutes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', loadChildren: () => import('./dashboard/dashboard.routes') },
  { path: '**', redirectTo: 'inicio', pathMatch: 'full' },
];

export default dashboardRoutes;
