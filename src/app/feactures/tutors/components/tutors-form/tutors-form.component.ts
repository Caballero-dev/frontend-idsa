import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';

@Component({
  selector: 'tutors-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, InputTextModule, KeyFilterModule, ButtonModule],
  templateUrl: './tutors-form.component.html',
  styleUrl: './tutors-form.component.scss',
})
export class TutorsFormComponent {
  @Input() tutorDialog: boolean = false;
  @Output() defaultChangeTutorDialog = new EventEmitter<{ isOpen: boolean; message: string }>();
  tutorForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.tutorForm = this.fb.group({
      employeeNumber: [''],
      name: [''],
      paternalSurname: [''],
      maternalSurname: [''],
      email: [''],
      phoneNumber: [''],
    });
  }

  closeDialog() {
    this.defaultChangeTutorDialog.emit({ isOpen: false, message: 'close' });
  }

  saveTutor() {
    this.defaultChangeTutorDialog.emit({ isOpen: false, message: 'save' });
  }
}
