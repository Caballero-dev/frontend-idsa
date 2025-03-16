import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GroupConfigurationView } from '../../models/group-configuration-view.model';
import { GroupConfigurationViewTestService } from '../../tests/group-configuration-view-test.service';
import { Column, TableUtils } from '../../../utils/table.utils';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TableModule, ButtonModule, InputGroupModule, InputTextModule, FormsModule],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.scss',
})
export class GroupListComponent implements OnInit {
  searchGroupValue: string = '';
  isLoading: boolean = true;
  cols: Column[] = [
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'description', header: 'Descripción', sortable: true },
    { field: 'students', header: 'Núm. Estudiantes', sortable: true },
  ];
  groups!: GroupConfigurationView[];

  tableUtils = TableUtils;
  private groupDataViewService = inject(GroupConfigurationViewTestService);

  ngOnInit(): void {
    this.loadGroupData();
  }

  loadGroupData(): void {
    this.groups = this.groupDataViewService.getDataView();
    this.isLoading = false;
  }
}
