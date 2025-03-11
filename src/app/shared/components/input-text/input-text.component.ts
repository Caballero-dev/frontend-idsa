import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormUtils } from '../../../utils/form.utils';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'idsa-input-text',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
})
export class InputTextComponent implements OnInit {
  @Input() type:
    | 'onlyLetters'
    | 'onlyNumbers'
    | 'alphanumeric'
    | 'alphanumericUpperCase'
    | 'email'
    | 'password'
    | 'text'
    | 'all' = 'all';
  @Input() inputId: string = '';
  @Input() label: string = '';
  @Input() labelFontSize: 'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' = 'text-xl';
  @Input() labelPosition: 'top' | 'left' = 'top';
  @Input() customFormControl: FormControl = new FormControl();
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false; // Disabled mejor manejarlo desde el formGroup del padre
  @Input() readonly: boolean = false;
  @Input() maxLength: number | null = null;
  @Input() minLength: number | null = null;
  @Input() variant: 'filled' | 'outlined' = 'outlined';
  @Input({ required: false }) size: 'small' | 'large' = 'small';
  @Input() helpText: string | null = null;
  @Input() helpTextType: 'error' | 'info' = 'info';

  formUtils = FormUtils;
  showPassword: boolean = false;

  ngOnInit(): void {}

  getClassContainerDiv(): string {
    if (this.labelPosition === 'top') {
      return 'flex flex-col gap-2';
    } else {
      return 'grid grid-cols-12';
    }
  }

  getClassLabel(): string {
    if (this.labelPosition === 'top') {
      return this.labelFontSize;
    } else {
      return 'flex items-center col-span-12 md:col-span-4 ' + this.labelFontSize;
    }
  }

  getClassContainerInput(): string {
    if (this.labelPosition === 'top') {
      return 'flex flex-col gap-2';
    } else {
      return 'flex flex-col gap-2 col-span-12 md:col-span-8';
    }
  }

  getAriaDescribedBy(): string | null {
    const ids: string[] = [];

    if (this.helpText) {
      ids.push(`${this.inputId}-help`);
    }

    if (this.formUtils.isInvalidValidField(this.customFormControl)) {
      ids.push(`${this.inputId}-error`);
    }

    return ids ? ids.join(' ') : null;
  }
}
