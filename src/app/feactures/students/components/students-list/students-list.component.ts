import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { StudentsFormComponent } from '../students-form/students-form.component';
import { Column, getGlobalFilterFields, onGlobalFilter } from '../../../shared/interfaces/table.interface';

interface Student {
  studentId: string;
  name: string;
  paternalSurname: string;
  maternalSurname: string;
  phoneNumber: string;
  email: string;
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
    StudentsFormComponent,
  ],
  templateUrl: './students-list.component.html',
  styleUrl: './students-list.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class StudentsListComponent implements OnInit {
  student!: Student;
  cols: Column[] = [
    { field: 'studentId', header: 'Matricula', sortable: true },
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'paternalSurname', header: 'Apellido Paterno', sortable: true },
    { field: 'maternalSurname', header: 'Apellido Materno', sortable: true },
    { field: 'phoneNumber', header: 'Telefono', sortable: true },
    { field: 'email', header: 'Correo', sortable: true },
    { field: 'consumptionState', header: 'Estado de consumo', sortable: true },
  ];
  students!: Student[];
  selectedStudents!: Student[] | null;
  studentDialogVisible: boolean = false;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.students = [
      {
        studentId: 'A01234568',
        name: 'Juan',
        paternalSurname: 'Perez',
        maternalSurname: 'Gonzalez',
        phoneNumber: '1234567890',
        email: 'juan@gmail.com',
        consumptionState: 'No consumidor',
      },
      {
        studentId: 'A01234569',
        name: 'Maria',
        paternalSurname: 'Garcia',
        maternalSurname: 'Lopez',
        phoneNumber: '0987654321',
        email: 'mr@gmail.com',
        consumptionState: 'Probable consumidor',
      },
      {
        studentId: 'A01234570',
        name: 'Pedro',
        paternalSurname: 'Gomez',
        maternalSurname: 'Hernandez',
        phoneNumber: '0987688321',
        email: 'gh@gmail.com',
        consumptionState: 'Consumidor',
      },
      {
        studentId: 'A01234571',
        name: 'Ana',
        paternalSurname: 'Martinez',
        maternalSurname: 'Jimenez',
        phoneNumber: '0987677321',
        email: 'am@gmail.com',
        consumptionState: 'No consumidor',
      },
      {
        studentId: 'A01234572',
        name: 'Carlos',
        paternalSurname: 'Rodriguez',
        maternalSurname: 'Perez',
        phoneNumber: '0987657721',
        email: 'rp@gmail.com',
        consumptionState: 'Consumidor',
      },
    ];
  }

  createStudent() {
    this.studentDialogVisible = true;
  }

  editStudent(student: Student) {
    console.log('Edit student', student);
  }

  deleteStudent(student: Student) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar ' + student.name + '?',
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
        this.students = this.students.filter((val) => val.studentId !== student.studentId);
        this.student = {
          studentId: '',
          name: '',
          paternalSurname: '',
          maternalSurname: '',
          phoneNumber: '',
          email: '',
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

  changeStudentDialog(event: { isOpen: boolean; message: string }) {
    this.studentDialogVisible = event.isOpen;
    if (event.message === 'save') {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Estudiante guardado',
        life: 3000,
      });
    } else if (event.message === 'close') {
      this.messageService.add({
        severity: 'error',
        summary: 'Cancelado',
        detail: 'Has cancelado la operación',
        life: 3000,
      });
    }
  }

  getGlobalFilterFields() {
    return getGlobalFilterFields(this.cols);
  }

  onGlobalFilter(table: Table, event: Event) {
    return onGlobalFilter(table, event);
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
