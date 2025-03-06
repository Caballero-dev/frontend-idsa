import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../utils/form.utils';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextComponent, ReactiveFormsModule, MessageModule, ToastModule],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss',
  providers: [MessageService],
})
export class ProfileDetailsComponent implements OnInit {
  viewMyProfile: boolean = true;
  viewUpdatePassword: boolean = false;
  errorUpdatePassword: boolean = false;
  formUtils = FormUtils;

  fb: FormBuilder = inject(FormBuilder);
  messageService: MessageService = inject(MessageService);

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
      this.messageToast(
        'success',
        'pi pi-check',
        true,
        'pi pi-times',
        false,
        'Contraseña actualizada',
        'La contraseña ha sido actualizada correctamente',
        3000
      );
      this.errorUpdatePassword = false;
      this.updatePasswordForm.reset();
    } else {
      this.errorUpdatePassword = true;
      this.updatePasswordForm.markAllAsTouched();
    }
  }

  messageToast(
    severity?: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast',
    icon?: string,
    closable?: boolean,
    closeIcon?: string,
    sticky?: boolean,
    summary?: string,
    detail?: string,
    life?: number
  ): void {
    this.messageService.add({
      severity: severity,
      icon: icon,
      closable: closable,
      closeIcon: closeIcon,
      sticky: sticky,
      summary: summary,
      detail: detail,
      life: life,
    });
  }
}
