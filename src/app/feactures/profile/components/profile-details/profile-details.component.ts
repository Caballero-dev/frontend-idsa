import { CommonModule, formatDate } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../utils/form.utils';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UpdatePasswordRequest } from '../../models/UpdatePassword.model';
import { ProfileService } from '../../services/profile.service';
import { ApiError } from '../../../../core/models/ApiError.model';
import { AuthService } from '../../../../auth/services/auth.service';
import { Role } from '../../../../core/models/Role.enum';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextComponent, ReactiveFormsModule, MessageModule, ToastModule],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss',
  providers: [MessageService],
})
export class ProfileDetailsComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private messageService: MessageService = inject(MessageService);
  private authService: AuthService = inject(AuthService);
  public profileService: ProfileService = inject(ProfileService);

  Role = Role;
  formUtils = FormUtils;
  viewMyProfile: boolean = true;
  errorUpdatePassword: boolean = false;
  loading: boolean = false;

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

  getCreadtedAt(fecha: string): string {
    return formatDate(fecha, 'dd/MM/yyyy hh:mm a', 'en');
  }

  getHelpTextPassword(): string | null {
    return this.updatePasswordForm.errors && this.updatePasswordForm.controls.confirmPassword.touched
      ? 'Las contraseñas no son iguales'
      : null;
  }

  updatePassword(): void {
    if (this.updatePasswordForm.valid) {
      this.loading = true;
      const updatePasswordRequest: UpdatePasswordRequest = this.getUpdatePasswordForm();

      this.profileService.updatePassword(updatePasswordRequest).subscribe({
        next: () => {
          this.showToast('success', 'Contraseña actualizada', 'La contraseña ha sido actualizada correctamente');
          this.errorUpdatePassword = false;
          this.loading = false;
          this.updatePasswordForm.reset();
        },
        error: (error: ApiError) => {
          if (error.statusCode === 404 && error.message.includes('user_not_found')) {
            this.authService.logout();
          } else if (error.message.includes('current_password_incorrect')) {
            this.showToast('error', 'Error', 'La contraseña actual es incorrecta');
          } else if (error.message.includes('new_password_equal_to_current')) {
            this.showToast('error', 'Error', 'La nueva contraseña no puede ser igual a la contraseña actual');
          }
          this.loading = false;
          this.errorUpdatePassword = true;
        },
      });
    } else {
      this.errorUpdatePassword = true;
      this.updatePasswordForm.markAllAsTouched();
    }
  }

  getUpdatePasswordForm(): UpdatePasswordRequest {
    return {
      currentPassword: this.updatePasswordForm.value.password as string,
      newPassword: this.updatePasswordForm.value.newPassword as string,
    };
  }

  showToast(severity: 'success' | 'error' | 'info', summary: string, detail: string): void {
    this.messageService.add({
      severity,
      icon: this.getToastIcon(severity),
      summary,
      detail,
      life: 5000,
    });
  }

  private getToastIcon(severity: 'success' | 'error' | 'info'): string {
    switch (severity) {
      case 'success':
        return 'pi pi-check-circle';
      case 'error':
        return 'pi pi-times-circle';
      default:
        return 'pi pi-info-circle';
    }
  }
}
