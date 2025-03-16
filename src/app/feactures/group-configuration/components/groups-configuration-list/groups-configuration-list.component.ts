import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Column, TableUtils } from '../../../utils/table.utils';
import { EmitterDialogGroupConfiguration, GroupConfiguration } from '../../models/group-configuration.model';
import { GroupConfigurationService } from '../../tests/group-configuration.service';
import { GroupsConfigurationFormComponent } from '../groups-configuration-form/groups-configuration-form.component';

@Component({
  selector: 'app-groups-configuration-list',
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
    RouterLink,
    GroupsConfigurationFormComponent,
  ],
  templateUrl: './groups-configuration-list.component.html',
  styleUrl: './groups-configuration-list.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class GroupsConfigurationListComponent implements OnInit {
  searchGroupConfigurationValue: string = '';
  isLoading: boolean = true;
  cols: Column[] = [
    { field: 'tutor.name', header: 'Nombre tutor', sortable: true },
    { field: 'tutor.email', header: 'Correo tutor', sortable: true },
    { field: 'campus.name', header: 'Campus', sortable: true },
    { field: 'specialty.name', header: 'Especialidad', sortable: true },
    { field: 'modality.name', header: 'Modalidad', sortable: true },
    { field: 'grade.name', header: 'Grado', sortable: true },
    { field: 'group.name', header: 'Grupo', sortable: true },
    { field: 'generation.yearStart', header: 'Generación', sortable: true },
  ];
  groupConfigurations!: GroupConfiguration[];
  isCreateGroupConfiguration: boolean = true;
  selectedGroupConfiguration!: GroupConfiguration | null;
  groupConfigurationDialogVisible: boolean = false;

  tableUtils = TableUtils;

  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private groupConfigurationTestService = inject(GroupConfigurationService);

  ngOnInit(): void {
    this.loadGroupConfigurations();
  }

  loadGroupConfigurations(): void {
    this.groupConfigurations = this.groupConfigurationTestService.getData();
    this.isLoading = false;
  }

  createGroupConfiguration(): void {
    this.isCreateGroupConfiguration = true;
    this.selectedGroupConfiguration = null;
    this.groupConfigurationDialogVisible = true;
  }

  editGroupConfiguration(groupConfiguration: GroupConfiguration): void {
    this.isCreateGroupConfiguration = false;
    this.selectedGroupConfiguration = groupConfiguration;
    this.groupConfigurationDialogVisible = true;
  }

  deleteGroupConfiguration(groupConfiguration: GroupConfiguration): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar la configuración de grupo seleccionada?<br>
        <br><strong>Campus</strong>: ${groupConfiguration.campus.name}
        <br><strong>Modalidad</strong>:${groupConfiguration.modality.name}
        <br><strong>Especialidad</strong>: ${groupConfiguration.specialty.name}
        <br><strong>Grado y grupo</strong>: ${groupConfiguration.grade.name} - ${groupConfiguration.group.name}
        <br><strong>Generación</strong> ${groupConfiguration.generation.yearStart} / ${groupConfiguration.generation.yearEnd}
        <br><br><strong>Tutor</strong>: ${groupConfiguration.tutor.name} ${groupConfiguration.tutor.firstSurname} ${groupConfiguration.tutor.secondSurname}`,
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
        this.groupConfigurations = this.groupConfigurations.filter(
          (gc: GroupConfiguration) => gc.groupConfigurationId !== groupConfiguration.groupConfigurationId
        );
        this.showToast(
          'success',
          'Configuración de grupo eliminada',
          'La configuración de grupo ha sido eliminada correctamente'
        );
      },
      reject: () => {
        this.showToast('error', 'Eliminación cancelada', 'Ha cancelado la eliminación');
      },
    });
  }

  changeGroupConfigurationDialogVisible(event: EmitterDialogGroupConfiguration): void {
    this.groupConfigurationDialogVisible = event.isOpen;
    if (event.message === 'save') {
      this.showToast(
        'success',
        'Configuración de grupo guardada',
        'La configuración de grupo ha sido guardada correctamente'
      );
      if (event.groupConfiguration) this.groupConfigurations = [...this.groupConfigurations, event.groupConfiguration];
    } else if (event.message === 'edit') {
      this.showToast(
        'success',
        'Configuración de grupo actualizada',
        'La configuración de grupo ha sido actualizada correctamente'
      );
      if (event.groupConfiguration) {
        this.groupConfigurations = this.groupConfigurations.map((gc: GroupConfiguration) =>
          gc.groupConfigurationId === event.groupConfiguration?.groupConfigurationId ? event.groupConfiguration : gc
        );
      }
    } else if (event.message === 'close') {
      this.showToast('error', 'Operación cancelada', 'Ha cancelado la operación');
    }
  }

  get filterFields(): string[] {
    return [
      'tutor.firstSurname',
      'tutor.secondSurname',
      'generation.yearEnd',
      ...this.tableUtils.getGlobalFilterFields(this.cols),
    ];
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
