import { Routes } from '@angular/router';
import { StudentsListComponent } from './components/students-list/students-list.component';

const studentsRoutes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', component: StudentsListComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

export default studentsRoutes;
