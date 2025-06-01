import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormUtils } from '../../../utils/form.utils';
import { CommonModule } from '@angular/common';
import { InputTextComponent } from '../../../shared/components/input-text/input-text.component';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ForgotPasswordRequest } from '../../models/ForgotPassword.model';
import { ApiError } from '../../../core/models/ApiError.model';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ButtonModule, InputTextComponent, ToastModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  providers: [MessageService],
})
export class ForgotPasswordComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  private messageService: MessageService = inject(MessageService);
  formUtils = FormUtils;
  loading = false;
  isEmailSent = false;

  forgotPasswordForm = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
        Validators.pattern(this.formUtils.emailPattern),
      ],
    ],
  });

  ngOnInit(): void {}

  requestPasswordReset(): void {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      const forgotPasswordRequest: ForgotPasswordRequest = this.getForgotPasswordFormData();

      this.authService.requestPasswordReset(forgotPasswordRequest).subscribe({
        next: () => {
          this.isEmailSent = true;
          this.loading = false;
        },
        error: (error: ApiError) => {
          if (error.status === 'Unknown Error' && error.statusCode === 0) {
            this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
          }
          this.isEmailSent = false;
          this.loading = false;
        },
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/auth/login']);
  }

  getForgotPasswordFormData(): ForgotPasswordRequest {
    return {
      email: this.forgotPasswordForm.value.email as string,
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
