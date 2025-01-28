import { Routes } from '@angular/router';
import { UsersListComponent } from './components/users-list/users-list.component';

const usersRoutes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', component: UsersListComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

export default usersRoutes;
