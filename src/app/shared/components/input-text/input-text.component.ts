import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormUtils } from '../../../utils/form.utils';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { StyleClass } from 'primeng/styleclass';

@Component({
  selector: 'idsa-input-text',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, StyleClass],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
})
export class InputTextComponent {
  @Input() inputId: string = '';
  @Input() label: string = '';
  @Input() customFormControl: FormControl = new FormControl();
  @Input() placeholder: string = '';
  @Input() required: boolean = false; // verificar si es necesario o colocarlo en el formControl
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() maxLength: number | null = null;
  @Input() minLength: number | null = null;
  @Input() variant: 'filled' | 'outlined' = 'outlined';
  @Input({ required: false }) size: 'small' | 'large' | 'small' = 'small';
  // @Input() className: string | null = null;
  @Input() helpText: string | null = null;
  @Input() type: 'onlyLetters' | 'onlyNumbers' | 'email' | 'password' | 'text' | 'all' = 'all';

  formUtils = FormUtils;

  ngOnInit() {
    if (this.disabled ) {
      this.customFormControl.disable();
    } else {
      this.customFormControl.enable();
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
