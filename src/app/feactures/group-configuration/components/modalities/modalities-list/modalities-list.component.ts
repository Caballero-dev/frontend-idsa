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

import { ModalityService } from '../../../services/modality.service';

import { ApiError } from '../../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../../core/models/ApiResponse.model';

import { DialogState } from '../../../../../shared/types/dialog.types';
import { Column } from '../../../../../shared/types/table.types';
import { TableUtils } from '../../../../utils/table.utils';

import { ModalityResponse } from '../../../models/modality.model';
import { ModalitiesFormComponent } from '../modalities-form/modalities-form.component';

@Component({
  selector: 'app-modalities-list',
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
    ModalitiesFormComponent,
  ],
  templateUrl: './modalities-list.component.html',
  styleUrl: './modalities-list.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class ModalitiesListComponent implements OnInit {
  private modalityService: ModalityService = inject(ModalityService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private modalityCache: Map<number, ModalityResponse[]> = new Map<number, ModalityResponse[]>();

  isLoading: boolean = true;
  isCreateModality: boolean = true;
  isModalityDialogVisible: boolean = false;

  searchModalityValue: string = '';

  cols: Column[] = [{ field: 'name', header: 'Nombre', sortable: false }];
  tableUtils = TableUtils;

  modalities!: ModalityResponse[];
  selectedModality!: ModalityResponse | null;

  rows: number = 20;
  first: number = 0;
  totalRecords: number = 0;

  ngOnInit(): void {}

  openCreateModalityDialog(): void {
    this.selectedModality = null;
    this.isCreateModality = true;
    this.isModalityDialogVisible = true;
  }

  openEditModalityDialog(modality: ModalityResponse): void {
    this.selectedModality = modality;
    this.isCreateModality = false;
    this.isModalityDialogVisible = true;
  }

  refreshTableData(): void {
    this.first = 0;
    this.modalityCache.clear();
    this.loadModalities({ first: this.first, rows: this.rows });
  }

  loadModalities(event: TableLazyLoadEvent): void {
    this.isLoading = true;
    this.first = event.first ?? 0;
    const currentRows: number = event.rows ?? this.rows;
    if (this.rows !== currentRows) {
      this.rows = currentRows;
      this.modalityCache.clear();
    }

    const page = this.getCurrentPageIndex();
    if (this.modalityCache.has(page)) {
      this.modalities = this.modalityCache.get(page)!;
      this.isLoading = false;
      return;
    }

    this.modalityService.getAllModalities(page, this.rows).subscribe({
      next: (response: ApiResponse<ModalityResponse[]>) => {
        this.modalities = response.data;
        this.totalRecords = response.pageInfo!.totalElements;
        this.modalityCache.set(page, this.modalities);
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

  deleteModality(modality: ModalityResponse): void {
    this.confirmationService.confirm({
      message: `¿Está seguro que quieres eliminar la modalidad seleccionada?<br>
        <br><b>Nombre:</b> ${modality.name}`,
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
        this.modalityService.deleteModality(modality.modalityId).subscribe({
          next: () => {
            this.showToast('success', 'Modalidad eliminada', 'La modalidad ha sido eliminada correctamente');
            this.totalRecords--;
            this.modalities = this.modalities.filter((m: ModalityResponse) => m.modalityId !== modality.modalityId);
            this.modalityCache.clear();
            this.isLoading = false;
          },
          error: (error: ApiError) => {
            if (error.statusCode === 404 && error.message.includes('modality_not_found')) {
              this.showToast(
                'warn',
                'Modalidad no encontrada',
                'La modalidad que intentó eliminar ya no existe en el sistema'
              );
              this.refreshTableData();
              return;
            } else if (error.statusCode === 409 && error.message.includes('group_configurations_dependency')) {
              this.showToast(
                'error',
                'Error al eliminar modalidad',
                'La modalidad no puede ser eliminada porque tiene configuraciones de grupos asociadas'
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
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación de la modalidad');
      },
    });
  }

  onModalityDialogChange(event: DialogState<ModalityResponse>): void {
    this.isModalityDialogVisible = event.isOpen;
    switch (event.message) {
      case 'save':
        this.handleModalitySaved(event.data!);
        break;
      case 'edit':
        this.handleModalityUpdated(event.data!);
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

  private handleModalitySaved(modalityData: ModalityResponse): void {
    this.showToast('success', 'Modalidad guardada', 'La modalidad ha sido guardada correctamente');
    this.totalRecords++;
    if (this.modalities.length < this.rows) {
      this.modalities = [...this.modalities, modalityData];
      this.modalityCache.set(this.getCurrentPageIndex(), this.modalities);
    } else {
      this.modalityCache.clear();
    }
  }

  private handleModalityUpdated(modalityData: ModalityResponse): void {
    this.showToast('success', 'Modalidad actualizada', 'La modalidad ha sido actualizada correctamente');
    this.modalities = this.modalities.map((m: ModalityResponse) =>
      m.modalityId === modalityData.modalityId ? modalityData : m
    );
    this.modalityCache.set(this.getCurrentPageIndex(), this.modalities);
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
