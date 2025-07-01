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

import { TutorService } from '../../services/tutor.service';

import { ApiError } from '../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../core/models/ApiResponse.model';

import { DialogState } from '../../../../shared/types/dialog.types';
import { Column } from '../../../../shared/types/table.types';
import { TableUtils } from '../../../utils/table.utils';

import { TutorResponse } from '../../models/tutor.model';
import { TutorsFormComponent } from '../tutors-form/tutors-form.component';

@Component({
  selector: 'app-tutors-list',
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
    TutorsFormComponent,
  ],
  templateUrl: './tutors-list.component.html',
  styleUrl: './tutors-list.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class TutorsListComponent implements OnInit {
  private tutorService: TutorService = inject(TutorService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private tutorCache: Map<number, TutorResponse[]> = new Map<number, TutorResponse[]>();

  isLoading: boolean = true;
  isCreateTutor: boolean = true;
  isTutorDialogVisible: boolean = false;

  searchTutorValue: string = '';

  cols: Column[] = [
    { field: 'employeeCode', header: 'Número de Empleado', sortable: false },
    { field: 'name', header: 'Nombre', sortable: false },
    { field: 'firstSurname', header: 'Primer Apellido', sortable: false },
    { field: 'secondSurname', header: 'Segundo Apellido', sortable: false },
    { field: 'phoneNumber', header: 'Teléfono', sortable: false },
    { field: 'email', header: 'Correo Electrónico', sortable: false },
  ];
  tableUtils = TableUtils;

  tutors!: TutorResponse[];
  selectedTutor!: TutorResponse | null;

  rows: number = 20;
  first: number = 0;
  totalRecords: number = 0;

  ngOnInit(): void {}

  openCreateTutorDialog(): void {
    this.selectedTutor = null;
    this.isCreateTutor = true;
    this.isTutorDialogVisible = true;
  }

  openEditTutorDialog(tutor: TutorResponse): void {
    this.selectedTutor = tutor;
    this.isCreateTutor = false;
    this.isTutorDialogVisible = true;
  }

  refreshTableData(): void {
    this.first = 0;
    this.tutorCache.clear();
    this.loadTutors({ first: this.first, rows: this.rows });
  }

  loadTutors(event: TableLazyLoadEvent): void {
    this.isLoading = true;
    this.first = event.first ?? 0;
    const currentRows: number = event.rows ?? this.rows;
    if (this.rows !== currentRows) {
      this.rows = currentRows;
      this.tutorCache.clear();
    }

    const page = this.getCurrentPageIndex();
    if (this.tutorCache.has(page)) {
      this.tutors = this.tutorCache.get(page)!;
      this.isLoading = false;
      return;
    }

    this.tutorService.getAllTutors(page, this.rows).subscribe({
      next: (response: ApiResponse<TutorResponse[]>) => {
        this.tutors = response.data;
        this.totalRecords = response.pageInfo!.totalElements;
        this.tutorCache.set(page, this.tutors);
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

  deleteTutor(tutor: TutorResponse): void {
    this.confirmationService.confirm({
      message: `¿Está seguro que quiere eliminar el tutor seleccionado?<br>
        <br><b>Nombre:</b> ${tutor.name} ${tutor.firstSurname} ${tutor.secondSurname}
        <br><b>Correo:</b> ${tutor.email}`,
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
        this.tutorService.deleteTutor(tutor.tutorId).subscribe({
          next: () => {
            this.showToast('success', 'Tutor eliminado', 'El tutor ha sido eliminado correctamente');
            this.totalRecords--;
            this.tutors = this.tutors.filter((t: TutorResponse) => t.tutorId !== tutor.tutorId);
            this.tutorCache.clear();
            this.isLoading = false;
          },
          error: (error: ApiError) => {
            if (error.statusCode === 404 && error.message.includes('tutor_not_found')) {
              this.showToast('warn', 'Tutor no encontrado', 'El tutor que intentó eliminar ya no existe en el sistema');
              this.refreshTableData();
              return;
            } else if (error.statusCode === 409 && error.message.includes('group_configurations_dependency')) {
              this.showToast(
                'error',
                'Error al eliminar tutor',
                'El tutor no puede ser eliminado porque tiene configuraciones de grupos asociadas'
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
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación del tutor');
      },
    });
  }

  onTutorDialogChange(event: DialogState<TutorResponse>): void {
    this.isTutorDialogVisible = event.isOpen;
    switch (event.message) {
      case 'save':
        this.handleTutorSaved(event.data!);
        break;
      case 'edit':
        this.handleTutorUpdated(event.data!);
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

  private handleTutorSaved(tutorData: TutorResponse): void {
    this.showToast('success', 'Tutor guardado', 'El tutor ha sido guardado correctamente');
    this.totalRecords++;
    if (this.tutors.length < this.rows) {
      this.tutors = [...this.tutors, tutorData];
      this.tutorCache.set(this.getCurrentPageIndex(), this.tutors);
    } else {
      this.tutorCache.clear();
    }
  }

  private handleTutorUpdated(tutorData: TutorResponse): void {
    this.showToast('success', 'Tutor actualizado', 'El tutor ha sido actualizado correctamente');
    this.tutors = this.tutors.map((t: TutorResponse) => (t.tutorId === tutorData.tutorId ? tutorData : t));
    this.tutorCache.set(this.getCurrentPageIndex(), this.tutors);
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
