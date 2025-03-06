import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../utils/form.utils';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextComponent, ReactiveFormsModule],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss',
})
export class ProfileDetailsComponent implements OnInit {
  viewMyProfile: boolean = true;
  viewUpdatePassword: boolean = false;
  formUtils = FormUtils;

  fb: FormBuilder = inject(FormBuilder);

  updatePasswordForm = this.fb.group(
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
      newPassword: [
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
      validators: [this.formUtils.isFieldOneEqualFieldTwo('newPassword', 'confirmPassword')],
    }
  );

  ngOnInit(): void {}

  updatePassword(): void {
    if (this.updatePasswordForm.valid) {
      console.log('Contraseña actualizada', this.updatePasswordForm.value);
    } else {
      console.log('No se puede actualizar la contraseña', this.updatePasswordForm.errors);
      this.updatePasswordForm.markAllAsTouched();
    }
  }
}
