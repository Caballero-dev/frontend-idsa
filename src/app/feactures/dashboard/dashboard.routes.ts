import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

const dashboardRoutes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

export default dashboardRoutes;
