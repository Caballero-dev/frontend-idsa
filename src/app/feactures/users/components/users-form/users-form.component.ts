import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../utils/form.utils';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { SelectChangeEvent } from 'primeng/select';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';
import { InputSelectComponent } from '../../../../shared/components/input-select/input-select.component';

interface Role {
  roleId: string;
  roleName: string;
}

@Component({
  selector: 'users-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    CheckboxModule,
    InputTextComponent,
    InputSelectComponent,
  ],
  templateUrl: './users-form.component.html',
  styleUrl: './users-form.component.scss',
})
export class UsersFormComponent implements OnInit {
  @Input() userDialog: boolean = false;
  @Input() isCreateUser: boolean = true;
  @Output() defaultChangeUserDialog = new EventEmitter<{ isOpen: boolean; message: string }>();

  roles: Role[] = [
    { roleId: 'ROLE_TUTOR', roleName: 'Tutor' },
    { roleId: 'ROLE_ESTUDIANTE', roleName: 'Estudiante' },
  ];
  selectedRole: Role | null = null;
  formUtils = FormUtils;
  fb: FormBuilder = inject(FormBuilder);

  userForm = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
        Validators.pattern(this.formUtils.emailPattern),
      ],
    ],
    role: ['', [Validators.required]],
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
    studentCode: [
      { value: '', disabled: true },
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(20),
        Validators.pattern(this.formUtils.alphanumericPattern),
      ],
    ],
    employeeCode: [
      { value: '', disabled: true },
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(20),
        Validators.pattern(this.formUtils.alphanumericPattern),
      ],
    ],
    password: [
      { value: '', disabled: true },
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(this.formUtils.passwordPattern),
      ],
    ],
  });

  ngOnInit() {}

  roleChange(event: SelectChangeEvent) {
    this.selectedRole = event.value;
    const studentCodeControl = this.userForm.controls.studentCode;
    const employeeCodeControl = this.userForm.controls.employeeCode;
    if (this.selectedRole?.roleId === 'ROLE_ESTUDIANTE') {
      studentCodeControl.enable();
      employeeCodeControl.disable();
    } else if (this.selectedRole?.roleId === 'ROLE_TUTOR') {
      employeeCodeControl.enable();
      studentCodeControl.disable();
    } else {
      studentCodeControl.disable();
      employeeCodeControl.disable();
    }
  }

  toggleEditPassword(event: CheckboxChangeEvent) {
    const isEditPassword: boolean = event.checked;
    const passwordControl = this.userForm.controls.password;
    if (isEditPassword) {
      passwordControl.enable();
    } else {
      passwordControl.disable();
    }
  }

  closeDialog() {
    this.defaultChangeUserDialog.emit({ isOpen: false, message: 'close' });
  }

  saveUser() {
    if (this.userForm.valid) {
      this.defaultChangeUserDialog.emit({ isOpen: false, message: 'save' });
    } else {
      console.log(this.userForm.value);
      this.userForm.markAllAsTouched();
    }
  }
}
