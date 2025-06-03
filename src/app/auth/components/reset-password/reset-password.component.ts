import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormUtils } from '../../../utils/form.utils';
import { CommonModule } from '@angular/common';
import { InputTextComponent } from '../../../shared/components/input-text/input-text.component';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ResetPasswordRequest } from '../../models/ResetPassword.model';
import { ApiError } from '../../../core/models/ApiError.model';
import { ResendEmailComponent } from '../resend-email/resend-email.component';

enum ResetPasswordState {
  INITIAL = 'INITIAL',
  VALID_TOKEN = 'VALID_TOKEN',
  RESET_SUCCESS = 'RESET_SUCCESS',
  INVALID_TOKEN = 'INVALID_TOKEN',
  ACCOUNT_INACTIVE = 'ACCOUNT_INACTIVE',
  NEW_ACCOUNT_UNVERIFIED = 'NEW_ACCOUNT_UNVERIFIED',
  EMAIL_CHANGE_UNVERIFIED = 'EMAIL_CHANGE_UNVERIFIED',
  RESEND_EMAIL = 'RESEND_EMAIL',
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ButtonModule, InputTextComponent, ResendEmailComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  providers: [MessageService],
})
export class ResetPasswordComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  private messageService: MessageService = inject(MessageService);
  formUtils = FormUtils;
  token: string = '';
  resetPasswordState = ResetPasswordState.INITIAL;
  ResetPasswordState = ResetPasswordState;
  loading = false;

  resetPasswordForm = this.fb.group(
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
      validators: [this.formUtils.isFieldOneEqualFieldTwo('password', 'confirmPassword')],
    }
  );

  ngOnInit(): void {
    this.getTokenFromUrlParams();
  }

  getTokenFromUrlParams(): void {
    this.route.queryParamMap.subscribe((params) => {
      if (params.get('token')) {
        this.token = params.get('token')!;
        this.resetPasswordState = ResetPasswordState.VALID_TOKEN;
      } else {
        this.router.navigate(['/auth/login']);
      }
    });
  }

  submitPasswordReset(): void {
    if (this.resetPasswordForm.valid) {
      this.loading = true;
      const resetPasswordRequest: ResetPasswordRequest = this.getResetPasswordFormData();
      this.authService.resetPassword(resetPasswordRequest).subscribe({
        next: () => {
          this.resetPasswordState = ResetPasswordState.RESET_SUCCESS;
          this.loading = false;
        },
        error: (error: ApiError) => {
          if (
            (error.statusCode === 401 || error.statusCode === 400) &&
            (error.message.includes('invalid_reset_token') || error.message.includes('expired_reset_token'))
          ) {
            this.resetPasswordState = ResetPasswordState.INVALID_TOKEN;
          } else if (error.statusCode === 403 && error.message.includes('new_account_unverified')) {
            this.resetPasswordState = ResetPasswordState.NEW_ACCOUNT_UNVERIFIED;
          } else if (error.statusCode === 403 && error.message.includes('email_change_unverified')) {
            this.resetPasswordState = ResetPasswordState.EMAIL_CHANGE_UNVERIFIED;
          } else if (error.statusCode === 403 && error.message.includes('account_inactive')) {
            this.resetPasswordState = ResetPasswordState.ACCOUNT_INACTIVE;
          } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
            this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
          }
          this.loading = false;
        },
      });
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }

  requestResendEmail(isForgotPassword: boolean): void {
    if (isForgotPassword) {
      this.router.navigate(['/auth/forgot-password']);
    } else {
      this.resetPasswordState = ResetPasswordState.RESEND_EMAIL;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  getHelpTextPassword(): string | null {
    return this.resetPasswordForm.errors && this.resetPasswordForm.controls.confirmPassword.touched
      ? 'Las contraseñas no son iguales'
      : null;
  }

  getResetPasswordFormData(): ResetPasswordRequest {
    return {
      token: this.token,
      newPassword: this.resetPasswordForm.value.password as string,
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
