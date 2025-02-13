import { Routes } from '@angular/router';

const dashboardRoutes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', loadChildren: () => import('./dashboard/dashboard.routes') },
  { path: 'tutores', loadChildren: () => import('./tutors/tutors.routes') },
  { path: 'alumnos', loadChildren: () => import('./students/students.routes') },
  { path: 'usuarios', loadChildren: () => import('./users/users.routes') },
  { path: 'perfil', loadChildren: () => import('./profile/profile.routes') },
  { path: '**', redirectTo: 'inicio', pathMatch: 'full' },
];

export default dashboardRoutes;
