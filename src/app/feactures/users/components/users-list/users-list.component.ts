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
import { EmitterDialogUser, User } from '../../models/user.model';
import { UsersTestService } from '../../tests/users-test.service';

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
  isCreateUser: boolean = true;
  selectedUser!: User | null;
  userDialogVisible: boolean = false;

  tableUtils = TableUtils;
  confirmationService: ConfirmationService = inject(ConfirmationService);
  messageService: MessageService = inject(MessageService);
  userTestService = inject(UsersTestService);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    setTimeout(() => {
      this.users = this.userTestService.getData().map((usr) => {
        return {
          ...usr,
          createdAt: new Date(usr.createdAt).toLocaleString(),
        };
      });
      this.isLoading = false;
    }, 1000);
  }

  createUser(): void {
    this.isCreateUser = true;
    this.selectedUser = null;
    this.userDialogVisible = true;
  }

  editUser(user: User) {
    this.isCreateUser = false;
    this.selectedUser = user;
    this.userDialogVisible = true;
  }

  deleteUser(user: User): void {
    this.confirmationService.confirm({
      message: `¿Está seguro que quieres eliminar el usuario seleccionado?<br><br>Nombre: ${user.name} ${user.firstSurname} ${user.secondSurname} <br>Correo: ${user.email}`,
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
        this.showToast('success', 'Usuario eliminado', 'El usuario ha sido eliminado correctamente');
        this.users = this.users.filter((u: User) => u.userId !== user.userId);
      },
      reject: () => {
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación del usuario');
      },
    });
  }

  deleteSelectedUsers(): void {
    this.confirmationService.confirm({
      header: 'Confirmar',
      message: `¿Está seguro que quieres eliminar los usuarios seleccionados?
        <br><br>${this.selectedUsers?.length} usuarios serán eliminados.
        <br><br>Correos:<br>- ${this.selectedUsers?.map((user) => user.email).join('<br>- ')}`,
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
        this.showToast('success', 'Usuarios eliminados', 'Los usuarios han sido eliminados correctamente');
        this.users = this.users.filter((u: User) => !this.selectedUsers?.includes(u));
      },
      reject: () => {
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación de los usuarios');
      },
    });
  }

  changeUserDialog(event: EmitterDialogUser): void {
    this.userDialogVisible = event.isOpen;
    if (event.message === 'save') {
      this.showToast('success', 'Usuario guardado', 'El usuario ha sido guardado correctamente');
      if (event.user) this.users = [...this.users, event.user];
    } else if (event.message === 'edit') {
      this.showToast('success', 'Usuario actualizado', 'El usuario ha sido actualizado correctamente');
      if (event.user !== null) {
        this.users = this.users.map((usr: User) => (usr.userId === event.user?.userId ? event.user : usr));
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
