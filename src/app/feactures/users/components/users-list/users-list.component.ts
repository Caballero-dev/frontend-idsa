import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsersFormComponent } from '../users-form/users-form.component';
import { Column, TableUtils } from '../../../utils/table.utils';

interface Role {
  roleId: string;
  roleName: string;
}

interface User {
  userId: string;
  name: string;
  firstSurname: string;
  secondSurname: string;
  email: string;
  password?: string;
  creationDate: string;
  lastAccess: string;
  isActive: boolean;
  role: Role;
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    UsersFormComponent,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class UsersListComponent implements OnInit {
  cols: Column[] = [
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'firstSurname', header: 'Primer Apellido', sortable: true },
    { field: 'secondSurname', header: 'Segundo Apellido', sortable: true },
    { field: 'email', header: 'Correo', sortable: true },
    { field: 'creationDate', header: 'Fecha de Creación', sortable: true },
    { field: 'lastAccess', header: 'Último Acceso', sortable: true },
    { field: 'role.roleName', header: 'Rol', sortable: true },
    { field: 'isActive', header: 'Activo', sortable: true },
  ];
  users!: User[];
  selectedUsers!: User[] | null;
  userDialogVisible: boolean = false;

  tableUtils = TableUtils;
  confirmationService: ConfirmationService = inject(ConfirmationService);
  messageService: MessageService = inject(MessageService);

  ngOnInit(): void {
    this.users = [
      {
        userId: '1',
        name: 'Jose',
        firstSurname: 'Perez',
        secondSurname: 'Gonzalez',
        email: 'jose@gmail.com',
        creationDate: '2021-11-10',
        lastAccess: '2021-10-10',
        isActive: true,
        role: { roleId: '1', roleName: 'Administrador' },
      },
      {
        userId: '2',
        name: 'Juan',
        firstSurname: 'Perez',
        secondSurname: 'Gonzalez',
        role: { roleId: '2', roleName: 'Estudiante' },
        email: '2@gmail.com',
        creationDate: '2021-10-10',
        lastAccess: '2021-10-10',
        isActive: true,
      },
      {
        userId: '3',
        name: 'Maria',
        firstSurname: 'Perez',
        secondSurname: 'Gonzalez',
        role: { roleId: '3', roleName: 'Tutor' },
        email: '5@gmail.com',
        creationDate: '2021-10-10',
        lastAccess: '2021-10-10',
        isActive: true,
      },
      {
        userId: '4',
        name: 'Pedro',
        firstSurname: 'Perez',
        secondSurname: 'Gonzalez',
        role: { roleId: '4', roleName: 'Administrador' },
        email: 'pedro@gamil.com',
        creationDate: '2021-10-10',
        lastAccess: '2021-10-10',
        isActive: false,
      },
    ];
  }

  createUser() {
    this.userDialogVisible = true;
  }

  editUser(user: User) {
    console.log('Edit user', user);
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: '¿Está seguro que quieres eliminar ' + user.name + '?',
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
        this.users = this.users.filter((val) => val.userId !== user.userId);

        this.messageToast(
          'success',
          'pi pi-verified',
          true,
          'pi pi-times',
          false,
          'Estudiante eliminado',
          'El estudiante ha sido eliminado correctamente',
          3000
        )

      },
      reject: () => {
        this.messageToast(
          'error',
          'pi pi-times-circle',
          true,
          'pi pi-times',
          false,
          'Eliminación cancelada',
          'Has cancelado la eliminación del estudiante',
          3000
        )

      },
    });
  }

  deleteSelectedUsers() {
    console.log('Delete selected users', this.selectedUsers);
  }

  changeUserDialog(event: { isOpen: boolean; message: string }) {
    this.userDialogVisible = event.isOpen;
    if (event.message === 'save') {

      this.messageToast(
        'success',
        'pi pi-verified',
        true,
        'pi pi-times',
        false,
        'Estudiante guardado',
        'El estudiante ha sido guardado correctamente',
        3000
      )

    } else if (event.message === 'close') {

      this.messageToast(
        'error',
        'pi pi-times-circle',
        true,
        'pi pi-times',
        false,
        'Operación cancelada',
        'Has cancelado la operación',
      )

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
