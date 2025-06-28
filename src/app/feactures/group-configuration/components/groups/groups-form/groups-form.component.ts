import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

import { GroupService } from '../../../services/group.service';

import { ApiError } from '../../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../../core/models/ApiResponse.model';

import { DialogState } from '../../../../../shared/types/dialog.types';
import { FormUtils } from '../../../../../utils/form.utils';

import { InputTextComponent } from '../../../../../shared/components/input-text/input-text.component';

import { GroupRequest, GroupResponse } from '../../../models/group.model';

@Component({
  selector: 'groups-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, DialogModule, ToastModule, InputTextComponent],
  templateUrl: './groups-form.component.html',
  styleUrl: './groups-form.component.scss',
  providers: [MessageService],
})
export class GroupsFormComponent implements OnInit, AfterViewInit {
  @Input() isGroupDialogVisible: boolean = false;
  @Input() isCreateGroup: boolean = true;
  @Input() selectedGroup: GroupResponse | null = null;
  @Output() groupDialogChange: EventEmitter<DialogState<GroupResponse>> = new EventEmitter<
    DialogState<GroupResponse>
  >();

  private fb: FormBuilder = inject(FormBuilder);
  private groupService: GroupService = inject(GroupService);
  private messageService: MessageService = inject(MessageService);

  isLoading: boolean = false;
  formUtils = FormUtils;

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

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.selectedGroup) {
      this.setFormValues(this.selectedGroup);
    }
  }

  setFormValues(group: GroupResponse): void {
    this.groupForm.patchValue({
      name: group.name,
    });
  }

  closeDialog(): void {
    this.groupDialogChange.emit({ isOpen: false, message: 'close', data: null });
  }

  saveOrUpdateGroup(): void {
    if (this.isCreateGroup) {
      this.createGroup();
    } else {
      this.updateGroup();
    }
  }

  createGroup(): void {
    if (this.groupForm.valid) {
      this.isLoading = true;
      const groupRequest: GroupRequest = this.buildGroupRequest();

      this.groupService.createGroup(groupRequest).subscribe({
        next: (response: ApiResponse<GroupResponse>) => {
          this.groupDialogChange.emit({ isOpen: false, message: 'save', data: response.data });
          this.isLoading = false;
        },
        error: (error: ApiError) => {
          if (error.statusCode === 409 && error.message.includes('name_already_exists')) {
            this.groupForm.controls.name.setErrors({ exists: { field: 'nombre' } });
          } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
            this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.groupForm.markAllAsTouched();
    }
  }

  updateGroup(): void {
    if (this.groupForm.valid && this.selectedGroup) {
      this.isLoading = true;
      const groupRequest: GroupRequest = this.buildGroupRequest();

      this.groupService.updateGroup(this.selectedGroup.groupId, groupRequest).subscribe({
        next: (response: ApiResponse<GroupResponse>) => {
          this.groupDialogChange.emit({ isOpen: false, message: 'edit', data: response.data });
          this.isLoading = false;
        },
        error: (error: ApiError) => {
          if (error.statusCode === 404 && error.message.includes('group_not_found')) {
            this.showToast('warn', 'Grupo no encontrado', 'El grupo que intentó actualizar ya no existe en el sistema');
          } else if (error.statusCode === 409 && error.message.includes('name_already_exists')) {
            this.groupForm.controls.name.setErrors({ exists: { field: 'nombre' } });
          } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
            this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.groupForm.markAllAsTouched();
    }
  }

  buildGroupRequest(): GroupRequest {
    const formValues = this.groupForm.value;
    return {
      name: formValues.name!,
    };
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
