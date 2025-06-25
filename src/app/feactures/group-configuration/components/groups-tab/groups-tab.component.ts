import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { ModalitiesComponent } from '../modalities/modalities.component';
import { SpecialtiesComponent } from '../specialties/specialties.component';
import { GradesComponent } from '../grades/grades.component';
import { GroupsComponent } from '../groups/groups.component';
import { GenerationsComponent } from '../generations/generations.component';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CampusesListComponent } from '../campuses/campuses-list/campuses-list.component';

@Component({
  selector: 'app-groups-tab',
  standalone: true,
  imports: [
    TabsModule,
    CampusesListComponent,
    ModalitiesComponent,
    SpecialtiesComponent,
    GradesComponent,
    GroupsComponent,
    GenerationsComponent,
    RouterLink,
    ButtonModule,
  ],
  templateUrl: './groups-tab.component.html',
  styleUrl: './groups-tab.component.scss',
})
export class GroupsTabComponent {}
