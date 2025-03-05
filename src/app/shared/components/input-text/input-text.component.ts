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
  @Input() type: 'onlyLetters' | 'onlyNumbers' | 'email' | 'password' | 'text' | 'all' = 'all';
  @Input() inputId: string = '';
  @Input() label: string = '';
  @Input() labelPosition: 'top' | 'left' = 'top';
  @Input() customFormControl: FormControl = new FormControl();
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() maxLength: number | null = null;
  @Input() minLength: number | null = null;
  @Input() variant: 'filled' | 'outlined' = 'outlined';
  @Input({ required: false }) size: 'small' | 'large' = 'small';
  @Input() helpText: string | null = null;

  formUtils = FormUtils;
  showPassword: boolean = false;

  ngOnInit(): void {
    if (this.disabled) {
      this.customFormControl.disable();
    } else {
      this.customFormControl.enable();
    }
  }

  getClassContainerInput(): string {
    if (this.labelPosition === 'top') {
      return 'flex flex-col gap-2';
    } else {
      return 'grid gap-2 grid-cols-12';
    }
  }

  getClassLabel(): string {
    if (this.labelPosition === 'top') {
      return '';
    } else {
      return 'flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0';
    }
  }

  getClassInput(): string {
    if (this.labelPosition === 'top') {
      return 'flex flex-col gap-2';
    } else {
      return 'col-span-12 md:col-span-10';
    }
  }

  getAriaDescribedBy(): string | null {
    const ids: string[] = [];

    if (this.helpText) {
      ids.push(`${this.inputId}-help`);
    }

    if (this.formUtils.isValidField(this.customFormControl)) {
      ids.push(`${this.inputId}-error`);
    }

    return ids ? ids.join(' ') : null;
  }
}
