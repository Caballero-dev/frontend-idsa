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

import { GenerationService } from '../../../services/generation.service';

import { ApiError } from '../../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../../core/models/ApiResponse.model';

import { DialogState } from '../../../../../shared/types/dialog.types';
import { Column } from '../../../../../shared/types/table.types';
import { TableUtils } from '../../../../utils/table.utils';

import { GenerationResponse } from '../../../models/generation.model';
import { GenerationsFormComponent } from '../generations-form/generations-form.component';

@Component({
  selector: 'app-generations-list',
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
    GenerationsFormComponent,
  ],
  templateUrl: './generations-list.component.html',
  styleUrl: './generations-list.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class GenerationsListComponent implements OnInit {
  private generationService: GenerationService = inject(GenerationService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private generationCache: Map<number, GenerationResponse[]> = new Map<number, GenerationResponse[]>();

  isLoading: boolean = true;
  isCreateGeneration: boolean = true;
  isGenerationDialogVisible: boolean = false;

  searchGenerationValue: string = '';

  cols: Column[] = [
    { field: 'yearStart', header: 'Año de inicio', sortable: true },
    { field: 'yearEnd', header: 'Año de fin', sortable: true },
  ];
  tableUtils = TableUtils;

  generations!: GenerationResponse[];
  selectedGeneration!: GenerationResponse | null;

  rows: number = 20;
  first: number = 0;
  totalRecords: number = 0;

  ngOnInit(): void {}

  openCreateGenerationDialog(): void {
    this.selectedGeneration = null;
    this.isCreateGeneration = true;
    this.isGenerationDialogVisible = true;
  }

  openEditGenerationDialog(generation: GenerationResponse): void {
    this.selectedGeneration = generation;
    this.isCreateGeneration = false;
    this.isGenerationDialogVisible = true;
  }

  refreshTableData(): void {
    this.first = 0;
    this.generationCache.clear();
    this.loadGenerations({ first: this.first, rows: this.rows });
  }

  loadGenerations(event: TableLazyLoadEvent): void {
    this.isLoading = true;
    this.first = event.first ?? 0;
    const currentRows: number = event.rows ?? this.rows;
    if (this.rows !== currentRows) {
      this.rows = currentRows;
      this.generationCache.clear();
    }

    const page = this.getCurrentPageIndex();
    if (this.generationCache.has(page)) {
      this.generations = this.generationCache.get(page)!;
      this.isLoading = false;
      return;
    }

    this.generationService.getAllGenerations(page, this.rows).subscribe({
      next: (response: ApiResponse<GenerationResponse[]>) => {
        this.generations = response.data;
        this.totalRecords = response.pageInfo!.totalElements;
        this.generationCache.set(page, this.generations);
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

  deleteGeneration(generation: GenerationResponse): void {
    this.confirmationService.confirm({
      message: `¿Está seguro que quieres eliminar la generación seleccionada?<br>
        <br><b>Año de inicio:</b> ${new Date(generation.yearStart).toLocaleDateString('en-CA')}<br><b>Año de fin:</b> ${new Date(generation.yearEnd).toLocaleDateString('en-CA')}`,
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
        this.generationService.deleteGeneration(generation.generationId).subscribe({
          next: () => {
            this.showToast('success', 'Generación eliminada', 'La generación ha sido eliminada correctamente');
            this.totalRecords--;
            this.generations = this.generations.filter(
              (g: GenerationResponse) => g.generationId !== generation.generationId
            );
            this.generationCache.clear();
            this.isLoading = false;
          },
          error: (error: ApiError) => {
            if (error.statusCode === 404 && error.message.includes('generation_not_found')) {
              this.showToast(
                'warn',
                'Generación no encontrada',
                'La generación que intentó eliminar ya no existe en el sistema'
              );
              this.refreshTableData();
              return;
            } else if (error.statusCode === 409 && error.message.includes('group_configurations_dependency')) {
              this.showToast(
                'error',
                'Error al eliminar generación',
                'La generación no puede ser eliminada porque tiene configuraciones de grupos asociadas'
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
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación de la generación');
      },
    });
  }

  onGenerationDialogChange(event: DialogState<GenerationResponse>): void {
    this.isGenerationDialogVisible = event.isOpen;
    switch (event.message) {
      case 'save':
        this.handleGenerationSaved(event.data!);
        break;
      case 'edit':
        this.handleGenerationUpdated(event.data!);
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

  private handleGenerationSaved(generationData: GenerationResponse): void {
    this.showToast('success', 'Generación guardada', 'La generación ha sido guardada correctamente');
    this.totalRecords++;
    if (this.generations.length < this.rows) {
      this.generations = [...this.generations, generationData];
      this.generationCache.set(this.getCurrentPageIndex(), this.generations);
    } else {
      this.generationCache.clear();
    }
  }

  private handleGenerationUpdated(generationData: GenerationResponse): void {
    this.showToast('success', 'Generación actualizada', 'La generación ha sido actualizada correctamente');
    this.generations = this.generations.map((g: GenerationResponse) =>
      g.generationId === generationData.generationId ? generationData : g
    );
    this.generationCache.set(this.getCurrentPageIndex(), this.generations);
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
