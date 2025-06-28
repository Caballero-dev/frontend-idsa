import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

import { GradeService } from '../../../services/grade.service';

import { ApiError } from '../../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../../core/models/ApiResponse.model';

import { DialogState } from '../../../../../shared/types/dialog.types';
import { FormUtils } from '../../../../../utils/form.utils';

import { InputTextComponent } from '../../../../../shared/components/input-text/input-text.component';

import { GradeRequest, GradeResponse } from '../../../models/grade.model';

@Component({
  selector: 'grades-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, DialogModule, ToastModule, InputTextComponent],
  templateUrl: './grades-form.component.html',
  styleUrl: './grades-form.component.scss',
  providers: [MessageService],
})
export class GradesFormComponent implements OnInit, AfterViewInit {
  @Input() isGradeDialogVisible: boolean = false;
  @Input() isCreateGrade: boolean = true;
  @Input() selectedGrade: GradeResponse | null = null;
  @Output() gradeDialogChange: EventEmitter<DialogState<GradeResponse>> = new EventEmitter<
    DialogState<GradeResponse>
  >();

  private fb: FormBuilder = inject(FormBuilder);
  private gradeService: GradeService = inject(GradeService);
  private messageService: MessageService = inject(MessageService);

  isLoading: boolean = false;
  formUtils = FormUtils;

  gradeForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        Validators.pattern(this.formUtils.onlyLettersPattern),
      ],
    ],
  });

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.selectedGrade) {
      this.setFormValues(this.selectedGrade);
    }
  }

  setFormValues(grade: GradeResponse): void {
    this.gradeForm.patchValue({
      name: grade.name,
    });
  }

  closeDialog(): void {
    this.gradeDialogChange.emit({ isOpen: false, message: 'close', data: null });
  }

  saveOrUpdateGrade(): void {
    if (this.isCreateGrade) {
      this.createGrade();
    } else {
      this.updateGrade();
    }
  }

  createGrade(): void {
    if (this.gradeForm.valid) {
      this.isLoading = true;
      const gradeRequest: GradeRequest = this.buildGradeRequest();

      this.gradeService.createGrade(gradeRequest).subscribe({
        next: (response: ApiResponse<GradeResponse>) => {
          this.gradeDialogChange.emit({ isOpen: false, message: 'save', data: response.data });
          this.isLoading = false;
        },
        error: (error: ApiError) => {
          if (error.statusCode === 409 && error.message.includes('name_already_exists')) {
            this.gradeForm.controls.name.setErrors({ exists: { field: 'nombre' } });
          } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
            this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.gradeForm.markAllAsTouched();
    }
  }

  updateGrade(): void {
    if (this.gradeForm.valid && this.selectedGrade) {
      this.isLoading = true;
      const gradeRequest: GradeRequest = this.buildGradeRequest();

      this.gradeService.updateGrade(this.selectedGrade.gradeId, gradeRequest).subscribe({
        next: (response: ApiResponse<GradeResponse>) => {
          this.gradeDialogChange.emit({ isOpen: false, message: 'edit', data: response.data });
          this.isLoading = false;
        },
        error: (error: ApiError) => {
          if (error.statusCode === 404 && error.message.includes('grade_not_found')) {
            this.showToast('warn', 'Grado no encontrado', 'El grado que intentó actualizar ya no existe en el sistema');
          } else if (error.statusCode === 409 && error.message.includes('name_already_exists')) {
            this.gradeForm.controls.name.setErrors({ exists: { field: 'nombre' } });
          } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
            this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.gradeForm.markAllAsTouched();
    }
  }

  buildGradeRequest(): GradeRequest {
    const formValues = this.gradeForm.value;
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
