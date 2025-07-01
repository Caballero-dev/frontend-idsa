import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

import { AuthService } from '../../../../auth/services/auth.service';
import { UserService } from '../../services/user.service';

import { ApiError } from '../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../core/models/ApiResponse.model';

import { DialogState } from '../../../../shared/types/dialog.types';
import { Column } from '../../../../shared/types/table.types';
import { TableUtils } from '../../../utils/table.utils';

import { UserResponse } from '../../models/user.model';
import { UsersFormComponent } from '../users-form/users-form.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    InputGroupModule,
    InputTextModule,
    TableModule,
    TagModule,
    ToastModule,
    ToggleSwitchModule,
    ToolbarModule,
    TooltipModule,
    UsersFormComponent,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class UsersListComponent implements OnInit {
  private userService: UserService = inject(UserService);
  private authService: AuthService = inject(AuthService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private userCache: Map<number, UserResponse[]> = new Map<number, UserResponse[]>();

  isLoading: boolean = true;
  isCreateUser: boolean = true;
  isUserDialogVisible: boolean = false;

  searchUserValue: string = '';

  cols: Column[] = [
    { field: 'name', header: 'Nombre', sortable: false },
    { field: 'firstSurname', header: 'Primer Apellido', sortable: false },
    { field: 'secondSurname', header: 'Segundo Apellido', sortable: false },
    { field: 'email', header: 'Correo Electrónico', sortable: false },
    { field: 'createdAt', header: 'Fecha de Registro', sortable: false },
    { field: 'role.roleName', header: 'Rol', sortable: false },
    { field: 'isActive', header: 'Activo', sortable: false },
    { field: 'isVerifiedEmail', header: 'Estado del Correo', sortable: false },
  ];
  tableUtils = TableUtils;

  users!: UserResponse[];
  selectedUser!: UserResponse | null;

  rows: number = 20;
  first: number = 0;
  totalRecords: number = 0;

  ngOnInit(): void {}

  openCreateUserDialog(): void {
    this.selectedUser = null;
    this.isCreateUser = true;
    this.isUserDialogVisible = true;
  }

  openEditUserDialog(user: UserResponse): void {
    this.selectedUser = user;
    this.isCreateUser = false;
    this.isUserDialogVisible = true;
  }

  refreshTableData(): void {
    this.first = 0;
    this.userCache.clear();
    this.loadUsers({ first: this.first, rows: this.rows });
  }

  loadUsers(event: TableLazyLoadEvent): void {
    this.isLoading = true;
    this.first = event.first ?? 0;
    const currentRows: number = event.rows ?? this.rows;
    if (this.rows !== currentRows) {
      this.rows = currentRows;
      this.userCache.clear();
    }

    const page = this.getCurrentPageIndex();
    if (this.userCache.has(page)) {
      this.users = this.userCache.get(page)!;
      this.isLoading = false;
      return;
    }

    this.userService.getAllUsers(page, this.rows).subscribe({
      next: (response: ApiResponse<UserResponse[]>) => {
        this.users = response.data;
        this.totalRecords = response.pageInfo!.totalElements;
        this.userCache.set(page, this.users);
        this.isLoading = false;
      },
      error: (error: ApiError) => {
        if (error.status === 'Unknown Error' && error.statusCode === 0) {
          this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
        } else {
          this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
        }
        this.isLoading = false;
      },
    });
  }

  updateStatus(userId: number, status: boolean): void {
    this.isLoading = true;
    this.showToast('info', 'Actualizando estado', 'Se está actualizando el estado del usuario');
    this.userService.updateUserStatus(userId, status).subscribe({
      next: () => {
        this.showToast('success', 'Estado actualizado', 'El estado del usuario ha sido actualizado correctamente');
        this.users = this.users.map((u: UserResponse) => (u.userId === userId ? { ...u, isActive: status } : u));
        this.userCache.clear();
        this.isLoading = false;
      },
      error: (error: ApiError) => {
        if (error.statusCode === 404 && error.message.includes('user_not_found')) {
          this.showToast(
            'warn',
            'Usuario no encontrado',
            'El usuario que intentó actualizar ya no existe en el sistema'
          );
          this.refreshTableData();
          return;
        } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
          this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
        } else {
          this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
        }
        this.users = this.users.map((u: UserResponse) => (u.userId === userId ? { ...u, isActive: !status } : u));
        this.isLoading = false;
      },
    });
  }

  deleteUser(user: UserResponse): void {
    this.confirmationService.confirm({
      message: `¿Está seguro que quieres eliminar el usuario seleccionado?<br>
        <br><b>Nombre:</b> ${user.name} ${user.firstSurname} ${user.secondSurname}
        <br><b>Correo:</b> ${user.email}`,
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
        this.userService.deleteUser(user.userId).subscribe({
          next: () => {
            this.showToast('success', 'Usuario eliminado', 'El usuario ha sido eliminado correctamente');
            this.totalRecords--;
            this.users = this.users.filter((u: UserResponse) => u.userId !== user.userId);
            this.userCache.clear();
            this.isLoading = false;
          },
          error: (error: ApiError) => {
            if (error.statusCode === 404 && error.message.includes('user_not_found')) {
              this.showToast(
                'warn',
                'Usuario no encontrado',
                'El usuario que intentó eliminar ya no existe en el sistema'
              );
              this.refreshTableData();
              return;
            } else if (error.statusCode === 409 && error.message.includes('group_configurations_dependency')) {
              this.showToast(
                'error',
                'Error al eliminar usuario',
                'El usuario no puede ser eliminado porque el tutor tiene configuraciones de grupos asociadas'
              );
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
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación del usuario');
      },
    });
  }

  resendEmail(email: string): void {
    this.showToast('info', 'Enviando correo', 'Se está enviando el correo de verificación a ' + email);
    this.authService.resendEmail({ email }).subscribe({
      next: () => {
        this.showToast('success', 'Correo reenviado', 'El correo ha sido reenviado correctamente');
      },
      error: (error: ApiError) => {
        if (error.statusCode === 500 && error.message.includes('email_sending_failed')) {
          this.showToast('error', 'Error', 'Error al enviar el correo de verificación, por favor intente más tarde');
        } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
          this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
        } else {
          this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
        }
      },
    });
  }

  onUserDialogChange(event: DialogState<UserResponse>): void {
    this.isUserDialogVisible = event.isOpen;
    switch (event.message) {
      case 'save':
        this.handleUserSaved(event.data!);
        break;
      case 'edit':
        this.handleUserUpdated(event.data!);
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

  private handleUserSaved(userData: UserResponse): void {
    this.showToast('success', 'Usuario guardado', 'El usuario ha sido guardado correctamente');
    this.totalRecords++;
    if (this.users.length < this.rows) {
      this.users = [...this.users, userData];
      this.userCache.set(this.getCurrentPageIndex(), this.users);
    } else {
      this.userCache.clear();
    }
  }

  private handleUserUpdated(userData: UserResponse): void {
    this.showToast('success', 'Usuario actualizado', 'El usuario ha sido actualizado correctamente');
    this.users = this.users.map((usr: UserResponse) => (usr.userId === userData.userId ? userData : usr));
    this.userCache.set(this.getCurrentPageIndex(), this.users);
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
