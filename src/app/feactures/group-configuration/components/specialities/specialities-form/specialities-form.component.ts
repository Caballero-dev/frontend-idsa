import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

import { SpecialtyService } from '../../../services/specialty.service';

import { ApiError } from '../../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../../core/models/ApiResponse.model';

import { DialogState } from '../../../../../shared/types/dialog.types';
import { FormUtils } from '../../../../../utils/form.utils';

import { InputTextComponent } from '../../../../../shared/components/input-text/input-text.component';

import { SpecialtyRequest, SpecialtyResponse } from '../../../models/specialty.model';

@Component({
  selector: 'specialties-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, DialogModule, ToastModule, InputTextComponent],
  templateUrl: './specialities-form.component.html',
  styleUrl: './specialities-form.component.scss',
  providers: [MessageService],
})
export class SpecialitiesFormComponent implements OnInit, AfterViewInit {
  @Input() isSpecialtyDialogVisible: boolean = false;
  @Input() isCreateSpecialty: boolean = true;
  @Input() selectedSpecialty: SpecialtyResponse | null = null;
  @Output() specialtyDialogChange: EventEmitter<DialogState<SpecialtyResponse>> = new EventEmitter<
    DialogState<SpecialtyResponse>
  >();

  private fb: FormBuilder = inject(FormBuilder);
  private specialtyService: SpecialtyService = inject(SpecialtyService);
  private messageService: MessageService = inject(MessageService);

  isLoading: boolean = false;
  formUtils = FormUtils;

  specialtyForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(this.formUtils.onlyLettersPattern),
      ],
    ],
    shortName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10),
        Validators.pattern(this.formUtils.onlyPlainLettersPattern),
      ],
    ],
  });

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.selectedSpecialty) {
      this.setFormValues(this.selectedSpecialty);
    }
  }

  setFormValues(specialty: SpecialtyResponse): void {
    this.specialtyForm.patchValue({
      name: specialty.name,
      shortName: specialty.shortName,
    });
  }

  closeDialog(): void {
    this.specialtyDialogChange.emit({ isOpen: false, message: 'close', data: null });
  }

  saveOrUpdateSpecialty(): void {
    if (this.isCreateSpecialty) {
      this.createSpecialty();
    } else {
      this.updateSpecialty();
    }
  }

  createSpecialty(): void {
    if (this.specialtyForm.valid) {
      this.isLoading = true;
      const specialtyRequest: SpecialtyRequest = this.buildSpecialtyRequest();

      this.specialtyService.createSpecialty(specialtyRequest).subscribe({
        next: (response: ApiResponse<SpecialtyResponse>) => {
          this.specialtyDialogChange.emit({ isOpen: false, message: 'save', data: response.data });
          this.isLoading = false;
        },
        error: (error: ApiError) => {
          if (error.statusCode === 409 && error.message.includes('<name_already_exists>')) {
            this.specialtyForm.controls.name.setErrors({ exists: { field: 'nombre' } });
          } else if (error.statusCode === 409 && error.message.includes('<short_name_already_exists>')) {
            this.specialtyForm.controls.shortName.setErrors({ exists: { field: 'nombre corto' } });
          } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
            this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.specialtyForm.markAllAsTouched();
    }
  }

  updateSpecialty(): void {
    if (this.specialtyForm.valid && this.selectedSpecialty) {
      this.isLoading = true;
      const specialtyRequest: SpecialtyRequest = this.buildSpecialtyRequest();

      this.specialtyService.updateSpecialty(this.selectedSpecialty.specialtyId, specialtyRequest).subscribe({
        next: (response: ApiResponse<SpecialtyResponse>) => {
          this.specialtyDialogChange.emit({ isOpen: false, message: 'edit', data: response.data });
          this.isLoading = false;
        },
        error: (error: ApiError) => {
          if (error.statusCode === 404 && error.message.includes('specialty_not_found')) {
            this.showToast(
              'warn',
              'Especialidad no encontrada',
              'La especialidad que intentó actualizar ya no existe en el sistema'
            );
          } else if (error.statusCode === 409 && error.message.includes('<name_already_exists>')) {
            this.specialtyForm.controls.name.setErrors({ exists: { field: 'nombre' } });
          } else if (error.statusCode === 409 && error.message.includes('<short_name_already_exists>')) {
            this.specialtyForm.controls.shortName.setErrors({ exists: { field: 'nombre corto' } });
          } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
            this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.specialtyForm.markAllAsTouched();
    }
  }

  buildSpecialtyRequest(): SpecialtyRequest {
    const formValues = this.specialtyForm.value;
    return {
      name: formValues.name!,
      shortName: formValues.shortName!,
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
