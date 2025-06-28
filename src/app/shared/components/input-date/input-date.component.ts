import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DatePicker } from 'primeng/datepicker';

import { FormUtils } from '../../../utils/form.utils';

@Component({
  selector: 'idsa-input-date',
  standalone: true,
  imports: [DatePicker, FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './input-date.component.html',
  styleUrl: './input-date.component.scss',
})
export class InputDateComponent implements OnInit {
  @Input() type: 'date' = 'date';
  @Input() inputId: string = '';
  @Input() label: string = '';
  @Input() labelFontSize: 'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' = 'text-xl';
  @Input() labelPosition: 'top' | 'left' = 'top';
  @Input() customFormControl: FormControl = new FormControl();
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() readonly: boolean = false;
  @Input() variant: 'filled' | 'outlined' = 'outlined';
  @Input({ required: false }) size: 'small' | 'large' = 'small';
  @Input() helpText: string | null = null;
  @Input() helpTextType: 'error' | 'info' = 'info';

  @Output() onSelectDate: EventEmitter<void> = new EventEmitter<void>();

  formUtils = FormUtils;

  ngOnInit(): void {}

  onDateSelect() {
    this.onSelectDate.emit();
  }

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
