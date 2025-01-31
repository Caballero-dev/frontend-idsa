import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
  sortable: boolean;
}

interface Student {
  studentId: string;
  name: string;
  lastName: string;
  secondLastName: string;
  consumptionState: string;
}

@Component({
  selector: 'app-students-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    DialogModule,
    TagModule,
    ConfirmDialogModule,
  ],
  templateUrl: './students-list.component.html',
  styleUrl: './students-list.component.css',
  providers: [ConfirmationService, MessageService],
})
export class StudentsListComponent implements OnInit {
  student!: Student;
  cols!: Column[];
  students!: Student[];
  selectedStudents!: Student[] | null;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.students = [
      {
        studentId: 'A01234568',
        name: 'Juan',
        lastName: 'Perez',
        secondLastName: 'Gonzalez',
        consumptionState: 'No consumidor',
      },
      {
        studentId: 'A01234569',
        name: 'Maria',
        lastName: 'Garcia',
        secondLastName: 'Lopez',
        consumptionState: 'Probable consumidor',
      },
      {
        studentId: 'A01234570',
        name: 'Pedro',
        lastName: 'Gomez',
        secondLastName: 'Hernandez',
        consumptionState: 'Consumidor',
      },
      {
        studentId: 'A01234571',
        name: 'Ana',
        lastName: 'Martinez',
        secondLastName: 'Jimenez',
        consumptionState: 'No consumidor',
      },
      {
        studentId: 'A01234572',
        name: 'Carlos',
        lastName: 'Rodriguez',
        secondLastName: 'Perez',
        consumptionState: 'Consumidor',
      },
    ];

    this.cols = [
      { field: 'studentId', header: 'Matricula', sortable: true },
      { field: 'name', header: 'Nombre', sortable: true },
      { field: 'lastName', header: 'Apellido Paterno', sortable: true },
      { field: 'secondLastName', header: 'Apellido Materno', sortable: true },
      { field: 'consumptionState', header: 'Estado de consumo', sortable: true },
    ];
  }

  openNew() {}

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  editStudent(student: Student) {
    console.log('Edit student', student);
  }

  deleteStudent(student: Student) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar ' + student.name + '?',
      header: 'Confirmar',
      closable: true,
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
        this.students = this.students.filter((val) => val.studentId !== student.studentId);
        this.student = {
          studentId: '',
          name: '',
          lastName: '',
          secondLastName: '',
          consumptionState: '',
        };

        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Estudiante eliminado',
          life: 3000,
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rechazado',
          detail: 'Has rechazado la eliminación del estudiante',
          life: 3000,
        });
      },
    });
  }

  deleteSelectedStudents() {
    console.log('Delete selected students', this.selectedStudents);
  }

  getSeverity(status: string) {
    switch (status) {
      case 'No consumidor':
        return 'success';
      case 'Probable consumidor':
        return 'warn';
      case 'Consumidor':
        return 'danger';
      default:
        return 'info';
    }
  }
}
