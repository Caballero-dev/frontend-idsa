import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Column, TableUtils } from '../../../utils/table.utils';
import { FormUtils } from '../../../../utils/form.utils';
import { Group } from '../../models/group.model';
import { GroupTestService } from '../../tests/group-test.service';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    ButtonModule,
    ToolbarModule,
    InputGroupModule,
    InputTextModule,
    TableModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextComponent,
  ],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class GroupsComponent implements OnInit {
  searchGroupValue: string = '';
  isLoading: boolean = true;
  groupDialogVisible: boolean = false;
  isCreateGroup: boolean = true;

  cols: Column[] = [{ field: 'name', header: 'Nombre', sortable: true }];
  groups!: Group[];
  selectedGroup: Group | null = null;

  tableUtils = TableUtils;
  formUtils = FormUtils;

  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private fb: FormBuilder = inject(FormBuilder);
  private groupTestService = inject(GroupTestService);

  groupForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
        Validators.pattern(this.formUtils.onlyPlainLettersPattern),
      ],
    ],
  });

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.groups = this.groupTestService.getData();
    this.isLoading = false;
  }

  saveOrUpdateGroup(): void {
    if (this.isCreateGroup) {
      this.saveGroup();
    } else {
      this.updateGroup();
    }
  }

  saveGroup(): void {
    if (this.groupForm.valid) {
      let group: Group = {
        groupId: Math.random(),
        name: this.groupForm.value.name as string,
      };

      this.groups = [...this.groups, group];
      this.groupDialogVisible = false;
      this.clearGroupForm();
      this.showToast('success', 'Grupo creado', 'El grupo ha sido creado correctamente');
    } else {
      this.groupForm.markAllAsTouched();
    }
  }

  updateGroup(): void {
    if (this.groupForm.valid && this.selectedGroup) {
      let group: Group = {
        groupId: this.selectedGroup.groupId,
        name: this.groupForm.value.name as string,
      };

      this.groups = this.groups.filter((g: Group) => (g.groupId === group.groupId ? group : g));
      this.groupDialogVisible = false;
      this.clearGroupForm();
      this.showToast('success', 'Grupo actualizado', 'El grupo ha sido actualizado correctamente');
    } else {
      this.groupForm.markAllAsTouched();
    }
  }

  editGroup(group: Group): void {
    this.selectedGroup = group;
    this.isCreateGroup = false;
    this.groupForm.patchValue({ name: group.name });
    this.groupDialogVisible = true;
  }

  deleteGroup(group: Group): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar el grupo seleccionado?<br><br>Nombre: ${group.name}`,
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
        this.groups = this.groups.filter((g: Group) => g.groupId !== group.groupId);
        this.showToast('success', 'Grupo eliminado', 'El grupo ha sido eliminado correctamente');
      },
      reject: () => {
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación');
      },
    });
  }

  closeDialog(): void {
    this.groupDialogVisible = false;
    this.clearGroupForm();
    this.showToast('error', 'Operación cancelada', 'Has cancelado la operación');
  }

  clearGroupForm(): void {
    this.groupForm.reset();
    this.selectedGroup = null;
    this.isCreateGroup = true;
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
