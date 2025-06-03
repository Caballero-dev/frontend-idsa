import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ApiError } from '../../../core/models/ApiError.model';
import { ToastModule } from 'primeng/toast';
import { ResendEmailComponent } from '../resend-email/resend-email.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

enum ConfirmEmailChangeState {
  INITIAL = 'INITIAL',
  VALID_TOKEN = 'VALID_TOKEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  ALREADY_VERIFIED = 'ALREADY_VERIFIED',
  VERIFIED = 'VERIFIED',
  ACCOUNT_INACTIVE = 'ACCOUNT_INACTIVE',
  RESEND_EMAIL = 'RESEND_EMAIL',
}

@Component({
  selector: 'app-confirm-email-change',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, ToastModule, ResendEmailComponent, SpinnerComponent],
  templateUrl: './confirm-email-change.component.html',
  styleUrl: './confirm-email-change.component.scss',
  providers: [MessageService],
})
export class ConfirmEmailChangeComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  private messageService: MessageService = inject(MessageService);
  token: string = '';
  confirmEmailChangeState = ConfirmEmailChangeState.INITIAL;
  ConfirmEmailChangeState = ConfirmEmailChangeState;
  loading = false;
  isError = false;

  ngOnInit(): void {
    this.getTokenFromUrlParams();
    this.verifyEmailChange();
  }

  getTokenFromUrlParams(): void {
    this.route.queryParamMap.subscribe((params) => {
      if (params.get('token')) {
        this.token = params.get('token')!;
        this.confirmEmailChangeState = ConfirmEmailChangeState.VALID_TOKEN;
      } else {
        this.goToLogin();
      }
    });
  }

  verifyEmailChange(): void {
    if (this.token !== '') {
      this.loading = true;
      this.authService.confirmEmailChange(this.token).subscribe({
        next: () => {
          this.confirmEmailChangeState = ConfirmEmailChangeState.VERIFIED;
          this.loading = false;
        },
        error: (error: ApiError) => {
          if (
            (error.statusCode === 401 || error.statusCode === 400) &&
            (error.message.includes('invalid_email_change_token') ||
              error.message.includes('expired_email_change_token'))
          ) {
            this.confirmEmailChangeState = ConfirmEmailChangeState.INVALID_TOKEN;
          } else if (error.statusCode === 400 && error.message.includes('verified_email')) {
            this.confirmEmailChangeState = ConfirmEmailChangeState.ALREADY_VERIFIED;
          } else if (error.statusCode === 403 && error.message.includes('account_inactive')) {
            this.confirmEmailChangeState = ConfirmEmailChangeState.ACCOUNT_INACTIVE;
          } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
            this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
            this.isError = true;
          } else {
            this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
            this.isError = true;
          }
          this.loading = false;
        },
      });
    } else {
      this.goToLogin();
    }
  }

  requestResendEmail(): void {
    this.confirmEmailChangeState = ConfirmEmailChangeState.RESEND_EMAIL;
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
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
