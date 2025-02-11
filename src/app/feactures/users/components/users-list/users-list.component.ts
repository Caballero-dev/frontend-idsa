import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsersFormComponent } from '../users-form/users-form.component';

interface Role {
  roleId: string;
  roleName: string;
}

interface User {
  userId: string;
  name: string;
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
  styleUrl: './users-list.component.css',
  providers: [ConfirmationService, MessageService],
})
export class UsersListComponent implements OnInit {
  user!: User;
  cols: Column[] = [
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'email', header: 'Correo', sortable: true },
    { field: 'creationDate', header: 'Fecha de Creación', sortable: true },
    { field: 'lastAccess', header: 'Último Acceso', sortable: true },
    { field: 'role.roleName', header: 'Rol', sortable: true },
    { field: 'isActive', header: 'Activo', sortable: true },
  ];
  users!: User[];
  selectedUsers!: User[] | null;
  userDialogVisible: boolean = false;

  constructor(
    protected confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.users = [
      {
        userId: '1',
        name: 'Jose Perez',
        email: 'jose@gmail.com',
        creationDate: '2021-11-10',
        lastAccess: '2021-10-10',
        isActive: true,
        role: { roleId: '1', roleName: 'Administrador' },
      },
      {
        userId: '2',
        name: 'Juan Perez',
        role: { roleId: '2', roleName: 'Estudiante' },
        email: '2@gmail.com',
        creationDate: '2021-10-10',
        lastAccess: '2021-10-10',
        isActive: true,
      },
      {
        userId: '3',
        name: 'Maria Perez',
        role: { roleId: '3', roleName: 'Tutor' },
        email: '5@gmail.com',
        creationDate: '2021-10-10',
        lastAccess: '2021-10-10',
        isActive: true,
      },
      {
        userId: '4',
        name: 'Pedro Perez',
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

  deleteSelectedUsers() {
    console.log('Delete selected users', this.selectedUsers);
  }

  changeUserDialog(event: { isOpen: boolean; message: string }) {
    this.userDialogVisible = event.isOpen;
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

  getNestedValue(data: User, field: string) {
    return field.split('.').reduce((prev: any, curr: string) => prev?.[curr], data);
  }

  getGlobalFilterFields() {
    return getGlobalFilterFields(this.cols);
  }

  onGlobalFilter(table: Table, event: Event) {
    return onGlobalFilter(table, event);
  }
}
