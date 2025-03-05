import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormUtils } from '../../../utils/form.utils';
import { CommonModule } from '@angular/common';
import { InputTextComponent } from '../../../shared/components/input-text/input-text.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ButtonModule, InputTextComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);
  formUtils = FormUtils;

  loginForm = this.fb.group({
    email: [
      '',
      // { value: '', disabled: true }, // Configuración inicial del estado disabled
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

  ngOnInit(): void {}

  login(): void {
    if (this.loginForm.valid) {
      console.log('Credenciales', this.loginForm.value);
      this.router.navigate(['./panel']);
    } else {
      console.log('No se puede acceder al panel');
      this.loginForm.markAllAsTouched();
    }
  }
}
