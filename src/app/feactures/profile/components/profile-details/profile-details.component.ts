import { CommonModule, formatDate } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../utils/form.utils';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserProfileResponse } from '../../models/UserProfile.model';
import { UpdatePasswordRequest } from '../../models/UpdatePassword.model';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextComponent, ReactiveFormsModule, MessageModule, ToastModule],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss',
  providers: [MessageService],
})
export class ProfileDetailsComponent implements OnInit {
  viewMyProfile: boolean = true;
  errorUpdatePassword: boolean = false;
  // Simulación de carga de datos de usuario (get url: email)
  user: UserProfileResponse = {
    userId: '1',
    name: 'John',
    firstSurname: 'Doe',
    secondSurname: 'Jr',
    email: 'john.doe@gamil.com',
    phone: '1234567890',
    roleName: 'Administrador',
    createdAt: '2024-05-30T15:15:45',
  };

  formUtils = FormUtils;
  private fb: FormBuilder = inject(FormBuilder);
  private messageService: MessageService = inject(MessageService);

  updatePasswordForm = this.fb.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(this.formUtils.passwordPattern),
        ],
      ],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(this.formUtils.passwordPattern),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(this.formUtils.passwordPattern),
        ],
      ],
    },
    {
      validators: [this.formUtils.isFieldOneEqualFieldTwo('newPassword', 'confirmPassword')],
    }
  );

  ngOnInit(): void {}

  getCreadtedAt(): string {
    return formatDate(this.user.createdAt, 'dd/MM/yyyy hh:mm a', 'en');
  }

  getHelpTextPassword(): string | null {
    return this.updatePasswordForm.errors && this.updatePasswordForm.controls.confirmPassword.touched
      ? 'Las contraseñas no son iguales'
      : null;
  }

  updatePassword(): void {
    if (this.updatePasswordForm.valid) {
      // En la respuesta verificar la actualización correcta
      let updatePasswordRequest: UpdatePasswordRequest = this.getUpdatePasswordForm();
      this.showToast('success', 'Contraseña actualizada', 'La contraseña ha sido actualizada correctamente');
      this.errorUpdatePassword = false;
      this.updatePasswordForm.reset();
    } else {
      this.errorUpdatePassword = true;
      this.updatePasswordForm.markAllAsTouched();
    }
  }

  getUpdatePasswordForm(): UpdatePasswordRequest {
    return {
      password: this.updatePasswordForm.value.password as string,
      newPassword: this.updatePasswordForm.value.newPassword as string,
    };
  }

  showToast(severity: 'success' | 'error' | 'info', summary: string, detail: string): void {
    this.messageService.add({
      severity,
      icon:
        severity === 'success'
          ? 'pi pi-check-circle'
          : severity === 'error'
            ? 'pi pi-times-circle'
            : 'pi pi-info-circle',
      summary,
      detail,
      life: 3000,
    });
  }
}
