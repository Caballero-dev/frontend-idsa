import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-groups-configuration-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './groups-configuration-list.component.html',
  styleUrl: './groups-configuration-list.component.scss',
})
export class GroupsConfigurationListComponent {}
