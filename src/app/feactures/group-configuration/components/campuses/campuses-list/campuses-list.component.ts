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

import { CampusService } from '../../../services/campus.service';

import { ApiError } from '../../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../../core/models/ApiResponse.model';

import { DialogState } from '../../../../../shared/types/dialog.types';
import { Column } from '../../../../../shared/types/table.types';
import { TableUtils } from '../../../../utils/table.utils';

import { CampusResponse } from '../../../models/campus.model';
import { CampusesFormComponent } from '../campuses-form/campuses-form.component';

@Component({
  selector: 'app-campuses-list',
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
    CampusesFormComponent,
  ],
  templateUrl: './campuses-list.component.html',
  styleUrl: './campuses-list.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class CampusesListComponent implements OnInit {
  private campusService: CampusService = inject(CampusService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private campusCache: Map<number, CampusResponse[]> = new Map<number, CampusResponse[]>();

  isLoading: boolean = true;
  isCreateCampus: boolean = true;
  isCampusDialogVisible: boolean = false;

  searchCampusValue: string = '';

  cols: Column[] = [{ field: 'name', header: 'Nombre', sortable: false }];
  tableUtils = TableUtils;

  campuses!: CampusResponse[];
  selectedCampus!: CampusResponse | null;

  rows: number = 20;
  first: number = 0;
  totalRecords: number = 0;

  ngOnInit(): void {}

  openCreateCampusDialog(): void {
    this.selectedCampus = null;
    this.isCreateCampus = true;
    this.isCampusDialogVisible = true;
  }

  openEditCampusDialog(campus: CampusResponse): void {
    this.selectedCampus = campus;
    this.isCreateCampus = false;
    this.isCampusDialogVisible = true;
  }

  refreshTableData(): void {
    this.first = 0;
    this.campusCache.clear();
    this.loadCampuses({ first: this.first, rows: this.rows });
  }

  loadCampuses(event: TableLazyLoadEvent): void {
    this.isLoading = true;
    this.first = event.first ?? 0;
    const currentRows: number = event.rows ?? this.rows;
    if (this.rows !== currentRows) {
      this.rows = currentRows;
      this.campusCache.clear();
    }

    const page = this.getCurrentPageIndex();
    if (this.campusCache.has(page)) {
      this.campuses = this.campusCache.get(page)!;
      this.isLoading = false;
      return;
    }

    this.campusService.getAllCampuses(page, this.rows).subscribe({
      next: (response: ApiResponse<CampusResponse[]>) => {
        this.campuses = response.data;
        this.totalRecords = response.pageInfo!.totalElements;
        this.campusCache.set(page, this.campuses);
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

  deleteCampus(campus: CampusResponse): void {
    this.confirmationService.confirm({
      message: `¿Está seguro que quieres eliminar el campus seleccionado?<br>
        <br><b>Nombre:</b> ${campus.name}`,
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
        this.campusService.deleteCampus(campus.campusId).subscribe({
          next: () => {
            this.showToast('success', 'Campus eliminado', 'El campus ha sido eliminado correctamente');
            this.totalRecords--;
            this.campuses = this.campuses.filter((c: CampusResponse) => c.campusId !== campus.campusId);
            this.campusCache.clear();
            this.isLoading = false;
          },
          error: (error: ApiError) => {
            if (error.statusCode === 404 && error.message.includes('campus_not_found')) {
              this.showToast(
                'warn',
                'Campus no encontrado',
                'El campus que intentó eliminar ya no existe en el sistema'
              );
              this.refreshTableData();
              return;
            } else if (error.statusCode === 409 && error.message.includes('group_configurations_dependency')) {
              this.showToast(
                'error',
                'Error al eliminar campus',
                'El campus no puede ser eliminado porque tiene configuraciones de grupos asociadas'
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
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación del campus');
      },
    });
  }

  onCampusDialogChange(event: DialogState<CampusResponse>): void {
    this.isCampusDialogVisible = event.isOpen;
    switch (event.message) {
      case 'save':
        this.handleCampusSaved(event.data!);
        break;
      case 'edit':
        this.handleCampusUpdated(event.data!);
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

  private handleCampusSaved(campusData: CampusResponse): void {
    this.showToast('success', 'Campus guardado', 'El campus ha sido guardado correctamente');
    this.totalRecords++;
    if (this.campuses.length < this.rows) {
      this.campuses = [...this.campuses, campusData];
      this.campusCache.set(this.getCurrentPageIndex(), this.campuses);
    } else {
      this.campusCache.clear();
    }
  }

  private handleCampusUpdated(campusData: CampusResponse): void {
    this.showToast('success', 'Campus actualizado', 'El campus ha sido actualizado correctamente');
    this.campuses = this.campuses.map((c: CampusResponse) => (c.campusId === campusData.campusId ? campusData : c));
    this.campusCache.set(this.getCurrentPageIndex(), this.campuses);
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
