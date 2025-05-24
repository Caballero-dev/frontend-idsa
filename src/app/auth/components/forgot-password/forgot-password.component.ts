import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormUtils } from '../../../utils/form.utils';
import { CommonModule } from '@angular/common';
import { InputTextComponent } from '../../../shared/components/input-text/input-text.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ButtonModule, InputTextComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);
  formUtils = FormUtils;

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
      console.log('Solicitud enviada', this.forgotPasswordForm.value);
      // Aqui se espera el mensaje de respuesta de la api y muestra un mensaje de exito o error
      // si es exito mostrar el mensaje de que ya se envio el correo y muetsra un boton de volver al login
      // si es error mostrar el mensaje de error
      this.router.navigate(['/auth/login']);
    } else {
      console.log('Formulario inválido');
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/auth/login']);
  }
}
