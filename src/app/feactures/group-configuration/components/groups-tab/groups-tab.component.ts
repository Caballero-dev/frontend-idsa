import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { ModalitiesListComponent } from '../modalities/modalities-list/modalities-list.component';
import { SpecialitiesListComponent } from '../specialities/specialities-list/specialities-list.component';
import { GradesListComponent } from '../grades/grades-list/grades-list.component';
import { GroupsListComponent } from '../groups/groups-list/groups-list.component';
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
    ModalitiesListComponent,
    SpecialitiesListComponent,
    GradesListComponent,
    GroupsListComponent,
    GenerationsListComponent,
    RouterLink,
    ButtonModule,
  ],
  templateUrl: './groups-tab.component.html',
  styleUrl: './groups-tab.component.scss',
})
export class GroupsTabComponent {}
