import { Routes } from '@angular/router';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { GroupListComponent } from './components/group-list/group-list.component';
import { ReportDetailsComponent } from './components/report-details/report-details.component';

const studentsRoutes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', component: GroupListComponent },
  { path: 'grupo/:grupoId', component: StudentsListComponent },
  { path: 'grupo/:grupoId/alumno/:alumnoId/dictamen', component: ReportDetailsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

export default studentsRoutes;
