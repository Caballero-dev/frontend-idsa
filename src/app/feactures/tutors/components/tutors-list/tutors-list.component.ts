import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TutorsFormComponent } from '../tutors-form/tutors-form.component';
import { Column, TableUtils } from '../../../utils/table.utils';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { EmitterDialogTutor, Tutor } from '../../models/tutors.model';
import { TutorsTestService } from '../../tests/tutors-test.service';

@Component({
  selector: 'app-tutors-list',
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
    TutorsFormComponent,
  ],
  templateUrl: './tutors-list.component.html',
  styleUrl: './tutors-list.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class TutorsListComponent implements OnInit {
  searchTutorValue: string = '';
  isLoading: boolean = true;
  cols: Column[] = [
    { field: 'employeeCode', header: 'Numero de empleado', sortable: true },
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'firstSurname', header: 'Apellido Paterno', sortable: true },
    { field: 'secondSurname', header: 'Apellido Materno', sortable: true },
    { field: 'phoneNumber', header: 'Telefono', sortable: true },
    { field: 'email', header: 'Correo', sortable: true },
  ];
  tutors!: Tutor[];
  selectedTutors!: Tutor[] | null;
  isCreateTutor: boolean = true;
  selectedTutor!: Tutor | null;
  tutorDialogVisible: boolean = false;

  tableUtils = TableUtils;
  confirmationService: ConfirmationService = inject(ConfirmationService);
  messageService: MessageService = inject(MessageService);
  tutorTestService = inject(TutorsTestService);

  ngOnInit(): void {
    this.loadTutors();
  }

  loadTutors(): void {
    this.tutors = this.tutorTestService.getData();
    this.isLoading = false;
  }

  createTutor(): void {
    this.isCreateTutor = true;
    this.selectedTutor = null;
    this.tutorDialogVisible = true;
  }

  editTutor(tutor: Tutor): void {
    this.isCreateTutor = false;
    this.selectedTutor = tutor;
    this.tutorDialogVisible = true;
  }

  deleteTutor(tutor: Tutor): void {
    this.confirmationService.confirm({
      message: `¿Estas seguro de que deseas eliminar al tutor seleccionado?<br><br>Nombre: ${tutor.name} ${tutor.firstSurname} ${tutor.secondSurname} <br>Correo: ${tutor.email}`,
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
        this.showToast('success', 'Tutor eliminado', 'El tutor ha sido eliminado correctamente');

        this.tutors = this.tutors.filter((t: Tutor) => t.tutorId !== tutor.tutorId);
      },
      reject: () => {
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación del tutor');
      },
    });
  }

  deleteSelectedTutors(): void {
    this.confirmationService.confirm({
      header: 'Confirmar',
      message: `¿Estas seguro de que deseas eliminar los tutores seleccionados?
      <br><br>${this.selectedTutors?.length} tutores serán eliminados.
      <br><br>Correos:<br>- ${this.selectedTutors?.map((tutor: Tutor) => tutor.email).join('<br>- ')}`,
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
        this.showToast('success', 'Tutores eliminados', 'Los tutores han sido eliminados correctamente');

        this.tutors = this.tutors.filter((t: Tutor) => !this.selectedTutors?.includes(t));
      },
      reject: () => {
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación de los tutores');
      },
    });
  }

  changeTutorDialog(event: EmitterDialogTutor): void {
    this.tutorDialogVisible = event.isOpen;
    if (event.message === 'save') {
      this.showToast('success', 'Tutor guardado', 'El tutor ha sido guardado correctamente');

      if (event.tutor) this.tutors = [...this.tutors, event.tutor];
    } else if (event.message === 'edit') {
      this.showToast('success', 'Tutor actualizado', 'El tutor ha sido actualizado correctamente');

      if (event.tutor) {
        this.tutors = this.tutors.map((t: Tutor) => (t.tutorId === event.tutor?.tutorId ? event.tutor : t));
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
