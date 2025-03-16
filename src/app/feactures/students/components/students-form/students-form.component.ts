import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { EmitterDialogStudent, Student, StudentRequest } from '../../models/student.model';
import { FormUtils } from '../../../../utils/form.utils';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';

@Component({
  selector: 'students-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextComponent],
  templateUrl: './students-form.component.html',
  styleUrl: './students-form.component.scss',
})
export class StudentsFormComponent implements OnInit {
  @Input() studentDialog: boolean = false;
  @Input() isCreateStudent: boolean = true;
  @Input() selectedStudent: Student | null = null;
  @Output() defaultChangeStudentDialog: EventEmitter<EmitterDialogStudent> = new EventEmitter<EmitterDialogStudent>();

  formUtils = FormUtils;
  private fb: FormBuilder = inject(FormBuilder);

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

  ngOnInit() {
    if (this.selectedStudent) {
      this.setValuesForm(this.selectedStudent);
    }
  }

  setValuesForm(student: Student) {
    this.studentForm.setValue({
      studentCode: student.studentCode,
      name: student.name,
      firstSurname: student.firstSurname,
      secondSurname: student.secondSurname,
      email: student.email,
      phoneNumber: student.phoneNumber,
    });
  }

  closeDialog() {
    this.defaultChangeStudentDialog.emit({ isOpen: false, message: 'close', student: null });
  }

  saveOrUpdateStudent() {
    if (this.isCreateStudent) {
      this.saveStudent();
    } else {
      this.updateStudent();
    }
  }

  saveStudent() {
    if (this.studentForm.valid) {
      // Mandar id de grupo por url
      let studentRequest: StudentRequest = this.getStudentFormData();

      // Simula la respuesta del servidor
      let user: Student = {
        studentId: Math.floor(Math.random() * 1000),
        ...studentRequest,
        predictionResult: null,
      };

      this.defaultChangeStudentDialog.emit({ isOpen: false, message: 'save', student: user });
    } else {
      this.studentForm.markAllAsTouched();
    }
  }

  // VERIFICAR QUE FUNCIONE Y QUE SE PUEDA ACTUALIZAR Y EN LA LISTA EN EL CAMPO PROBABILIDAD DE CONSUMO Y TIENE NULL COLOCAR NA
  updateStudent() {
    if (this.studentForm.valid && this.selectedStudent) {
      let studentRequest: StudentRequest = this.getStudentFormData();

      // Simula la respuesta del servidor pasar id por url
      let student: Student = {
        studentId: this.selectedStudent.studentId,
        ...studentRequest,
        predictionResult: this.selectedStudent.predictionResult,
      };

      this.defaultChangeStudentDialog.emit({ isOpen: false, message: 'edit', student: student });
    } else {
      this.studentForm.markAllAsTouched();
    }
  }

  getStudentFormData(): StudentRequest {
    return {
      studentCode: this.studentForm.value.studentCode as string,
      name: this.studentForm.value.name as string,
      firstSurname: this.studentForm.value.firstSurname as string,
      secondSurname: this.studentForm.value.secondSurname as string,
      email: this.studentForm.value.email as string,
      phoneNumber: this.studentForm.value.phoneNumber as string,
    };
  }
}
