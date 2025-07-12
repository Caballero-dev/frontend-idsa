import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

import { StudentService } from '../../services/student.service';

import { ApiError } from '../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../core/models/ApiResponse.model';

import { DialogState } from '../../../../shared/types/dialog.types';
import { FormUtils } from '../../../../utils/form.utils';

import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';

import { StudentRequest, StudentResponse } from '../../models/student.model';

@Component({
  selector: 'students-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, DialogModule, ToastModule, InputTextComponent],
  templateUrl: './students-form.component.html',
  styleUrl: './students-form.component.scss',
  providers: [MessageService],
})
export class StudentsFormComponent implements OnInit, AfterViewInit {
  @Input() isStudentDialogVisible: boolean = false;
  @Input() isCreateStudent: boolean = true;
  @Input() selectedStudent: StudentResponse | null = null;
  @Input() groupId: string | null = null;
  @Output() studentDialogChange: EventEmitter<DialogState<StudentResponse>> = new EventEmitter<
    DialogState<StudentResponse>
  >();

  private fb: FormBuilder = inject(FormBuilder);
  private studentService: StudentService = inject(StudentService);
  private messageService: MessageService = inject(MessageService);

  isLoading: boolean = false;
  formUtils = FormUtils;

  studentForm = this.fb.group({
    studentCode: [
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

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.selectedStudent) {
      this.setFormValues(this.selectedStudent);
    }
  }

  setFormValues(student: StudentResponse): void {
    this.studentForm.patchValue({
      studentCode: student.studentCode,
      name: student.name,
      firstSurname: student.firstSurname,
      secondSurname: student.secondSurname,
      phoneNumber: student.phoneNumber,
    });
  }

  closeDialog(): void {
    this.studentDialogChange.emit({ isOpen: false, message: 'close', data: null });
  }

  saveOrUpdateStudent(): void {
    if (this.isCreateStudent) {
      this.createStudent();
    } else {
      this.updateStudent();
    }
  }

  createStudent(): void {
    if (this.studentForm.valid && this.groupId) {
      this.isLoading = true;
      const studentRequest: StudentRequest = this.buildStudentRequest();

      this.studentService.createStudent(this.groupId, studentRequest).subscribe({
        next: (response: ApiResponse<StudentResponse>) => {
          this.studentDialogChange.emit({ isOpen: false, message: 'save', data: response.data });
          this.isLoading = false;
        },
        error: (error: ApiError) => {
          if (error.statusCode === 409 && error.message.includes('student_code_already_exists')) {
            this.studentForm.controls.studentCode.setErrors({ exists: { field: 'matrícula' } });
          } else if (error.statusCode === 409 && error.message.includes('phone_number_already_exists')) {
            this.studentForm.controls.phoneNumber.setErrors({ exists: { field: 'número de teléfono' } });
          } else if (error.statusCode === 409 && error.message.includes('group_configuration_not_found')) {
            this.showToast(
              'warn',
              'Grupo no encontrado',
              'El grupo que intentó crear el estudiante ya no existe en el sistema'
            );
          } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
            this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.studentForm.markAllAsTouched();
    }
  }

  updateStudent(): void {
    if (this.studentForm.valid && this.selectedStudent) {
      this.isLoading = true;
      const studentRequest: StudentRequest = this.buildStudentRequest();

      this.studentService.updateStudent(this.selectedStudent.studentId, studentRequest).subscribe({
        next: (response: ApiResponse<StudentResponse>) => {
          this.studentDialogChange.emit({ isOpen: false, message: 'edit', data: response.data });
          this.isLoading = false;
        },
        error: (error: ApiError) => {
          if (error.statusCode === 404 && error.message.includes('student_not_found')) {
            this.showToast(
              'warn',
              'Estudiante no encontrado',
              'El estudiante que intentó actualizar ya no existe en el sistema'
            );
          } else if (error.statusCode === 409 && error.message.includes('student_code_already_exists')) {
            this.studentForm.controls.studentCode.setErrors({ exists: { field: 'número de matrícula' } });
          } else if (error.statusCode === 409 && error.message.includes('phone_number_already_exists')) {
            this.studentForm.controls.phoneNumber.setErrors({ exists: { field: 'número de teléfono' } });
          } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
            this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.studentForm.markAllAsTouched();
    }
  }

  buildStudentRequest(): StudentRequest {
    const formValues = this.studentForm.value;
    return {
      studentCode: formValues.studentCode!,
      name: formValues.name!,
      firstSurname: formValues.firstSurname!,
      secondSurname: formValues.secondSurname!,
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
