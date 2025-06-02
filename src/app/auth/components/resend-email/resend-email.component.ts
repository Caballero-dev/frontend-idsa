import { Component, inject, Input } from '@angular/core';
import { ResendEmailRequest, ResendEmailType } from '../../models/ResendEmail.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormUtils } from '../../../utils/form.utils';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextComponent } from '../../../shared/components/input-text/input-text.component';
import { ToastModule } from 'primeng/toast';
import { ApiError } from '../../../core/models/ApiError.model';

@Component({
  selector: 'app-resend-email',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ButtonModule, InputTextComponent, ToastModule],
  templateUrl: './resend-email.component.html',
  providers: [MessageService],
})
export class ResendEmailComponent {
  @Input({ required: true }) resendEmailType!: ResendEmailType;
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  private messageService: MessageService = inject(MessageService);
  formUtils = FormUtils;
  loading = false;
  isEmailSent = false;

  resendEmailForm = this.fb.group({
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

  resendEmail(): void {
    if (this.resendEmailForm.valid) {
      this.loading = true;
      const resendEmailRequest: ResendEmailRequest = this.getResendEmailFormData();
      this.authService.resendEmail(resendEmailRequest).subscribe({
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
      this.resendEmailForm.markAllAsTouched();
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  getResendEmailFormData(): ResendEmailRequest {
    return {
      email: this.resendEmailForm.value.email as string,
      // type: this.resendEmailType,
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
