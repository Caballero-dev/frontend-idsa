import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { EmitterDialogTutor, Tutor } from '../../models/tutors.model';
import { FormUtils } from '../../../../utils/form.utils';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';

@Component({
  selector: 'tutors-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextComponent],
  templateUrl: './tutors-form.component.html',
  styleUrl: './tutors-form.component.scss',
})
export class TutorsFormComponent implements OnInit {
  @Input() tutorDialog: boolean = false;
  @Input() isCreateTutor: boolean = true;
  @Input() selectedTutor: Tutor | null = null;
  @Output() defaultChangeTutorDialog: EventEmitter<EmitterDialogTutor> = new EventEmitter<EmitterDialogTutor>();

  formUtils = FormUtils;
  fb: FormBuilder = inject(FormBuilder);

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

  ngOnInit() {
    if (this.selectedTutor) {
      this.setValuesForm(this.selectedTutor);
    }
  }

  setValuesForm(tutor: Tutor) {
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
    this.defaultChangeTutorDialog.emit({ isOpen: false, message: 'close', tutor: null });
  }

  saveOrUpdateTutor() {
    if (this.isCreateTutor) {
      this.saveTutor();
    } else {
      this.editTutor();
    }
  }

  saveTutor() {
    if (this.tutorForm.valid) {
      let tutor: Tutor = {
        tutorId: Math.floor(Math.random() * 100),
        ...this.getTutorData(),
      };

      this.defaultChangeTutorDialog.emit({ isOpen: false, message: 'save', tutor: tutor });
    } else {
      this.tutorForm.markAllAsTouched();
    }
  }

  editTutor() {
    if (this.tutorForm.valid && this.selectedTutor) {
      let tutor: Tutor = {
        tutorId: this.selectedTutor.tutorId,
        ...this.getTutorData(),
      };

      this.defaultChangeTutorDialog.emit({ isOpen: false, message: 'edit', tutor: tutor });
    } else {
      this.tutorForm.markAllAsTouched();
    }
  }

  getTutorData() {
    return {
      employeeCode: this.tutorForm.value.employeeCode as string,
      name: this.tutorForm.value.name as string,
      firstSurname: this.tutorForm.value.firstSurname as string,
      secondSurname: this.tutorForm.value.secondSurname as string,
      email: this.tutorForm.value.email as string,
      phoneNumber: this.tutorForm.value.phoneNumber as string,
    };
  }
}
