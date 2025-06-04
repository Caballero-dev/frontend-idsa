import { Routes } from '@angular/router';
import { Role } from '../core/models/Role.enum';
import { roleGuard } from '../core/guards/role.guard';
const dashboardRoutes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadChildren: () => import('./dashboard/dashboard.routes'),
  },
  {
    path: 'tutores',
    loadChildren: () => import('./tutors/tutors.routes'),
    canActivate: [roleGuard],
    data: { role: Role.ADMIN },
  },
  {
    path: 'grupos',
    loadChildren: () => import('./group-configuration/group-configuration.routes'),
    canActivate: [roleGuard],
    data: { role: Role.ADMIN },
  },
  {
    path: 'alumnos',
    loadChildren: () => import('./students/students.routes'),
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./users/users.routes'),
    canActivate: [roleGuard],
    data: { role: Role.ADMIN },
  },
  {
    path: 'perfil',
    loadChildren: () => import('./profile/profile.routes'),
  },
  { path: '**', redirectTo: 'inicio', pathMatch: 'full' },
];

export default dashboardRoutes;
