import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

import { ModalityService } from '../../../services/modality.service';

import { ApiError } from '../../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../../core/models/ApiResponse.model';

import { DialogState } from '../../../../../shared/types/dialog.types';
import { FormUtils } from '../../../../../utils/form.utils';

import { InputTextComponent } from '../../../../../shared/components/input-text/input-text.component';

import { ModalityRequest, ModalityResponse } from '../../../models/modality.model';

@Component({
  selector: 'modalities-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, DialogModule, ToastModule, InputTextComponent],
  templateUrl: './modalities-form.component.html',
  styleUrl: './modalities-form.component.scss',
  providers: [MessageService],
})
export class ModalitiesFormComponent implements OnInit, AfterViewInit {
  @Input() isModalityDialogVisible: boolean = false;
  @Input() isCreateModality: boolean = true;
  @Input() selectedModality: ModalityResponse | null = null;
  @Output() modalityDialogChange: EventEmitter<DialogState<ModalityResponse>> = new EventEmitter<
    DialogState<ModalityResponse>
  >();

  private fb: FormBuilder = inject(FormBuilder);
  private modalityService: ModalityService = inject(ModalityService);
  private messageService: MessageService = inject(MessageService);

  isLoading: boolean = false;
  formUtils = FormUtils;

  modalityForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(this.formUtils.onlyLettersPattern),
      ],
    ],
  });

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.selectedModality) {
      this.setFormValues(this.selectedModality);
    }
  }

  setFormValues(modality: ModalityResponse): void {
    this.modalityForm.patchValue({
      name: modality.name,
    });
  }

  closeDialog(): void {
    this.modalityDialogChange.emit({ isOpen: false, message: 'close', data: null });
  }

  saveOrUpdateModality(): void {
    if (this.isCreateModality) {
      this.createModality();
    } else {
      this.updateModality();
    }
  }

  createModality(): void {
    if (this.modalityForm.valid) {
      this.isLoading = true;
      const modalityRequest: ModalityRequest = this.buildModalityRequest();

      this.modalityService.createModality(modalityRequest).subscribe({
        next: (response: ApiResponse<ModalityResponse>) => {
          this.modalityDialogChange.emit({ isOpen: false, message: 'save', data: response.data });
          this.isLoading = false;
        },
        error: (error: ApiError) => {
          if (error.statusCode === 409 && error.message.includes('name_already_exists')) {
            this.modalityForm.controls.name.setErrors({ exists: { field: 'nombre' } });
          } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
            this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.modalityForm.markAllAsTouched();
    }
  }

  updateModality(): void {
    if (this.modalityForm.valid && this.selectedModality) {
      this.isLoading = true;
      const modalityRequest: ModalityRequest = this.buildModalityRequest();

      this.modalityService.updateModality(this.selectedModality.modalityId, modalityRequest).subscribe({
        next: (response: ApiResponse<ModalityResponse>) => {
          this.modalityDialogChange.emit({ isOpen: false, message: 'edit', data: response.data });
          this.isLoading = false;
        },
        error: (error: ApiError) => {
          if (error.statusCode === 404 && error.message.includes('modality_not_found')) {
            this.showToast(
              'warn',
              'Modalidad no encontrada',
              'La modalidad que intentó actualizar ya no existe en el sistema'
            );
          } else if (error.statusCode === 409 && error.message.includes('name_already_exists')) {
            this.modalityForm.controls.name.setErrors({ exists: { field: 'nombre' } });
          } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
            this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.modalityForm.markAllAsTouched();
    }
  }

  buildModalityRequest(): ModalityRequest {
    const formValues = this.modalityForm.value;
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
