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

import { GradeService } from '../../../services/grade.service';

import { ApiError } from '../../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../../core/models/ApiResponse.model';

import { DialogState } from '../../../../../shared/types/dialog.types';
import { Column } from '../../../../../shared/types/table.types';
import { TableUtils } from '../../../../utils/table.utils';
import { hasText } from '../../../../../utils/string.utils';

import { GradeResponse } from '../../../models/grade.model';
import { GradesFormComponent } from '../grades-form/grades-form.component';

@Component({
  selector: 'app-grades-list',
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
    GradesFormComponent,
  ],
  templateUrl: './grades-list.component.html',
  styleUrl: './grades-list.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class GradesListComponent implements OnInit {
  private gradeService: GradeService = inject(GradeService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private gradeCache: Map<number, GradeResponse[]> = new Map<number, GradeResponse[]>();

  isLoading: boolean = true;
  isCreateGrade: boolean = true;
  isGradeDialogVisible: boolean = false;

  searchGradeValue: string | null = null;

  cols: Column[] = [{ field: 'name', header: 'Nombre', sortable: false }];
  tableUtils = TableUtils;

  grades!: GradeResponse[];
  selectedGrade!: GradeResponse | null;

  rows: number = 20;
  first: number = 0;
  totalRecords: number = 0;

  ngOnInit(): void {}

  loadGrades(event: TableLazyLoadEvent): void {
    this.isLoading = true;
    this.first = event.first ?? 0;
    const currentRows: number = event.rows ?? this.rows;
    if (this.rows !== currentRows) {
      this.rows = currentRows;
      this.gradeCache.clear();
    }

    const page: number = this.getCurrentPageIndex();
    if (this.gradeCache.has(page)) {
      this.grades = this.gradeCache.get(page)!;
      this.isLoading = false;
      return;
    }

    this.gradeService.getAllGrades(page, this.rows, this.searchGradeValue).subscribe({
      next: (response: ApiResponse<GradeResponse[]>) => {
        this.grades = response.data;
        this.totalRecords = response.pageInfo!.totalElements;
        this.gradeCache.set(page, this.grades);
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
    this.gradeCache.clear();
    this.loadGrades({ first: this.first, rows: this.rows });
  }

  search(): void {
    if (this.hasTextValue(this.searchGradeValue)) {
      this.first = 0;
      this.gradeCache.clear();
      this.loadGrades({ first: 0, rows: this.rows });
    }
  }

  resetSearch(): void {
    this.searchGradeValue = null;
    this.gradeCache.clear();
    this.loadGrades({ first: 0, rows: this.rows });
  }

  openCreateGradeDialog(): void {
    this.selectedGrade = null;
    this.isCreateGrade = true;
    this.isGradeDialogVisible = true;
  }

  openEditGradeDialog(grade: GradeResponse): void {
    this.selectedGrade = grade;
    this.isCreateGrade = false;
    this.isGradeDialogVisible = true;
  }

  onGradeDialogChange(event: DialogState<GradeResponse>): void {
    this.isGradeDialogVisible = event.isOpen;
    switch (event.message) {
      case 'save':
        this.handleGradeSaved(event.data!);
        break;
      case 'edit':
        this.handleGradeUpdated(event.data!);
        break;
      case 'close':
        this.handleDialogClose();
        break;
    }
  }

  deleteGrade(grade: GradeResponse): void {
    this.confirmationService.confirm({
      message: `¿Está seguro que quieres eliminar el grado seleccionado?<br>
        <br><b>Nombre:</b> ${grade.name}`,
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
        this.gradeService.deleteGrade(grade.gradeId).subscribe({
          next: () => {
            this.showToast('success', 'Grado eliminado', 'El grado ha sido eliminado correctamente');
            this.totalRecords--;
            this.grades = this.grades.filter((g: GradeResponse) => g.gradeId !== grade.gradeId);
            this.gradeCache.clear();
            this.isLoading = false;
          },
          error: (error: ApiError) => {
            if (error.statusCode === 404 && error.message.includes('grade_not_found')) {
              this.showToast('warn', 'Grado no encontrado', 'El grado que intentó eliminar ya no existe en el sistema');
              this.refreshTableData();
              return;
            } else if (error.statusCode === 409 && error.message.includes('group_configurations_dependency')) {
              this.showToast(
                'error',
                'Error al eliminar grado',
                'El grado no puede ser eliminado porque tiene configuraciones de grupos asociadas'
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
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación del grado');
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

  private handleGradeSaved(gradeData: GradeResponse): void {
    this.showToast('success', 'Grado guardado', 'El grado ha sido guardado correctamente');
    this.totalRecords++;
    if (this.grades.length < this.rows) {
      this.grades = [...this.grades, gradeData];
      this.gradeCache.set(this.getCurrentPageIndex(), this.grades);
    } else {
      this.gradeCache.clear();
    }
  }

  private handleGradeUpdated(gradeData: GradeResponse): void {
    this.showToast('success', 'Grado actualizado', 'El grado ha sido actualizado correctamente');
    this.grades = this.grades.map((g: GradeResponse) => (g.gradeId === gradeData.gradeId ? gradeData : g));
    this.gradeCache.set(this.getCurrentPageIndex(), this.grades);
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
