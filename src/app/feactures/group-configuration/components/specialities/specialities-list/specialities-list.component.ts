import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

import { SpecialtyService } from '../../../services/specialty.service';

import { ApiError } from '../../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../../core/models/ApiResponse.model';

import { DialogState } from '../../../../../shared/types/dialog.types';
import { Column } from '../../../../../shared/types/table.types';
import { TableUtils } from '../../../../utils/table.utils';

import { SpecialtyResponse } from '../../../models/specialty.model';
import { SpecialitiesFormComponent } from '../specialities-form/specialities-form.component';

@Component({
  selector: 'app-specialities-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    InputGroupModule,
    InputTextModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    TooltipModule,
    SpecialitiesFormComponent,
  ],
  templateUrl: './specialities-list.component.html',
  styleUrl: './specialities-list.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class SpecialitiesListComponent implements OnInit {
  private specialtyService: SpecialtyService = inject(SpecialtyService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private specialtyCache: Map<number, SpecialtyResponse[]> = new Map<number, SpecialtyResponse[]>();

  isLoading: boolean = true;
  isCreateSpecialty: boolean = true;
  isSpecialtyDialogVisible: boolean = false;

  searchSpecialtyValue: string = '';

  cols: Column[] = [
    { field: 'name', header: 'Nombre', sortable: false },
    { field: 'shortName', header: 'Nombre corto', sortable: false },
  ];
  tableUtils = TableUtils;

  specialties!: SpecialtyResponse[];
  selectedSpecialty!: SpecialtyResponse | null;

  rows: number = 20;
  first: number = 0;
  totalRecords: number = 0;

  ngOnInit(): void {}

  openCreateSpecialtyDialog(): void {
    this.selectedSpecialty = null;
    this.isCreateSpecialty = true;
    this.isSpecialtyDialogVisible = true;
  }

  openEditSpecialtyDialog(specialty: SpecialtyResponse): void {
    this.selectedSpecialty = specialty;
    this.isCreateSpecialty = false;
    this.isSpecialtyDialogVisible = true;
  }

  refreshTableData(): void {
    this.first = 0;
    this.specialtyCache.clear();
    this.loadSpecialties({ first: this.first, rows: this.rows });
  }

  loadSpecialties(event: TableLazyLoadEvent): void {
    this.isLoading = true;
    this.first = event.first ?? 0;
    const currentRows: number = event.rows ?? this.rows;
    if (this.rows !== currentRows) {
      this.rows = currentRows;
      this.specialtyCache.clear();
    }

    const page = this.getCurrentPageIndex();
    if (this.specialtyCache.has(page)) {
      this.specialties = this.specialtyCache.get(page)!;
      this.isLoading = false;
      return;
    }

    this.specialtyService.getAllSpecialties(page, this.rows).subscribe({
      next: (response: ApiResponse<SpecialtyResponse[]>) => {
        this.specialties = response.data;
        this.totalRecords = response.pageInfo!.totalElements;
        this.specialtyCache.set(page, this.specialties);
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

  deleteSpecialty(specialty: SpecialtyResponse): void {
    this.confirmationService.confirm({
      message: `¿Está seguro que quieres eliminar la especialidad seleccionada?<br>
        <br><b>Nombre:</b> ${specialty.name}<br><b>Nombre corto:</b> ${specialty.shortName}`,
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
        this.specialtyService.deleteSpecialty(specialty.specialtyId).subscribe({
          next: () => {
            this.showToast('success', 'Especialidad eliminada', 'La especialidad ha sido eliminada correctamente');
            this.totalRecords--;
            this.specialties = this.specialties.filter(
              (s: SpecialtyResponse) => s.specialtyId !== specialty.specialtyId
            );
            this.specialtyCache.clear();
            this.isLoading = false;
          },
          error: (error: ApiError) => {
            if (error.statusCode === 404 && error.message.includes('specialty_not_found')) {
              this.showToast(
                'warn',
                'Especialidad no encontrada',
                'La especialidad que intentó eliminar ya no existe en el sistema'
              );
              this.refreshTableData();
              return;
            } else if (error.statusCode === 409 && error.message.includes('group_configurations_dependency')) {
              this.showToast(
                'error',
                'Error al eliminar especialidad',
                'La especialidad no puede ser eliminada porque tiene configuraciones de grupos asociadas'
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
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación de la especialidad');
      },
    });
  }

  onSpecialtyDialogChange(event: DialogState<SpecialtyResponse>): void {
    this.isSpecialtyDialogVisible = event.isOpen;
    switch (event.message) {
      case 'save':
        this.handleSpecialtySaved(event.data!);
        break;
      case 'edit':
        this.handleSpecialtyUpdated(event.data!);
        break;
      case 'close':
        this.handleDialogClose();
        break;
    }
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

  private handleSpecialtySaved(specialtyData: SpecialtyResponse): void {
    this.showToast('success', 'Especialidad guardada', 'La especialidad ha sido guardada correctamente');
    this.totalRecords++;
    if (this.specialties.length < this.rows) {
      this.specialties = [...this.specialties, specialtyData];
      this.specialtyCache.set(this.getCurrentPageIndex(), this.specialties);
    } else {
      this.specialtyCache.clear();
    }
  }

  private handleSpecialtyUpdated(specialtyData: SpecialtyResponse): void {
    this.showToast('success', 'Especialidad actualizada', 'La especialidad ha sido actualizada correctamente');
    this.specialties = this.specialties.map((s: SpecialtyResponse) =>
      s.specialtyId === specialtyData.specialtyId ? specialtyData : s
    );
    this.specialtyCache.set(this.getCurrentPageIndex(), this.specialties);
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
