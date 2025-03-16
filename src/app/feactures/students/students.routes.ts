import { Routes } from '@angular/router';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { GroupListComponent } from './components/group-list/group-list.component';

const studentsRoutes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', component: GroupListComponent },
  { path: 'grupo/:id', component: StudentsListComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

export default studentsRoutes;
