import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

const authRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

export default authRoutes;
