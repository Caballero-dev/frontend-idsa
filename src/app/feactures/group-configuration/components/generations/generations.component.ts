import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Column, TableUtils } from '../../../utils/table.utils';
import { Generation, GenerationRequest } from '../../models/generation.model';
import { FormUtils } from '../../../../utils/form.utils';
import { GenerationTestService } from '../../tests/generation-test.service';
import { DatePickerModule } from 'primeng/datepicker';
import { formatDate } from '@angular/common';
import { InputDateComponent } from '../../../../shared/components/input-date/input-date.component';

@Component({
  selector: 'app-generations',
  standalone: true,
  imports: [
    ButtonModule,
    ToolbarModule,
    InputGroupModule,
    InputTextModule,
    TableModule,
    DialogModule,
    ToastModule,
    DatePickerModule,
    ConfirmDialogModule,
    FormsModule,
    ReactiveFormsModule,
    InputDateComponent,
  ],
  templateUrl: './generations.component.html',
  styleUrl: './generations.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class GenerationsComponent implements OnInit {
  searchGenerationValue: string = '';
  isLoading: boolean = true;
  generationDialogVisible: boolean = false;
  isCreateGeneration: boolean = true;

  cols: Column[] = [
    { field: 'yearStart', header: 'Año de inicio', sortable: true },
    { field: 'yearEnd', header: 'Año de fin', sortable: true },
  ];
  generations!: Generation[];
  selectedGeneration: Generation | null = null;
  minDate: Date = new Date('2021-01-01');
  startDateGen: Date | null = null;

  tableUtils = TableUtils;
  formUtils = FormUtils;

  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private fb: FormBuilder = inject(FormBuilder);
  private generationTestService = inject(GenerationTestService);

  generationForm = this.fb.group({
    yearStart: new FormControl<Date | null>(null, [Validators.required]),
    yearEnd: new FormControl<Date | null>({ value: null, disabled: true }, [Validators.required]),
  });

  ngOnInit(): void {
    this.loadGenerations();
  }

  loadGenerations(): void {
    this.generations = this.generationTestService.getData();
    this.isLoading = false;
  }

  changeYearStart(event: Date): void {
    this.generationForm.controls.yearEnd.enable();
    this.startDateGen = event;
    if (this.generationForm.value.yearEnd && event > this.generationForm.value.yearEnd) {
      this.generationForm.controls.yearEnd.setValue(null);
    }
  }

  saveOrUpdateGeneration(): void {
    if (this.isCreateGeneration) {
      this.saveGeneration();
    } else {
      this.updateGeneration();
    }
  }

  saveGeneration(): void {
    if (this.generationForm.valid) {
      let generationRequest: GenerationRequest = this.getGenerationFormData();

      let generation: Generation = {
        generationId: Math.random(),
        yearStart: generationRequest.yearStart,
        yearEnd: generationRequest.yearEnd,
      };

      this.generations = [...this.generations, generation];
      this.clearGenerationForm();
      this.showToast('success', 'Generación creada', 'La generación ha sido creada correctamente');
    } else {
      this.generationForm.markAllAsTouched();
    }
  }

  updateGeneration(): void {
    if (this.generationForm.valid && this.selectedGeneration) {
      let generationRequest: GenerationRequest = this.getGenerationFormData();

      let generation: Generation = {
        generationId: this.selectedGeneration.generationId,
        yearStart: generationRequest.yearStart,
        yearEnd: generationRequest.yearEnd,
      };

      this.generations = this.generations.map(
        (g: Generation): Generation => (g.generationId === generation.generationId ? generation : g)
      );
      this.clearGenerationForm();
      this.showToast('success', 'Generación actualizada', 'La generación ha sido actualizada correctamente');
    } else {
      this.generationForm.markAllAsTouched();
    }
  }

  editGeneration(generation: Generation): void {
    this.selectedGeneration = generation;
    this.isCreateGeneration = false;
    this.startDateGen = new Date(generation.yearStart);
    this.generationForm.controls.yearEnd.enable();
    this.generationForm.patchValue({
      yearStart: new Date(generation.yearStart),
      yearEnd: new Date(generation.yearEnd),
    });
    this.generationDialogVisible = true;
  }

  deleteGeneration(generation: Generation): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar la generación seleccionada?<br><br>Año de inicio: ${generation.yearStart}<br>Año de fin: ${generation.yearEnd}`,
      header: 'Confirmar',
      closable: false,
      closeOnEscape: false,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Aceptar',
      },
      accept: () => {
        this.generations = this.generations.filter((g: Generation) => g.generationId !== generation.generationId);
        this.showToast('success', 'Generación eliminada', 'La generación ha sido eliminada correctamente');
      },
      reject: () => {
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación de la generación');
      },
    });
  }

  closeDialog(): void {
    this.clearGenerationForm();
    this.showToast('error', 'Operación cancelada', 'Has cancelado la operación');
  }

  clearGenerationForm(): void {
    this.generationDialogVisible = false;
    this.startDateGen = null;
    this.generationForm.reset();
    this.generationForm.controls.yearEnd.disable();
    this.selectedGeneration = null;
    this.isCreateGeneration = true;
  }

  getGenerationFormData(): GenerationRequest {
    return {
      yearStart: formatDate(this.generationForm.value.yearStart as Date, 'yyyy-MM-dd', 'en'),
      yearEnd: formatDate(this.generationForm.value.yearEnd as Date, 'yyyy-MM-dd', 'en'),
    };
  }

  showToast(severity: 'success' | 'error' | 'info', summary: string, detail: string): void {
    this.messageService.add({
      severity,
      icon:
        severity === 'success'
          ? 'pi pi-check-circle'
          : severity === 'error'
            ? 'pi pi-times-circle'
            : 'pi pi-info-circle',
      summary,
      detail,
      life: 3000,
    });
  }
}
