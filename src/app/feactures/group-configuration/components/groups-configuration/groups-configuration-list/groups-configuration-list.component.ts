import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

import { GroupConfigurationService } from '../../../services/group-configuration.service';

import { ApiError } from '../../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../../core/models/ApiResponse.model';

import { DialogState } from '../../../../../shared/types/dialog.types';
import { Column } from '../../../../../shared/types/table.types';
import { TableUtils } from '../../../../utils/table.utils';
import { hasText } from '../../../../../utils/string.utils';

import { GroupConfigurationResponse } from '../../../models/group-configuration.model';
import { GroupsConfigurationFormComponent } from '../groups-configuration-form/groups-configuration-form.component';

@Component({
  selector: 'app-groups-configuration-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    InputGroupModule,
    InputTextModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    TooltipModule,
    GroupsConfigurationFormComponent,
  ],
  templateUrl: './groups-configuration-list.component.html',
  styleUrl: './groups-configuration-list.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class GroupsConfigurationListComponent implements OnInit {
  private groupConfigurationService: GroupConfigurationService = inject(GroupConfigurationService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private groupConfigurationCache: Map<number, GroupConfigurationResponse[]> = new Map<
    number,
    GroupConfigurationResponse[]
  >();

  isLoading: boolean = true;
  isCreateGroupConfiguration: boolean = true;
  isGroupConfigurationDialogVisible: boolean = false;

  searchGroupConfigurationValue: string | null = null;

  cols: Column[] = [
    { field: 'tutor.fullName', header: 'Tutor', sortable: false },
    { field: 'tutor.email', header: 'Correo electrónico', sortable: false },
    { field: 'campus.name', header: 'Campus', sortable: false },
    { field: 'specialty.name', header: 'Especialidad', sortable: false },
    { field: 'modality.name', header: 'Modalidad', sortable: false },
    { field: 'grade.name', header: 'Grado', sortable: false },
    { field: 'group.name', header: 'Grupo', sortable: false },
    { field: 'generation', header: 'Generación', sortable: false },
  ];
  tableUtils = TableUtils;

  groupConfigurations!: GroupConfigurationResponse[];
  selectedGroupConfiguration!: GroupConfigurationResponse | null;

  rows: number = 20;
  first: number = 0;
  totalRecords: number = 0;

  ngOnInit(): void {}

  loadGroupConfigurations(event: TableLazyLoadEvent): void {
    this.isLoading = true;
    this.first = event.first ?? 0;
    const currentRows: number = event.rows ?? this.rows;
    if (this.rows !== currentRows) {
      this.rows = currentRows;
      this.groupConfigurationCache.clear();
    }

    const page: number = this.getCurrentPageIndex();
    if (this.groupConfigurationCache.has(page)) {
      this.groupConfigurations = this.groupConfigurationCache.get(page)!;
      this.isLoading = false;
      return;
    }

    this.groupConfigurationService
      .getAllGroupConfigurations(page, this.rows, this.searchGroupConfigurationValue)
      .subscribe({
        next: (response: ApiResponse<GroupConfigurationResponse[]>) => {
          this.groupConfigurations = response.data;
          this.totalRecords = response.pageInfo!.totalElements;
          this.groupConfigurationCache.set(page, this.groupConfigurations);
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

  refreshTableData(): void {
    this.first = 0;
    this.groupConfigurationCache.clear();
    this.loadGroupConfigurations({ first: this.first, rows: this.rows });
  }

  search(): void {
    if (this.hasTextValue(this.searchGroupConfigurationValue)) {
      this.first = 0;
      this.groupConfigurationCache.clear();
      this.loadGroupConfigurations({ first: 0, rows: this.rows });
    }
  }

  resetSearch(): void {
    this.searchGroupConfigurationValue = null;
    this.groupConfigurationCache.clear();
    this.loadGroupConfigurations({ first: 0, rows: this.rows });
  }

  openCreateGroupConfigurationDialog(): void {
    this.selectedGroupConfiguration = null;
    this.isCreateGroupConfiguration = true;
    this.isGroupConfigurationDialogVisible = true;
  }

  openEditGroupConfigurationDialog(groupConfiguration: GroupConfigurationResponse): void {
    this.selectedGroupConfiguration = groupConfiguration;
    this.isCreateGroupConfiguration = false;
    this.isGroupConfigurationDialogVisible = true;
  }

  onGroupConfigurationDialogChange(event: DialogState<GroupConfigurationResponse>): void {
    this.isGroupConfigurationDialogVisible = event.isOpen;
    switch (event.message) {
      case 'save':
        this.handleGroupConfigurationSaved(event.data!);
        break;
      case 'edit':
        this.handleGroupConfigurationUpdated(event.data!);
        break;
      case 'close':
        this.handleDialogClose();
        break;
    }
  }

  deleteGroupConfiguration(groupConfiguration: GroupConfigurationResponse): void {
    this.confirmationService.confirm({
      message: `¿Está seguro que quieres eliminar la configuración seleccionada?<br>
        <br><b>Tutor:</b> ${groupConfiguration.tutor.name} ${groupConfiguration.tutor.firstSurname}<br>
        <b>Campus:</b> ${groupConfiguration.campus.name}<br>
        <b>Modalidad:</b> ${groupConfiguration.modality.name}<br>
        <b>Especialidad:</b> ${groupConfiguration.specialty.name}<br>
        <b>Grado y grupo:</b> ${groupConfiguration.grade.name} - ${groupConfiguration.group.name}<br>
        <b>Generación:</b> ${new Date(groupConfiguration.generation.yearStart).toLocaleDateString('en-CA')} - ${new Date(groupConfiguration.generation.yearEnd).toLocaleDateString('en-CA')}`,
      header: 'Confirmar',
      closable: false,
      closeOnEscape: false,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Aceptar',
      },
      accept: () => {
        this.isLoading = true;
        this.groupConfigurationService.deleteGroupConfiguration(groupConfiguration.groupConfigurationId).subscribe({
          next: () => {
            this.showToast(
              'success',
              'Configuración eliminada',
              'La configuración de grupo ha sido eliminada correctamente'
            );
            this.totalRecords--;
            this.groupConfigurations = this.groupConfigurations.filter(
              (gc: GroupConfigurationResponse) => gc.groupConfigurationId !== groupConfiguration.groupConfigurationId
            );
            this.groupConfigurationCache.clear();
            this.isLoading = false;
          },
          error: (error: ApiError) => {
            if (error.statusCode === 404 && error.message.includes('group_configuration_not_found')) {
              this.showToast(
                'warn',
                'Configuración no encontrada',
                'La configuración que intentó eliminar ya no existe en el sistema'
              );
              this.refreshTableData();
              return;
            } else if (error.statusCode === 409 && error.message.includes('students_dependency')) {
              this.showToast(
                'error',
                'Error al eliminar configuración',
                'La configuración no puede ser eliminada porque tiene estudiantes asociados'
              );
            } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
              this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
            } else {
              this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
            }
            this.isLoading = false;
          },
        });
      },
      reject: () => {
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación de la configuración');
      },
    });
  }

  hasTextValue(value: string | null): boolean {
    return hasText(value);
  }

  getCurrentPageIndex(): number {
    return this.first / this.rows;
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

  private handleGroupConfigurationSaved(groupConfigurationData: GroupConfigurationResponse): void {
    this.showToast('success', 'Configuración guardada', 'La configuración de grupo ha sido guardada correctamente');
    this.totalRecords++;
    if (this.groupConfigurations.length < this.rows) {
      this.groupConfigurations = [...this.groupConfigurations, groupConfigurationData];
      this.groupConfigurationCache.set(this.getCurrentPageIndex(), this.groupConfigurations);
    } else {
      this.groupConfigurationCache.clear();
    }
  }

  private handleGroupConfigurationUpdated(groupConfigurationData: GroupConfigurationResponse): void {
    this.showToast(
      'success',
      'Configuración actualizada',
      'La configuración de grupo ha sido actualizada correctamente'
    );
    this.groupConfigurations = this.groupConfigurations.map((gc: GroupConfigurationResponse) =>
      gc.groupConfigurationId === groupConfigurationData.groupConfigurationId ? groupConfigurationData : gc
    );
    this.groupConfigurationCache.set(this.getCurrentPageIndex(), this.groupConfigurations);
  }

  private handleDialogClose(): void {
    this.showToast('error', 'Operación cancelada', 'Has cancelado la operación');
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
