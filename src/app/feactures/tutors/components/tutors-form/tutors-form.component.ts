import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

import { TutorService } from '../../services/tutor.service';

import { ApiError } from '../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../core/models/ApiResponse.model';

import { DialogState } from '../../../../shared/types/dialog.types';
import { FormUtils } from '../../../../utils/form.utils';

import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';

import { TutorRequest, TutorResponse } from '../../models/tutor.model';

@Component({
  selector: 'tutors-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, DialogModule, ToastModule, InputTextComponent],
  templateUrl: './tutors-form.component.html',
  styleUrl: './tutors-form.component.scss',
  providers: [MessageService],
})
export class TutorsFormComponent implements OnInit, AfterViewInit {
  @Input() isTutorDialogVisible: boolean = false;
  @Input() isCreateTutor: boolean = true;
  @Input() selectedTutor: TutorResponse | null = null;
  @Output() tutorDialogChange: EventEmitter<DialogState<TutorResponse>> = new EventEmitter<
    DialogState<TutorResponse>
  >();

  private fb: FormBuilder = inject(FormBuilder);
  private tutorService: TutorService = inject(TutorService);
  private messageService: MessageService = inject(MessageService);

  isLoading: boolean = false;

  formUtils = FormUtils;

  tutorForm = this.fb.group({
    employeeCode: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(20),
        Validators.pattern(this.formUtils.alphanumericPattern),
      ],
    ],
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(this.formUtils.onlyLettersPattern),
      ],
    ],
    firstSurname: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(this.formUtils.onlyLettersPattern),
      ],
    ],
    secondSurname: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(this.formUtils.onlyLettersPattern),
      ],
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
        Validators.pattern(this.formUtils.emailPattern),
      ],
    ],
    phoneNumber: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(this.formUtils.onlyNumbersPattern),
      ],
    ],
  });

  ngOnInit() {}

  ngAfterViewInit(): void {
    if (this.selectedTutor) {
      this.setValuesForm(this.selectedTutor);
    }
  }

  setValuesForm(tutor: TutorResponse) {
    this.tutorForm.patchValue({
      employeeCode: tutor.employeeCode,
      name: tutor.name,
      firstSurname: tutor.firstSurname,
      secondSurname: tutor.secondSurname,
      email: tutor.email,
      phoneNumber: tutor.phoneNumber,
    });
  }

  closeDialog() {
    this.tutorDialogChange.emit({ isOpen: false, message: 'close', data: null });
  }

  saveOrUpdateTutor() {
    if (this.isCreateTutor) {
      this.createTutor();
    } else {
      this.updateTutor();
    }
  }

  createTutor() {
    if (this.tutorForm.valid) {
      this.isLoading = true;
      const tutorRequest: TutorRequest = this.buildTutorRequest();

      this.tutorService.createTutor(tutorRequest).subscribe({
        next: (response: ApiResponse<TutorResponse>) => {
          this.tutorDialogChange.emit({ isOpen: false, message: 'save', data: response.data });
          this.isLoading = false;
        },
        error: (error: ApiError) => {
          if (error.statusCode === 409 && error.message.includes('email_already_exists')) {
            this.tutorForm.controls.email.setErrors({ exists: { field: 'correo electrónico' } });
          } else if (error.statusCode === 409 && error.message.includes('phone_number_already_exists')) {
            this.tutorForm.controls.phoneNumber.setErrors({ exists: { field: 'número de teléfono' } });
          } else if (error.statusCode === 409 && error.message.includes('employee_code_already_exists')) {
            this.tutorForm.controls.employeeCode.setErrors({ exists: { field: 'código de empleado' } });
          } else if (error.statusCode === 500 && error.message.includes('email_sending_failed')) {
            this.showToast('error', 'Error', 'Fallo al enviar el correo de verificación, intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Error al crear el tutor, intente más tarde');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.tutorForm.markAllAsTouched();
    }
  }

  updateTutor() {
    if (this.tutorForm.valid && this.selectedTutor) {
      this.isLoading = true;
      const tutorRequest: TutorRequest = this.buildTutorRequest();

      this.tutorService.updateTutor(this.selectedTutor.tutorId, tutorRequest).subscribe({
        next: (response: ApiResponse<TutorResponse>) => {
          this.tutorDialogChange.emit({ isOpen: false, message: 'edit', data: response.data });
          this.isLoading = false;
        },
        error: (error: ApiError) => {
          if (error.statusCode === 404 && error.message.includes('tutor_not_found')) {
            this.showToast('warn', 'Tutor no encontrado', 'El tutor que intentó actualizar ya no existe en el sistema');
          } else if (error.statusCode === 409 && error.message.includes('email_already_exists')) {
            this.tutorForm.controls.email.setErrors({ exists: { field: 'correo electrónico' } });
          } else if (error.statusCode === 409 && error.message.includes('phone_number_already_exists')) {
            this.tutorForm.controls.phoneNumber.setErrors({ exists: { field: 'número de teléfono' } });
          } else if (error.statusCode === 409 && error.message.includes('employee_code_already_exists')) {
            this.tutorForm.controls.employeeCode.setErrors({ exists: { field: 'código de empleado' } });
          } else if (error.statusCode === 500 && error.message.includes('email_sending_failed')) {
            this.showToast('error', 'Error', 'Fallo al enviar el correo de verificación, intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Error al actualizar el tutor, intente más tarde');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.tutorForm.markAllAsTouched();
    }
  }

  buildTutorRequest(): TutorRequest {
    const formValues = this.tutorForm.value;
    return {
      employeeCode: formValues.employeeCode!,
      name: formValues.name!,
      firstSurname: formValues.firstSurname!,
      secondSurname: formValues.secondSurname!,
      email: formValues.email!,
      phoneNumber: formValues.phoneNumber!,
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
