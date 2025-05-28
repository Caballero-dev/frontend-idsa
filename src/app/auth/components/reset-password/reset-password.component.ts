import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormUtils } from '../../../utils/form.utils';
import { CommonModule } from '@angular/common';
import { InputTextComponent } from '../../../shared/components/input-text/input-text.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ButtonModule, InputTextComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  formUtils = FormUtils;

  token: string | null = null;
  isTokenValid = false;

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

    if (!this.token) {
      this.isTokenValid = false;
      return;
    }

    // Validar el token (en una aplicación real, harías una llamada a la API para verificar el token)
    // Aquí simulamos que el token es válido si existe
    this.isTokenValid = true;
  }

  getTokenFromUrlParams(): void {
    // Obtener el token de los parámetros de la URL
    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get('token');
    });
  }

  getHelpTextPassword(): string | null {
    return this.resetPasswordForm.errors && this.resetPasswordForm.controls.confirmPassword.touched
      ? 'Las contraseñas no son iguales'
      : null;
  }

  submitPasswordReset(): void {
    if (this.resetPasswordForm.valid) {
      const password = this.resetPasswordForm.get('password')?.value;

      // En una aplicación real, harías una llamada a la API para restablecer la contraseña con el token
      console.log('Enviando nueva contraseña con token', {
        token: this.token,
        password,
      });

      // Ejemplo de cómo podría ser la llamada a la API:
      // this.authService.resetPassword(this.token, password).subscribe({
      //   next: () => {
      //     // Mostrar mensaje de éxito
      //     this.router.navigate(['/auth/login']);
      //   },
      //   error: (error) => {
      //     // Manejar error
      //     console.error('Error al restablecer contraseña', error);
      //   }
      // });

      // Por ahora, simplemente redireccionamos al login
      this.router.navigate(['/auth/login']);
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }

  requestNewResetEmail(): void {
    // En una aplicación real, harías una llamada a la API para solicitar un nuevo correo de restablecimiento
    console.log('Solicitando nuevo correo para restablecer contraseña');

    // Redireccionar a la página de forgot-password
    this.router.navigate(['/auth/forgot-password']);
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
