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
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

import { GroupService } from '../../../services/group.service';

import { ApiError } from '../../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../../core/models/ApiResponse.model';

import { DialogState } from '../../../../../shared/types/dialog.types';
import { Column } from '../../../../../shared/types/table.types';
import { TableUtils } from '../../../../utils/table.utils';

import { GroupResponse } from '../../../models/group.model';
import { GroupsFormComponent } from '../groups-form/groups-form.component';

@Component({
  selector: 'app-groups-list',
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
    ToastModule,
    ToolbarModule,
    TooltipModule,
    GroupsFormComponent,
  ],
  templateUrl: './groups-list.component.html',
  styleUrl: './groups-list.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class GroupsListComponent implements OnInit {
  private groupService: GroupService = inject(GroupService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private groupCache: Map<number, GroupResponse[]> = new Map<number, GroupResponse[]>();

  isLoading: boolean = true;
  isCreateGroup: boolean = true;
  isGroupDialogVisible: boolean = false;

  searchGroupValue: string = '';

  cols: Column[] = [{ field: 'name', header: 'Nombre', sortable: true }];
  tableUtils = TableUtils;

  groups!: GroupResponse[];
  selectedGroup!: GroupResponse | null;

  rows: number = 20;
  first: number = 0;
  totalRecords: number = 0;

  ngOnInit(): void {}

  openCreateGroupDialog(): void {
    this.selectedGroup = null;
    this.isCreateGroup = true;
    this.isGroupDialogVisible = true;
  }

  openEditGroupDialog(group: GroupResponse): void {
    this.selectedGroup = group;
    this.isCreateGroup = false;
    this.isGroupDialogVisible = true;
  }

  refreshTableData(): void {
    this.first = 0;
    this.groupCache.clear();
    this.loadGroups({ first: this.first, rows: this.rows });
  }

  loadGroups(event: TableLazyLoadEvent): void {
    this.isLoading = true;
    this.first = event.first ?? 0;
    const currentRows: number = event.rows ?? this.rows;
    if (this.rows !== currentRows) {
      this.rows = currentRows;
      this.groupCache.clear();
    }

    const page = this.getCurrentPageIndex();
    if (this.groupCache.has(page)) {
      this.groups = this.groupCache.get(page)!;
      this.isLoading = false;
      return;
    }

    this.groupService.getAllGroups(page, this.rows).subscribe({
      next: (response: ApiResponse<GroupResponse[]>) => {
        this.groups = response.data;
        this.totalRecords = response.pageInfo!.totalElements;
        this.groupCache.set(page, this.groups);
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

  deleteGroup(group: GroupResponse): void {
    this.confirmationService.confirm({
      message: `¿Está seguro que quieres eliminar el grupo seleccionado?<br>
        <br><b>Nombre:</b> ${group.name}`,
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
        this.groupService.deleteGroup(group.groupId).subscribe({
          next: () => {
            this.showToast('success', 'Grupo eliminado', 'El grupo ha sido eliminado correctamente');
            this.totalRecords--;
            this.groups = this.groups.filter((g: GroupResponse) => g.groupId !== group.groupId);
            this.groupCache.clear();
            this.isLoading = false;
          },
          error: (error: ApiError) => {
            if (error.statusCode === 404 && error.message.includes('group_not_found')) {
              this.showToast('warn', 'Grupo no encontrado', 'El grupo que intentó eliminar ya no existe en el sistema');
              this.refreshTableData();
              return;
            } else if (error.statusCode === 409 && error.message.includes('group_configurations_dependency')) {
              this.showToast(
                'error',
                'Error al eliminar grupo',
                'El grupo no puede ser eliminado porque tiene configuraciones de grupos asociadas'
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
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación del grupo');
      },
    });
  }

  onGroupDialogChange(event: DialogState<GroupResponse>): void {
    this.isGroupDialogVisible = event.isOpen;
    switch (event.message) {
      case 'save':
        this.handleGroupSaved(event.data!);
        break;
      case 'edit':
        this.handleGroupUpdated(event.data!);
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

  private handleGroupSaved(groupData: GroupResponse): void {
    this.showToast('success', 'Grupo guardado', 'El grupo ha sido guardado correctamente');
    this.totalRecords++;
    if (this.groups.length < this.rows) {
      this.groups = [...this.groups, groupData];
      this.groupCache.set(this.getCurrentPageIndex(), this.groups);
    } else {
      this.groupCache.clear();
    }
  }

  private handleGroupUpdated(groupData: GroupResponse): void {
    this.showToast('success', 'Grupo actualizado', 'El grupo ha sido actualizado correctamente');
    this.groups = this.groups.map((g: GroupResponse) => (g.groupId === groupData.groupId ? groupData : g));
    this.groupCache.set(this.getCurrentPageIndex(), this.groups);
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
