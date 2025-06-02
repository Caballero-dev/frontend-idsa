import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormUtils } from '../../../utils/form.utils';
import { CommonModule } from '@angular/common';
import { InputTextComponent } from '../../../shared/components/input-text/input-text.component';
import { ResendEmailComponent } from '../resend-email/resend-email.component';
import { VerifyEmailRequest } from '../../models/VerifyEmail.model';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ApiError } from '../../../core/models/ApiError.model';

enum VerificationState {
  INITIAL = 'INITIAL',
  VALID_TOKEN = 'VALID_TOKEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  ALREADY_VERIFIED = 'ALREADY_VERIFIED',
  VERIFIED = 'VERIFIED',
  RESEND_EMAIL = 'RESEND_EMAIL',
}

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextComponent,
    ResendEmailComponent,
    ToastModule,
  ],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
  providers: [MessageService],
})
export class VerifyEmailComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  private messageService: MessageService = inject(MessageService);
  formUtils = FormUtils;
  token: string = '';
  verificationState = VerificationState.INITIAL;
  VerificationState = VerificationState;
  loading = false;

  verifyEmailForm = this.fb.group(
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
        this.verificationState = VerificationState.VALID_TOKEN;
      } else {
        this.router.navigate(['/auth/login']);
      }
    });
  }

  verifyEmailAndSetPassword(): void {
    if (this.verifyEmailForm.valid) {
      this.loading = true;
      const verifyEmailRequest: VerifyEmailRequest = this.getVerifyEmailFormData();
      this.authService.verifyEmailAndSetPassword(verifyEmailRequest).subscribe({
        next: () => {
          this.verificationState = VerificationState.VERIFIED;
          this.loading = false;
        },
        error: (error: ApiError) => {
          if (
            (error.statusCode === 401 || error.statusCode === 400) &&
            (error.message.includes('invalid_verification_token') ||
              error.message.includes('expired_verification_token'))
          ) {
            this.verificationState = VerificationState.INVALID_TOKEN;
          } else if (error.statusCode === 400 && error.message.includes('verified_email')) {
            this.verificationState = VerificationState.ALREADY_VERIFIED;
          } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
            this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
          }
          this.loading = false;
        },
      });
    } else {
      this.verifyEmailForm.markAllAsTouched();
    }
  }

  requestResendEmail(): void {
    this.verificationState = VerificationState.RESEND_EMAIL;
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  getHelpTextPassword(): string | null {
    return this.verifyEmailForm.errors && this.verifyEmailForm.controls.confirmPassword.touched
      ? 'Las contraseñas no son iguales'
      : null;
  }

  getVerifyEmailFormData(): VerifyEmailRequest {
    return {
      token: this.token,
      password: this.verifyEmailForm.value.password as string,
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
