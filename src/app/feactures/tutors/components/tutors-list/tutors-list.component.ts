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

  loadTutors() {
    setTimeout(() => {
      this.tutors = this.tutorTestService.getData();
      this.isLoading = false;
    }, 500);
  }

  createTutor() {
    this.isCreateTutor = true;
    this.selectedTutor = null;
    this.tutorDialogVisible = true;
  }

  editTutor(tutor: Tutor) {
    this.isCreateTutor = false;
    this.selectedTutor = tutor;
    this.tutorDialogVisible = true;
  }

  deleteTutor(tutor: Tutor) {
    this.confirmationService.confirm({
      // message: '¿Estas seguro de que deseas eliminar ' + tutor.name + '?',
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
        this.messageToast(
          'success',
          'pi pi-verified',
          false,
          'pi pi-times',
          false,
          'Tutor eliminado',
          'El tutor ha sido eliminado correctamente',
          3000
        );

        this.tutors = this.tutors.filter((t: Tutor) => t.tutorId !== tutor.tutorId);
      },
      reject: () => {
        this.messageToast(
          'error',
          'pi pi-times-circle',
          false,
          'pi pi-times',
          false,
          'Eliminación cancelada',
          'Has cancelado la eliminación del tutor',
          3000
        );
      },
    });
  }

  deleteSelectedTutors() {
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
        this.messageToast(
          'success',
          'pi pi-verified',
          true,
          'pi pi-times',
          false,
          'Tutores eliminados',
          'Los tutores han sido eliminados correctamente',
          3000
        );

        this.tutors = this.tutors.filter((t: Tutor) => !this.selectedTutors?.includes(t));
      },
      reject: () => {
        this.messageToast(
          'error',
          'pi pi-times-circle',
          true,
          'pi pi-times',
          false,
          'Eliminación cancelada',
          'Has cancelado la eliminación de los tutores',
          3000
        );
      },
    });
  }

  changeTutorDialog(event: EmitterDialogTutor) {
    this.tutorDialogVisible = event.isOpen;
    if (event.message === 'save') {
      this.messageToast(
        'success',
        'pi pi-verified',
        false,
        'pi pi-times',
        false,
        'Tutor guardado',
        'El tutor ha sido guardado correctamente',
        3000
      );

      if (event.tutor) this.tutors.push(event.tutor);
    } else if (event.message === 'edit') {
      this.messageToast(
        'success',
        'pi pi-verified',
        false,
        'pi pi-times',
        false,
        'Tutor editado',
        'El tutor ha sido editado correctamente',
        3000
      );

      if (event.tutor) {
        this.tutors = this.tutors.map((t: Tutor) => (t.tutorId === event.tutor?.tutorId ? event.tutor : t));
      }
    } else if (event.message === 'close') {
      this.messageToast(
        'error',
        'pi pi-times-circle',
        false,
        'pi pi-times',
        false,
        'Operación cancelada',
        'Has cancelado la operación',
        3000
      );
    }
  }

  messageToast(
    severity?: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast',
    icon?: string,
    closable?: boolean,
    closeIcon?: string,
    sticky?: boolean,
    summary?: string,
    detail?: string,
    life?: number
  ): void {
    this.messageService.add({
      severity: severity,
      icon: icon,
      closable: closable,
      closeIcon: closeIcon,
      sticky: sticky,
      summary: summary,
      detail: detail,
      life: life,
    });
  }
}
