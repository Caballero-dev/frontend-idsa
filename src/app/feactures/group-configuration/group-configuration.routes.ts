import { Routes } from '@angular/router';
import { GroupsTabComponent } from './components/groups-tab/groups-tab.component';
import { GroupsConfigurationListComponent } from './components/groups-configuration-list/groups-configuration-list.component';

const groupConfigurationRoutes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', component: GroupsConfigurationListComponent },
  { path: 'configuracion', component: GroupsTabComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

export default groupConfigurationRoutes;
