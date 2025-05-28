import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormUtils } from '../../../utils/form.utils';
import { CommonModule } from '@angular/common';
import { InputTextComponent } from '../../../shared/components/input-text/input-text.component';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ButtonModule, InputTextComponent],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  formUtils = FormUtils;

  token: string | null = null;
  isTokenValid = false;

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

    if (!this.token) {
      this.isTokenValid = false;
      return;
    }

    // Validate token (in a real app, you would make an API call to verify the token)
    this.isTokenValid = true;
  }

  getTokenFromUrlParams(): void {
    // Get token from URL params
    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get('token');
    });
  }

  getHelpTextPassword(): string | null {
    return this.verifyEmailForm.errors && this.verifyEmailForm.controls.confirmPassword.touched
      ? 'Las contraseñas no son iguales'
      : null;
  }

  submitPasswordReset(): void {
    if (this.verifyEmailForm.valid) {
      const password = this.verifyEmailForm.get('password')?.value;
      // In a real app, you would make an API call to reset the password with the token
      console.log('Enviando nueva contraseña con token', {
        token: this.token,
        password,
      });

      // Redirect to login after successful password reset
      // For now, just redirect
      this.router.navigate(['/auth/login']);
    } else {
      this.verifyEmailForm.markAllAsTouched();
    }
  }

  requestNewVerificationEmail(): void {
    // In a real app, you would make an API call to request a new verification email
    console.log('Solicitando nuevo correo de verificación');

    // You might want to show a success message here
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
