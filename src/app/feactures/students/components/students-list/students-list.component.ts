import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { StudentsFormComponent } from '../students-form/students-form.component';
import { Column, TableUtils } from '../../../utils/table.utils';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InputGroupModule } from 'primeng/inputgroup';
import { FormsModule } from '@angular/forms';
import { StudentsTestService } from '../../tests/students-test.service';
import { EmitterDialogStudent, Student } from '../../models/student.model';

@Component({
  selector: 'app-students-list',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    InputGroupModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    FormsModule,
    RouterLink,
    StudentsFormComponent,
  ],
  templateUrl: './students-list.component.html',
  styleUrl: './students-list.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class StudentsListComponent implements OnInit {
  searchStudentValue: string = '';
  isLoading: boolean = true;
  cols: Column[] = [
    { field: 'studentCode', header: 'Matricula', sortable: true },
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'firstSurname', header: 'Apellido Paterno', sortable: true },
    { field: 'secondSurname', header: 'Apellido Materno', sortable: true },
    { field: 'phoneNumber', header: 'Telefono', sortable: true },
    { field: 'email', header: 'Correo', sortable: true },
    { field: 'predictionResult', header: 'Prob. consumo', sortable: true },
  ];
  students!: Student[];
  selectedStudents!: Student[] | null;
  isCreateStudent: boolean = true;
  selectedStudent!: Student | null;
  studentDialogVisible: boolean = false;
  idGroupConfiguration: string | null = null;

  tableUtils = TableUtils;
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private studentTestService = inject(StudentsTestService);

  ngOnInit(): void {
    this.idGroupConfiguration = this.activeRoute.snapshot.paramMap.get('grupoId');
    this.loadStudentData();
  }

  loadStudentData(): void {
    this.students = this.studentTestService.getData();
    this.isLoading = false;
  }

  createStudent() {
    this.isCreateStudent = true;
    this.selectedStudent = null;
    this.studentDialogVisible = true;
  }

  editStudent(student: Student) {
    this.isCreateStudent = false;
    this.selectedStudent = student;
    this.studentDialogVisible = true;
  }

  deleteStudent(student: Student) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar el estudiante seleccionado?<br>
        <br><b>Nombre:</b> ${student.name} ${student.firstSurname} ${student.secondSurname}
        <br><b>Correo:</b> ${student.email}`,
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
        this.showToast('success', 'Estudiante eliminado', 'El estudiante ha sido eliminado correctamente');
        this.students = this.students.filter((st: Student) => st.studentId !== student.studentId);
        this.selectedStudents = null;
      },
      reject: () => {
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación del estudiante');
      },
    });
  }

  deleteSelectedStudents(): void {
    this.confirmationService.confirm({
      header: 'Confirmar',
      message: `¿Estás seguro de que quieres eliminar los estudiantes seleccionados?
        <br><br>${this.selectedStudents?.length} estudiantes serán eliminados.
        <br><br>Correos:<br>- ${this.selectedStudents?.map((student) => student.email).join('<br>- ')}`,
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
        this.showToast('success', 'Estudiantes eliminados', 'Los estudiantes han sido eliminados correctamente');
        this.students = this.students.filter((st: Student) => !this.selectedStudents?.includes(st));
        this.selectedStudents = null;
      },
      reject: () => {
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación de los estudiantes');
      },
    });
  }

  changeStudentDialog(event: EmitterDialogStudent) {
    this.studentDialogVisible = event.isOpen;
    if (event.message === 'save') {
      this.showToast('success', 'Estudiante guardado', 'El estudiante ha sido guardado correctamente');
      if (event.student) this.students = [...this.students, event.student];
    } else if (event.message === 'edit') {
      this.showToast('success', 'Estudiante editado', 'El estudiante ha sido editado correctamente');
      if (event.student !== null) {
        this.students = this.students.map((st: Student) =>
          st.studentId === event.student?.studentId ? event.student : st
        );
      }
    } else if (event.message === 'close') {
      this.showToast('error', 'Operación cancelada', 'Has cancelado la operación');
    }
  }

  showToast(severity: 'success' | 'error' | 'info', summary: string, detail: string): void {
    this.messageService.add({
      severity,
      icon:
        severity === 'success'
          ? 'pi pi-check-circle'
          : severity === 'error'
            ? 'pi pi-times-circle'
            : 'pi pi-info-circle',
      summary,
      detail,
      life: 3000,
    });
  }
}
