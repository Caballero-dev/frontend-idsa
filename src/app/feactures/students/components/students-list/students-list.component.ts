import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

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

import { StudentService } from '../../services/student.service';

import { ApiError } from '../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../core/models/ApiResponse.model';

import { DialogState } from '../../../../shared/types/dialog.types';
import { Column } from '../../../../shared/types/table.types';
import { TableUtils } from '../../../utils/table.utils';

import { StudentResponse } from '../../models/student.model';
import { StudentsFormComponent } from '../students-form/students-form.component';

@Component({
  selector: 'app-students-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    InputGroupModule,
    InputTextModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    TooltipModule,
    StudentsFormComponent,
  ],
  templateUrl: './students-list.component.html',
  styleUrl: './students-list.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class StudentsListComponent implements OnInit {
  private studentService: StudentService = inject(StudentService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private studentCache: Map<number, StudentResponse[]> = new Map<number, StudentResponse[]>();

  isLoading: boolean = true;
  isCreateStudent: boolean = true;
  isStudentDialogVisible: boolean = false;

  searchStudentValue: string = '';

  cols: Column[] = [
    { field: 'studentCode', header: 'Matrícula', sortable: true },
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'firstSurname', header: 'Apellido Paterno', sortable: true },
    { field: 'secondSurname', header: 'Apellido Materno', sortable: true },
    { field: 'phoneNumber', header: 'Teléfono', sortable: true },
    { field: 'predictionResult', header: 'Prob. consumo', sortable: true },
  ];
  tableUtils = TableUtils;

  students!: StudentResponse[];
  selectedStudent!: StudentResponse | null;

  rows: number = 20;
  first: number = 0;
  totalRecords: number = 0;
  groupId: number | null = null;

  ngOnInit(): void {
    this.getGroupIdFromRoute();
  }

  getGroupIdFromRoute(): void {
    const groupIdParam: string | null = this.activeRoute.snapshot.paramMap.get('grupoId');
    const groupId: number | null = groupIdParam ? Number(groupIdParam) : null;
    if (groupId && !isNaN(groupId) && groupId > 0) {
      this.groupId = groupId;
    } else {
      this.router.navigate(['/panel/alumnos']);
    }
  }

  openCreateStudentDialog(): void {
    this.selectedStudent = null;
    this.isCreateStudent = true;
    this.isStudentDialogVisible = true;
  }

  openEditStudentDialog(student: StudentResponse): void {
    this.selectedStudent = student;
    this.isCreateStudent = false;
    this.isStudentDialogVisible = true;
  }

  refreshTableData(): void {
    this.first = 0;
    this.studentCache.clear();
    this.loadStudents({ first: this.first, rows: this.rows });
  }

  loadStudents(event: TableLazyLoadEvent): void {
    if (!this.groupId) return;

    this.isLoading = true;
    this.first = event.first ?? 0;
    const currentRows: number = event.rows ?? this.rows;
    if (this.rows !== currentRows) {
      this.rows = currentRows;
      this.studentCache.clear();
    }

    const page = this.getCurrentPageIndex();
    if (this.studentCache.has(page)) {
      this.students = this.studentCache.get(page)!;
      this.isLoading = false;
      return;
    }

    this.studentService.getStudentsByGroup(this.groupId, page, this.rows).subscribe({
      next: (response: ApiResponse<StudentResponse[]>) => {
        this.students = response.data;
        this.totalRecords = response.pageInfo!.totalElements;
        this.studentCache.set(page, this.students);
        this.isLoading = false;
      },
      error: (error: ApiError) => {
        if (error.statusCode === 404 && error.message.includes('group_configuration_not_found')) {
          this.router.navigate(['/panel/alumnos']);
          return;
        }
        if (error.status === 'Unknown Error' && error.statusCode === 0) {
          this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
        } else {
          this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
        }
        this.isLoading = false;
      },
    });
  }

  deleteStudent(student: StudentResponse): void {
    this.confirmationService.confirm({
      message: `¿Está seguro que quieres eliminar el estudiante seleccionado?<br>
        <br><b>Nombre:</b> ${student.name} ${student.firstSurname} ${student.secondSurname}
        <br><b>Matrícula:</b> ${student.studentCode}`,
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
        this.studentService.deleteStudent(student.studentId).subscribe({
          next: () => {
            this.showToast('success', 'Estudiante eliminado', 'El estudiante ha sido eliminado correctamente');
            this.totalRecords--;
            this.students = this.students.filter((s: StudentResponse) => s.studentId !== student.studentId);
            this.studentCache.clear();
            this.isLoading = false;
          },
          error: (error: ApiError) => {
            if (error.statusCode === 404 && error.message.includes('student_not_found')) {
              this.showToast(
                'warn',
                'Estudiante no encontrado',
                'El estudiante que intentó eliminar ya no existe en el sistema'
              );
              this.refreshTableData();
              return;
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
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación del estudiante');
      },
    });
  }

  onStudentDialogChange(event: DialogState<StudentResponse>): void {
    this.isStudentDialogVisible = event.isOpen;
    switch (event.message) {
      case 'save':
        this.handleStudentSaved(event.data!);
        break;
      case 'edit':
        this.handleStudentUpdated(event.data!);
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

  private handleStudentSaved(studentData: StudentResponse): void {
    this.showToast('success', 'Estudiante guardado', 'El estudiante ha sido guardado correctamente');
    this.totalRecords++;
    if (this.students.length < this.rows) {
      this.students = [...this.students, studentData];
      this.studentCache.set(this.getCurrentPageIndex(), this.students);
    } else {
      this.studentCache.clear();
    }
  }

  private handleStudentUpdated(studentData: StudentResponse): void {
    this.showToast('success', 'Estudiante actualizado', 'El estudiante ha sido actualizado correctamente');
    this.students = this.students.map((s: StudentResponse) =>
      s.studentId === studentData.studentId ? studentData : s
    );
    this.studentCache.set(this.getCurrentPageIndex(), this.students);
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
