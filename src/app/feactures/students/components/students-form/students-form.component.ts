import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilter } from 'primeng/keyfilter';

@Component({
  selector: 'students-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, InputTextModule, KeyFilter, ButtonModule],
  templateUrl: './students-form.component.html',
  styleUrl: './students-form.component.css',
})
export class StudentsFormComponent implements OnInit {
  @Input() studentDialog: boolean = false;
  @Output() defaultChangeStudentDialog = new EventEmitter<{ isOpen: boolean; message: string }>();
  studentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.studentForm = this.fb.group({
      studentId: [''],
      name: [''],
      paternalSurname: [''],
      maternalSurname: [''],
      email: [''],
      phoneNumber: [''],
    });
  }

  ngOnInit() {}

  closeDialog() {
    this.defaultChangeStudentDialog.emit({ isOpen: false, message: 'close' });
  }

  saveStudent() {
    console.log(this.studentForm.value);
    this.defaultChangeStudentDialog.emit({ isOpen: false, message: 'save' });
  }
}
