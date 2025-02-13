import { Routes } from '@angular/router';
import { TutorsListComponent } from './components/tutors-list/tutors-list.component';

const tutorsRoutes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', component: TutorsListComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

export default tutorsRoutes;
