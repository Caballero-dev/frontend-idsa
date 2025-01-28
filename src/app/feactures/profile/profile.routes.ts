import { Routes } from '@angular/router';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';

const profileRoutes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', component: ProfileDetailsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

export default profileRoutes;
