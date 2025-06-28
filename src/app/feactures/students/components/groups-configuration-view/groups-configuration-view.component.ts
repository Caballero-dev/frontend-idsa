import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

import { GroupConfigurationViewService } from '../../services/group-configuration-view.service';
import { ProfileService } from '../../../profile/services/profile.service';

import { ApiError } from '../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../core/models/ApiResponse.model';
import { Role } from '../../../../core/models/Role.enum';

import { Column } from '../../../../shared/types/table.types';
import { TableUtils } from '../../../utils/table.utils';

import { GroupConfigurationView } from '../../models/group-configuration-view.model';

@Component({
  selector: 'app-groups-configuration-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    InputGroupModule,
    InputTextModule,
    TableModule,
    ToolbarModule,
    ToastModule,
    TooltipModule,
  ],
  templateUrl: './groups-configuration-view.component.html',
  styleUrl: './groups-configuration-view.component.scss',
  providers: [MessageService],
})
export class GroupsConfigurationViewComponent implements OnInit {
  private groupConfigurationViewService = inject(GroupConfigurationViewService);
  private profileService: ProfileService = inject(ProfileService);
  private messageService: MessageService = inject(MessageService);
  private groupCache: Map<number, GroupConfigurationView[]> = new Map<number, GroupConfigurationView[]>();

  isLoading: boolean = true;

  searchGroupValue: string = '';

  cols: Column[] = [
    { field: 'name', header: 'Nombre', sortable: false },
    { field: 'description', header: 'Descripción', sortable: false },
    { field: 'students', header: 'Núm. Estudiantes', sortable: false },
  ];
  tableUtils = TableUtils;

  groups!: GroupConfigurationView[];

  rows: number = 20;
  first: number = 0;
  totalRecords: number = 0;

  ngOnInit(): void {}

  refreshTableData(): void {
    this.first = 0;
    this.groupCache.clear();
    this.loadGroupData({ first: this.first, rows: this.rows });
  }

  validateProfile(event: TableLazyLoadEvent): void {
    if (!this.profileService.isLoading() && this.profileService.profile()?.roleName === Role.TUTOR) {
      this.loadGroupDataByTutorEmail(event, this.profileService.profile()!.email);
    } else {
      this.loadGroupData(event);
    }
  }

  loadGroupData(event: TableLazyLoadEvent): void {
    this.isLoading = true;
    this.first = event.first ?? 0;
    const currentRows: number = event.rows ?? this.rows;
    if (this.rows !== currentRows) {
      this.rows = currentRows;
      this.groupCache.clear();
    }

    const page = this.getCurrentPageIndex();
    if (this.groupCache.has(page)) {
      this.groups = this.groupCache.get(page)!;
      this.isLoading = false;
      return;
    }

    this.groupConfigurationViewService.getAllGroupConfigurationsView(page, this.rows).subscribe({
      next: (response: ApiResponse<GroupConfigurationView[]>) => {
        this.groups = response.data;
        this.totalRecords = response.pageInfo!.totalElements;
        this.groupCache.set(page, this.groups);
        this.isLoading = false;
      },
      error: (error: ApiError) => {
        if (error.status === 'Unknown Error' && error.statusCode === 0) {
          this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
        } else {
          this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
        }
        this.isLoading = false;
      },
    });
  }

  loadGroupDataByTutorEmail(event: TableLazyLoadEvent, tutorEmail: string): void {
    this.isLoading = true;
    this.first = event.first ?? 0;
    const currentRows: number = event.rows ?? this.rows;
    if (this.rows !== currentRows) {
      this.rows = currentRows;
      this.groupCache.clear();
    }

    const page = this.getCurrentPageIndex();
    if (this.groupCache.has(page)) {
      this.groups = this.groupCache.get(page)!;
      this.isLoading = false;
      return;
    }

    this.groupConfigurationViewService.getGroupConfigurationViewByTutorEmail(tutorEmail, page, this.rows).subscribe({
      next: (response: ApiResponse<GroupConfigurationView[]>) => {
        this.groups = response.data;
        this.totalRecords = response.pageInfo!.totalElements;
        this.groupCache.set(page, this.groups);
        this.isLoading = false;
      },
      error: (error: ApiError) => {
        if (error.status === 'Unknown Error' && error.statusCode === 0) {
          this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
        } else {
          this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
        }
        this.isLoading = false;
      },
    });
  }

  getGeneration(generation: string): { startDate: string; endDate: string } {
    const [startDate, endDate] = generation.split('/');
    return { startDate, endDate };
  }

  showToast(severity: 'success' | 'error' | 'warn' | 'info', summary: string, detail: string): void {
    this.messageService.add({
      severity,
      icon: this.getToastIcon(severity),
      summary,
      detail,
      life: 5000,
    });
  }

  private getCurrentPageIndex(): number {
    return this.first / this.rows;
  }

  private getToastIcon(severity: 'success' | 'error' | 'warn' | 'info'): string {
    switch (severity) {
      case 'success':
        return 'pi pi-check-circle';
      case 'error':
        return 'pi pi-times-circle';
      case 'warn':
        return 'pi pi-exclamation-triangle';
      default:
        return 'pi pi-info-circle';
    }
  }
}
