import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormUtils } from '../../../utils/form.utils';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectChangeEvent, SelectModule } from 'primeng/select';

@Component({
  selector: 'idsa-input-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectModule],
  templateUrl: './input-select.component.html',
  styleUrl: './input-select.component.scss',
})
export class InputSelectComponent implements OnInit {
  @Input() type: 'valueObject' | 'valueString' = 'valueString';
  @Input() selectId: string = '';
  @Input() label: string = '';
  @Input() labelFontSize: 'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' = 'text-xl';
  @Input() labelPosition: 'top' | 'left' = 'top';
  @Input() customFormControl: FormControl = new FormControl();
  @Input() options: any[] = [];
  @Input() optionLabel: string = '';
  @Input() optionValue: string = '';
  @Input() showClear: boolean = false;
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false; // Disabled mejor manejarlo desde el formGroup del padre
  @Input() readonly: boolean = false;
  @Input() variant: 'filled' | 'outlined' = 'outlined';
  @Input({ required: false }) size: 'small' | 'large' = 'small';
  @Input() helpText: string | null = null;
  @Input() helpTextType: 'error' | 'info' = 'info';

  @Output() onChange: EventEmitter<SelectChangeEvent> = new EventEmitter<SelectChangeEvent>();

  formUtils = FormUtils;

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
      ids.push(`${this.selectId}-help`);
    }

    if (this.formUtils.isInvalidValidField(this.customFormControl)) {
      ids.push(`${this.selectId}-error`);
    }

    return ids ? ids.join(' ') : null;
  }
}
