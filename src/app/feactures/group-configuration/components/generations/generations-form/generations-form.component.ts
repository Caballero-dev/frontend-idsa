import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

import { GenerationService } from '../../../services/generation.service';

import { ApiError } from '../../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../../core/models/ApiResponse.model';

import { DialogState } from '../../../../../shared/types/dialog.types';
import { FormUtils } from '../../../../../utils/form.utils';

import { InputDateComponent } from '../../../../../shared/components/input-date/input-date.component';

import { GenerationRequest, GenerationResponse } from '../../../models/generation.model';

@Component({
  selector: 'generations-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, DialogModule, ToastModule, InputDateComponent],
  templateUrl: './generations-form.component.html',
  styleUrl: './generations-form.component.scss',
  providers: [MessageService],
})
export class GenerationsFormComponent implements OnInit, AfterViewInit {
  @Input() isGenerationDialogVisible: boolean = false;
  @Input() isCreateGeneration: boolean = true;
  @Input() selectedGeneration: GenerationResponse | null = null;
  @Output() generationDialogChange: EventEmitter<DialogState<GenerationResponse>> = new EventEmitter<
    DialogState<GenerationResponse>
  >();

  private fb: FormBuilder = inject(FormBuilder);
  private generationService: GenerationService = inject(GenerationService);
  private messageService: MessageService = inject(MessageService);

  isLoading: boolean = false;
  formUtils = FormUtils;
  minDate: Date = new Date('2020-01-01');
  selectedStartDate: Date | null = null;

  generationForm = this.fb.group({
    startYear: new FormControl<Date | null>(null, [Validators.required]),
    endYear: new FormControl<Date | null>({ value: null, disabled: true }, [Validators.required]),
  });

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.selectedGeneration) {
      this.setFormValues(this.selectedGeneration);
    }
  }

  setFormValues(generation: GenerationResponse): void {
    this.selectedStartDate = new Date(generation.yearStart);
    this.generationForm.controls.endYear.enable();
    this.generationForm.patchValue({
      startYear: new Date(generation.yearStart),
      endYear: new Date(generation.yearEnd),
    });
  }

  onStartYearChange(): void {
    const ctrl = this.generationForm.controls;
    if (ctrl.startYear.valid) {
      this.selectedStartDate = ctrl.startYear.value!;
      ctrl.endYear.enable();
      if (ctrl.endYear.value && this.selectedStartDate > ctrl.endYear.value) {
        ctrl.endYear.setValue(null);
      }
    } else {
      ctrl.endYear.disable();
      ctrl.endYear.setValue(null);
      this.selectedStartDate = null;
    }
  }

  closeDialog(): void {
    this.generationDialogChange.emit({ isOpen: false, message: 'close', data: null });
  }

  saveOrUpdateGeneration(): void {
    if (this.isCreateGeneration) {
      this.createGeneration();
    } else {
      this.updateGeneration();
    }
  }

  createGeneration(): void {
    if (this.generationForm.valid) {
      this.isLoading = true;
      const generationRequest: GenerationRequest = this.buildGenerationRequest();

      this.generationService.createGeneration(generationRequest).subscribe({
        next: (response: ApiResponse<GenerationResponse>) => {
          this.generationDialogChange.emit({ isOpen: false, message: 'save', data: response.data });
          this.isLoading = false;
        },
        error: (error: ApiError) => {
          if (error.statusCode === 409 && error.message.includes('start_end_year_already_exists')) {
            this.showToast(
              'warn',
              'Generación ya existente',
              'Ya existe una generación con la misma fecha de inicio y fin'
            );
          } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
            this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.generationForm.markAllAsTouched();
    }
  }

  updateGeneration(): void {
    if (this.generationForm.valid && this.selectedGeneration) {
      this.isLoading = true;
      const generationRequest: GenerationRequest = this.buildGenerationRequest();

      this.generationService.updateGeneration(this.selectedGeneration.generationId, generationRequest).subscribe({
        next: (response: ApiResponse<GenerationResponse>) => {
          this.generationDialogChange.emit({ isOpen: false, message: 'edit', data: response.data });
          this.isLoading = false;
        },
        error: (error: ApiError) => {
          if (error.statusCode === 404 && error.message.includes('generation_not_found')) {
            this.showToast(
              'warn',
              'Generación no encontrada',
              'La generación que intentó actualizar ya no existe en el sistema'
            );
          } else if (error.statusCode === 409 && error.message.includes('start_end_year_already_exists')) {
            this.showToast(
              'warn',
              'Generación ya existente',
              'Ya existe una generación con el mismo año de inicio y fin'
            );
          } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
            this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.generationForm.markAllAsTouched();
    }
  }

  buildGenerationRequest(): GenerationRequest {
    const formValues = this.generationForm.value;
    return {
      yearStart: formValues.startYear!.toISOString(),
      yearEnd: formValues.endYear!.toISOString(),
    };
  }

  showToast(severity: 'success' | 'error' | 'warn' | 'info', summary: string, detail: string): void {
    this.messageService.add({
      severity,
      icon: this.getToastIcon(severity),
      summary,
      detail,
      life: 5000,
    });
  }

  private getToastIcon(severity: 'success' | 'error' | 'warn' | 'info'): string {
    switch (severity) {
      case 'success':
        return 'pi pi-check-circle';
      case 'error':
        return 'pi pi-times-circle';
      case 'warn':
        return 'pi pi-exclamation-triangle';
      default:
        return 'pi pi-info-circle';
    }
  }
}
