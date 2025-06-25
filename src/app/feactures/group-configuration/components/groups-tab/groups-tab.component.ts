import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { ModalitiesComponent } from '../modalities/modalities.component';
import { SpecialtiesComponent } from '../specialties/specialties.component';
import { GradesComponent } from '../grades/grades.component';
import { GroupsComponent } from '../groups/groups.component';
import { GenerationsListComponent } from '../generations/generations-list/generations-list.component';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CampusesListComponent } from '../campuses/campuses-list/campuses-list.component';

@Component({
  selector: 'app-groups-tab',
  standalone: true,
  imports: [
    TabViewModule,
    CampusesListComponent,
    ModalitiesComponent,
    SpecialtiesComponent,
    GradesComponent,
    GroupsComponent,
    GenerationsListComponent,
    RouterLink,
    ButtonModule,
  ],
  templateUrl: './groups-tab.component.html',
  styleUrl: './groups-tab.component.scss',
})
export class GroupsTabComponent {}
