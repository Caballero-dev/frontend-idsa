import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

import { CampusService } from '../../../services/campus.service';

import { ApiError } from '../../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../../core/models/ApiResponse.model';

import { DialogState } from '../../../../../shared/types/dialog.types';
import { FormUtils } from '../../../../../utils/form.utils';

import { InputTextComponent } from '../../../../../shared/components/input-text/input-text.component';

import { CampusRequest, CampusResponse } from '../../../models/campus.model';

@Component({
  selector: 'campuses-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, DialogModule, ToastModule, InputTextComponent],
  templateUrl: './campuses-form.component.html',
  styleUrl: './campuses-form.component.scss',
  providers: [MessageService],
})
export class CampusesFormComponent implements OnInit, AfterViewInit {
  @Input() isCampusDialogVisible: boolean = false;
  @Input() isCreateCampus: boolean = true;
  @Input() selectedCampus: CampusResponse | null = null;
  @Output() campusDialogChange: EventEmitter<DialogState<CampusResponse>> = new EventEmitter<
    DialogState<CampusResponse>
  >();

  private fb: FormBuilder = inject(FormBuilder);
  private campusService: CampusService = inject(CampusService);
  private messageService: MessageService = inject(MessageService);

  isLoading: boolean = false;
  formUtils = FormUtils;

  campusForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(this.formUtils.onlyLettersPattern),
      ],
    ],
  });

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.selectedCampus) {
      this.setFormValues(this.selectedCampus);
    }
  }

  setFormValues(campus: CampusResponse): void {
    this.campusForm.patchValue({
      name: campus.name,
    });
  }

  closeDialog(): void {
    this.campusDialogChange.emit({ isOpen: false, message: 'close', data: null });
  }

  saveOrUpdateCampus(): void {
    if (this.isCreateCampus) {
      this.createCampus();
    } else {
      this.updateCampus();
    }
  }

  createCampus(): void {
    if (this.campusForm.valid) {
      this.isLoading = true;
      const campusRequest: CampusRequest = this.buildCampusRequest();

      this.campusService.createCampus(campusRequest).subscribe({
        next: (response: ApiResponse<CampusResponse>) => {
          this.campusDialogChange.emit({ isOpen: false, message: 'save', data: response.data });
          this.isLoading = false;
        },
        error: (error: ApiError) => {
          if (error.statusCode === 409 && error.message.includes('name_already_exists')) {
            this.campusForm.controls.name.setErrors({ exists: { field: 'nombre' } });
          } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
            this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.campusForm.markAllAsTouched();
    }
  }

  updateCampus(): void {
    if (this.campusForm.valid && this.selectedCampus) {
      this.isLoading = true;
      const campusRequest: CampusRequest = this.buildCampusRequest();

      this.campusService.updateCampus(this.selectedCampus.campusId, campusRequest).subscribe({
        next: (response: ApiResponse<CampusResponse>) => {
          this.campusDialogChange.emit({ isOpen: false, message: 'edit', data: response.data });
          this.isLoading = false;
        },
        error: (error: ApiError) => {
          if (error.statusCode === 404 && error.message.includes('campus_not_found')) {
            this.showToast(
              'warn',
              'Campus no encontrado',
              'El campus que intentó actualizar ya no existe en el sistema'
            );
          } else if (error.statusCode === 409 && error.message.includes('name_already_exists')) {
            this.campusForm.controls.name.setErrors({ exists: { field: 'nombre' } });
          } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
            this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.campusForm.markAllAsTouched();
    }
  }

  buildCampusRequest(): CampusRequest {
    const formValues = this.campusForm.value;
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
