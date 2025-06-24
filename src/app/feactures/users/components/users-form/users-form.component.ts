import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { SelectChangeEvent } from 'primeng/select';
import { ToastModule } from 'primeng/toast';

import { RoleService } from '../../services/role.service';
import { UserService } from '../../services/user.service';

import { ApiError } from '../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../core/models/ApiResponse.model';
import { Role } from '../../../../core/models/Role.enum';

import { DialogState } from '../../../../shared/types/dialog.types';
import { FormUtils } from '../../../../utils/form.utils';

import { InputSelectComponent } from '../../../../shared/components/input-select/input-select.component';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';

import { RoleResponse } from '../../models/Role.model';
import { UserRequest, UserResponse } from '../../models/user.model';

@Component({
  selector: 'users-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    ToastModule,
    InputSelectComponent,
    InputTextComponent,
  ],
  templateUrl: './users-form.component.html',
  styleUrl: './users-form.component.scss',
  providers: [MessageService],
})
export class UsersFormComponent implements OnInit, AfterViewInit {
  @Input() isUserDialogVisible: boolean = false;
  @Input() isCreateUser: boolean = true;
  @Input() selectedUser: UserResponse | null = null;
  @Output() userDialogChange: EventEmitter<DialogState<UserResponse>> = new EventEmitter<DialogState<UserResponse>>();

  private fb: FormBuilder = inject(FormBuilder);
  private roleService: RoleService = inject(RoleService);
  private userService: UserService = inject(UserService);
  private messageService: MessageService = inject(MessageService);

  isLoading: boolean = false;
  isEditPassword: boolean = false;

  selectedRole: RoleResponse | null = null;
  roles!: RoleResponse[];
  formUtils = FormUtils;

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
    role: new FormControl<RoleResponse | null>(null, [Validators.required]),
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

  ngOnInit(): void {
    this.loadRoles();
  }

  ngAfterViewInit(): void {
    if (this.selectedUser) {
      this.setFormValues(this.selectedUser);
    }
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (response: ApiResponse<RoleResponse[]>) => {
        this.roles = response.data;
      },
    });
  }

  setFormValues(user: UserResponse): void {
    this.selectedRole = user.role;
    this.userForm.patchValue({
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      name: user.name,
      firstSurname: user.firstSurname,
      secondSurname: user.secondSurname,
    });
    if (user.role.roleId === Role.TUTOR) {
      this.userForm.controls.employeeCode.setValue(user.key);
      this.userForm.controls.employeeCode.enable();
    }
  }

  onRoleChange(event: SelectChangeEvent): void {
    this.selectedRole = event.value;
    const employeeCodeControl = this.userForm.controls.employeeCode;
    if (this.selectedRole?.roleId === Role.TUTOR) {
      employeeCodeControl.enable();
    } else {
      employeeCodeControl.disable();
    }
  }

  onToggleEditPassword(event: CheckboxChangeEvent): void {
    this.isEditPassword = event.checked;
    const passwordControl = this.userForm.controls.password;
    if (this.isEditPassword) {
      passwordControl.enable();
    } else {
      passwordControl.disable();
    }
  }

  closeDialog(): void {
    this.userDialogChange.emit({ isOpen: false, message: 'close', data: null });
  }

  saveOrUpdateUser(): void {
    if (this.isCreateUser) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  createUser(): void {
    if (this.userForm.valid) {
      this.isLoading = true;
      const userRequest: UserRequest = this.buildUserRequest();

      this.userService.createUser(userRequest).subscribe({
        next: (response: ApiResponse<UserResponse>) => {
          response.data = {
            ...response.data,
            createdAt: new Date(response.data.createdAt).toLocaleString(),
          };
          this.userDialogChange.emit({ isOpen: false, message: 'save', data: response.data });
          this.isLoading = false;
        },
        error: (error: ApiError) => {
          if (error.statusCode === 409 && error.message.includes('email_already_exists')) {
            this.userForm.controls.email.setErrors({ exists: { field: 'correo electrónico' } });
          } else if (error.statusCode === 409 && error.message.includes('phone_number_already_exists')) {
            this.userForm.controls.phoneNumber.setErrors({ exists: { field: 'número de teléfono' } });
          } else if (error.statusCode === 409 && error.message.includes('key_employee_code_already_exists')) {
            this.userForm.controls.employeeCode.setErrors({ exists: { field: 'código de empleado' } });
          } else if (error.statusCode === 409 && error.message.includes('role_name_not_found')) {
            this.userForm.controls.role.setErrors({ not_found: { field: 'rol' } });
          } else if (error.statusCode === 409 && error.message.includes('role_denied')) {
            this.userForm.controls.role.setErrors({ role_denied: null });
          } else if (error.statusCode === 500 && error.message.includes('email_sending_failed')) {
            this.showToast('error', 'Error', 'Fallo al enviar el correo de verificación, intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Error al crear el usuario, intente más tarde');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  updateUser(): void {
    if (this.userForm.valid && this.selectedUser) {
      this.isLoading = true;
      const userRequest: UserRequest = this.buildUserRequest();

      this.userService.updateUser(this.selectedUser.userId, this.isEditPassword, userRequest).subscribe({
        next: (response: ApiResponse<UserResponse>) => {
          response.data = {
            ...response.data,
            createdAt: new Date(response.data.createdAt).toLocaleString(),
          };
          this.userDialogChange.emit({ isOpen: false, message: 'edit', data: response.data });
          this.isLoading = false;
        },
        error: (error: ApiError) => {
          if (error.statusCode === 404 && error.message.includes('user_not_found')) {
            this.showToast(
              'warn',
              'Usuario no encontrado',
              'El usuario que intentó actualizar ya no existe en el sistema'
            );
          } else if (error.statusCode === 409 && error.message.includes('email_already_exists')) {
            this.userForm.controls.email.setErrors({ exists: { field: 'correo electrónico' } });
          } else if (error.statusCode === 409 && error.message.includes('phone_number_already_exists')) {
            this.userForm.controls.phoneNumber.setErrors({ exists: { field: 'número de teléfono' } });
          } else if (error.statusCode === 409 && error.message.includes('key_employee_code_already_exists')) {
            this.userForm.controls.employeeCode.setErrors({ exists: { field: 'código de empleado' } });
          } else if (error.statusCode === 409 && error.message.includes('role_name_not_found')) {
            this.userForm.controls.role.setErrors({ not_found: { field: 'rol' } });
          } else if (error.statusCode === 409 && error.message.includes('role_denied')) {
            this.userForm.controls.role.setErrors({ role_denied: null });
          } else if (error.statusCode === 500 && error.message.includes('email_sending_failed')) {
            this.showToast('error', 'Error', 'Fallo al enviar el correo de verificación, intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Error al actualizar el usuario, intente más tarde');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  buildUserRequest(): UserRequest {
    const formValues = this.userForm.value;
    return {
      role: this.selectedRole!,
      email: formValues.email!,
      name: formValues.name!,
      firstSurname: formValues.firstSurname!,
      secondSurname: formValues.secondSurname!,
      phoneNumber: formValues.phoneNumber!,
      key: formValues.employeeCode!,
      password: this.isEditPassword ? formValues.password! : undefined,
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
