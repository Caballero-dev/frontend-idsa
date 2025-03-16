import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../utils/form.utils';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { SelectChangeEvent } from 'primeng/select';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';
import { InputSelectComponent } from '../../../../shared/components/input-select/input-select.component';
import { EmitterDialogUser, Role, User, UserRequest } from '../../models/user.model';

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
  @Input() selectedUser: User | null = null;
  @Output() defaultChangeUserDialog: EventEmitter<EmitterDialogUser> = new EventEmitter<EmitterDialogUser>();

  roles: Role[] = [
    { roleId: 'ROLE_TUTOR', roleName: 'Tutor' },
    { roleId: 'ROLE_ESTUDIANTE', roleName: 'Estudiante' },
  ];
  selectedRole: Role | null = null;
  formUtils = FormUtils;
  isEditPassword: boolean = false;
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
    phoneNumber: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(this.formUtils.onlyNumbersPattern),
      ],
    ],
    role: new FormControl<Role | null>(null, [Validators.required]),
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

  ngOnInit() {
    if (this.selectedUser) {
      this.setValuesToForm(this.selectedUser);
    }
  }

  setValuesToForm(user: User) {
    this.selectedRole = user.role;
    this.userForm.patchValue({
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      name: user.name,
      firstSurname: user.firstSurname,
      secondSurname: user.secondSurname,
    });

    if (user.role.roleId === 'ROLE_ESTUDIANTE') {
      this.userForm.patchValue({ studentCode: user.key });
      this.userForm.controls.studentCode.enable();
    } else {
      this.userForm.patchValue({ employeeCode: user.key });
      this.userForm.controls.employeeCode.enable();
    }
  }

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
    this.isEditPassword = event.checked;
    const passwordControl = this.userForm.controls.password;
    if (this.isEditPassword) {
      passwordControl.enable();
    } else {
      passwordControl.disable();
    }
  }

  closeDialog() {
    this.defaultChangeUserDialog.emit({ isOpen: false, message: 'close', user: null });
  }

  saveOrUpdateUser() {
    if (this.isCreateUser) {
      this.saveUser();
    } else {
      this.editUser();
    }
  }

  saveUser() {
    if (this.userForm.valid) {
      // esto se envia a la api
      let userRequest: UserRequest = this.getUserData();

      // Simula la respuesta del servidor
      let user: User = {
        userId: Math.floor(Math.random() * 1000),
        ...userRequest,
        createdAt: new Date().toLocaleString(),
        isActive: true,
      };

      this.defaultChangeUserDialog.emit({ isOpen: false, message: 'save', user: user });
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  editUser() {
    if (this.userForm.valid && this.selectedUser) {
      // en la api pasar en la url isUpdatePassword si se actualiza la contraseña y id
      let userRequest: UserRequest = this.getUserData();
      if (this.isEditPassword) {
        userRequest.password = this.userForm.value.password as string;
      }

      // Simulación de respuesta
      let user: User = {
        userId: this.selectedUser.userId,
        ...userRequest,
        createdAt: this.selectedUser?.createdAt,
        isActive: this.selectedUser.isActive,
      };

      this.defaultChangeUserDialog.emit({ isOpen: false, message: 'edit', user: user });
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  getUserData(): UserRequest {
    return {
      role: this.selectedRole as Role,
      email: this.userForm.value.email as string,
      name: this.userForm.value.name as string,
      firstSurname: this.userForm.value.firstSurname as string,
      secondSurname: this.userForm.value.secondSurname as string,
      phoneNumber: this.userForm.value.phoneNumber as string,
      key:
        this.selectedRole?.roleId === 'ROLE_TUTOR'
          ? (this.userForm.value.employeeCode as string)
          : (this.userForm.value.studentCode as string),
    };
  }
}
