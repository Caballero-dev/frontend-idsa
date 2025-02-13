import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Column, getGlobalFilterFields, onGlobalFilter } from '../../../shared/interfaces/table.interface';
import { TutorsFormComponent } from '../tutors-form/tutors-form.component';

interface Tutor {
  tutorId: string;
  employeeNumber: string;
  name: string;
  paternalSurname: string;
  maternalSurname: string;
  phoneNumber: string;
  email: string;
}

@Component({
  selector: 'app-tutors-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, ToastModule, ToolbarModule, InputTextModule, InputIconModule, IconFieldModule, DialogModule, ConfirmDialogModule, TutorsFormComponent],
  templateUrl: './tutors-list.component.html',
  styleUrl: './tutors-list.component.css',
  providers: [ConfirmationService, MessageService],
})
export class TutorsListComponent implements OnInit {
  tutor!: Tutor[];
  cols: Column[] = [
    { field: 'employeeNumber', header: 'Numero de empleado', sortable: true },
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'paternalSurname', header: 'Apellido Paterno', sortable: true },
    { field: 'maternalSurname', header: 'Apellido Materno', sortable: true },
    { field: 'phoneNumber', header: 'Telefono', sortable: true },
    { field: 'email', header: 'Correo', sortable: true },
  ];
  tutors!: Tutor[];
  selectedTutors!: Tutor[] | null;
  tutorDialogVisible: boolean = false;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.tutors = [
      {
        tutorId: '1',
        employeeNumber: '123456',
        name: 'Juan',
        paternalSurname: 'Perez',
        maternalSurname: 'Gomez',
        phoneNumber: '1234567890',
        email: 'jaun@gmail.com',
      },
      {
        tutorId: '2',
        employeeNumber: '123457',
        name: 'Pedro',
        paternalSurname: 'Gomez',
        maternalSurname: 'Perez',
        phoneNumber: '1234567890',
        email: 'pedro@gmail.com0',
      },
      {
        tutorId: '3',
        employeeNumber: '123458',
        name: 'Maria',
        paternalSurname: 'Lopez',
        maternalSurname: 'Martinez',
        phoneNumber: '0987654321',
        email: 'maria@gmail.com',
      },
      {
        tutorId: '4',
        employeeNumber: '123459',
        name: 'Luis',
        paternalSurname: 'Hernandez',
        maternalSurname: 'Rodriguez',
        phoneNumber: '1122334455',
        email: 'luis@gmail.com',
      },
      {
        tutorId: '5',
        employeeNumber: '123460',
        name: 'Ana',
        paternalSurname: 'Garcia',
        maternalSurname: 'Fernandez',
        phoneNumber: '6677889900',
        email: 'ana@gmail.com',
      },
    ];
  }

  createTutor() {
    this.tutorDialogVisible = true;
  }

  editTutor(tutor: Tutor) {
    this.tutorDialogVisible = true;
  }

  deleteTutor(tutor: Tutor) {
    this.confirmationService.confirm({
      message: '¿Estas seguro de que deseas eliminar ' + tutor.name + '?',
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
        this.tutors = this.tutors.filter((val) => val.tutorId !== tutor.tutorId);

        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Tutor eliminado',
          life: 3000,
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rechazado',
          detail: 'Operación cancelada',
          life: 3000,
        });
      }
    });
  }

  deleteSelectedTutors() {
    console.log('Delete selected tutors', this.selectedTutors);
  }

  changeTutorDialogVisible(event: { isOpen: boolean; message: string }) {
    this.tutorDialogVisible = event.isOpen;
    if (event.message === 'save') {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Tutor guardado',
        life: 3000,
      });
    } else if (event.message === 'close') {
      this.messageService.add({
        severity: 'info',
        summary: 'Información',
        detail: 'Operación cancelada',
        life: 3000,
      });
    }
  }

  getNestedValue(data: Tutor, field: string) {
    return field.split('.').reduce((prev: any, curr: string) => prev?.[curr], data);
  }

    getGlobalFilterFields() {
      return getGlobalFilterFields(this.cols);
    }
  
    onGlobalFilter(table: Table, event: Event) {
      return onGlobalFilter(table, event);
    }
  

}
