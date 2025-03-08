import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsersFormComponent } from '../users-form/users-form.component';
import { Column, TableUtils } from '../../../utils/table.utils';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

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
  createdAt: string;
  isActive: boolean;
  role: Role;
}

@Component({
  selector: 'app-users-list',
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
    UsersFormComponent,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class UsersListComponent implements OnInit {
  searchUserValue: string = '';
  isLoading: boolean = true;
  cols: Column[] = [
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'firstSurname', header: 'Primer Apellido', sortable: true },
    { field: 'secondSurname', header: 'Segundo Apellido', sortable: true },
    { field: 'email', header: 'Correo', sortable: true },
    { field: 'createdAt', header: 'Fecha de Creación', sortable: true },
    { field: 'role.roleName', header: 'Rol', sortable: true },
  ];
  users!: User[];
  selectedUsers!: User[] | null;
  userDialogVisible: boolean = false;

  tableUtils = TableUtils;
  confirmationService: ConfirmationService = inject(ConfirmationService);
  messageService: MessageService = inject(MessageService);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    setTimeout(() => {
      this.users = [
        {
          userId: '1',
          name: 'Jose',
          firstSurname: 'Perez',
          secondSurname: 'Gonzalez',
          email: 'jose@gmail.com',
          createdAt: '2021-11-10',
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
          createdAt: '2021-10-10',
          isActive: true,
        },
        {
          userId: '3',
          name: 'Maria',
          firstSurname: 'Perez',
          secondSurname: 'Gonzalez',
          role: { roleId: '3', roleName: 'Tutor' },
          email: '5@gmail.com',
          createdAt: '2021-10-10',
          isActive: true,
        },
        {
          userId: '4',
          name: 'Pedro',
          firstSurname: 'Perez',
          secondSurname: 'Gonzalez',
          role: { roleId: '4', roleName: 'Administrador' },
          email: 'pedro@gamil.com',
          createdAt: '2021-10-10',
          isActive: false,
        },
      ];
      this.isLoading = false;
    }, 1000);
  }

  createUser(): void {
    this.userDialogVisible = true;
  }

  editUser(user: User) {
    console.log('Edit user', user);
  }

  deleteUser(user: User): void {
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
        );
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
        );
      },
    });
  }

  deleteSelectedUsers(): void {
    console.log('Delete selected users', this.selectedUsers);
  }

  changeUserDialog(event: { isOpen: boolean; message: string }): void {
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
      );
    } else if (event.message === 'close') {
      this.messageToast(
        'error',
        'pi pi-times-circle',
        true,
        'pi pi-times',
        false,
        'Operación cancelada',
        'Has cancelado la operación'
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
