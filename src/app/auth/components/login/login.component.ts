import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormUtils } from '../../../utils/form.utils';
import { CommonModule } from '@angular/common';
import { InputTextComponent } from '../../../shared/components/input-text/input-text.component';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ApiError } from '../../../core/models/ApiError.model';
import { LoginRequest } from '../../models/Login.model';
import { ResendEmailComponent } from '../resend-email/resend-email.component';

enum LoginState {
  INITIAL = 'INITIAL',
  UNVERIFIED_EMAIL = 'UNVERIFIED_EMAIL',
  RESEND_EMAIL = 'RESEND_EMAIL',
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextComponent,
    ToastModule,
    ResendEmailComponent,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  private messageService: MessageService = inject(MessageService);
  formUtils = FormUtils;
  loginState = LoginState.INITIAL;
  LoginState = LoginState;
  loading = false;

  loginForm = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
        Validators.pattern(this.formUtils.emailPattern),
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(this.formUtils.passwordPattern),
      ],
    ],
  });

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/panel/inicio']);
    }
  }

  login(): void {
    if (this.loginForm.valid) {
      this.loading = true;

      let loginRequest: LoginRequest = this.getLoginFormData();

      this.authService.login(loginRequest).subscribe({
        next: () => {
          this.router.navigate(['/panel/inicio']);
        },
        error: (error: ApiError) => {
          if (error.message.includes('unverified_email')) {
            // this.showToast('error', 'Error', 'Correo electrónico no verificado');
            this.loginState = LoginState.UNVERIFIED_EMAIL;
          } else if (error.message.includes('account_inactive')) {
            this.showToast('error', 'Error', 'Cuenta de usuario deshabilitada');
          } else if (error.message.includes('registration_incomplete')) {
            this.showToast(
              'error',
              'Error',
              'La verificación de tu cuenta no se realizó correctamente. Por favor, contacta al administrador del sistema.'
            );
          } else if (error.message.includes('authentication_failed')) {
            this.showToast('error', 'Error', 'Autenticación fallida');
          } else if (error.message.includes('invalid_credentials')) {
            this.showToast('error', 'Error', 'Credenciales inválidas');
          } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
            this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
          }
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  forgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  resendEmail(): void {
    this.loginState = LoginState.RESEND_EMAIL;
  }

  resetLoginState(): void {
    this.loginState = LoginState.INITIAL;
  }

  getLoginFormData(): LoginRequest {
    return {
      email: this.loginForm.value.email as string,
      password: this.loginForm.value.password as string,
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
