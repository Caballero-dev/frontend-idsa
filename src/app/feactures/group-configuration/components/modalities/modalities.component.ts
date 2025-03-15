import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';
import { Column, TableUtils } from '../../../utils/table.utils';
import { FormUtils } from '../../../../utils/form.utils';
import { Modality } from '../../models/modality.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ModalityTestService } from '../../tests/modality-test.service';

@Component({
  selector: 'app-modalities',
  standalone: true,
  imports: [
    ButtonModule,
    ToolbarModule,
    InputGroupModule,
    InputTextModule,
    TableModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextComponent,
  ],
  templateUrl: './modalities.component.html',
  styleUrl: './modalities.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class ModalitiesComponent implements OnInit {
  searchModalityValue: string = '';
  isLoading: boolean = true;
  modalityDialogVisible: boolean = false;
  isCreateModality: boolean = true;

  cols: Column[] = [{ field: 'name', header: 'Nombre', sortable: true }];
  modalities!: Modality[];
  selectedModality: Modality | null = null;

  tableUtils = TableUtils;
  formUtils = FormUtils;

  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private fb: FormBuilder = inject(FormBuilder);
  private modalityTestService = inject(ModalityTestService);

  modalityForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(this.formUtils.onlyLettersPattern),
      ],
    ],
  });

  ngOnInit(): void {
    this.loadModalities();
  }

  loadModalities(): void {
    this.modalities = this.modalityTestService.getData();
    this.isLoading = false;
  }

  saveOrUpdateModality(): void {
    if (this.isCreateModality) {
      this.saveModality();
    } else {
      this.updateModality();
    }
  }

  saveModality(): void {
    if (this.modalityForm.valid) {
      let modality: Modality = {
        modalityId: Math.random(),
        name: this.modalityForm.value.name as string,
      };

      this.modalities = [...this.modalities, modality];
      this.modalityDialogVisible = false;
      this.clearModalityForm();
      this.showToast('success', 'Modalidad creada', 'La modalidad ha sido creada correctamente');
    } else {
      this.modalityForm.markAllAsTouched();
    }
  }

  updateModality(): void {
    if (this.modalityForm.valid && this.selectedModality) {
      let modality: Modality = {
        modalityId: this.selectedModality.modalityId,
        name: this.modalityForm.value.name as string,
      };

      this.modalities = this.modalities.map((m: Modality) => (m.modalityId === modality.modalityId ? modality : m));
      this.modalityDialogVisible = false;
      this.clearModalityForm();
      this.showToast('success', 'Modalidad actualizada', 'La modalidad ha sido actualizada correctamente');
    }
  }

  editModality(modality: Modality): void {
    this.selectedModality = modality;
    this.isCreateModality = false;
    this.modalityForm.patchValue({ name: modality.name });
    this.modalityDialogVisible = true;
  }

  deleteModality(modality: Modality): void {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar la modalidad seleccionada?<br><br>Nombre: ${modality.name}`,
      header: 'Confirmar',
      closable: false,
      closeOnEscape: false,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outline: true,
      },
      acceptButtonProps: {
        label: 'Aceptar',
      },
      accept: () => {
        this.modalities = this.modalities.filter((m: Modality) => m.modalityId !== modality.modalityId);
        this.showToast('success', 'Modalidad eliminada', 'La modalidad ha sido eliminada correctamente');
      },
      reject: () => {
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación de la modalidad');
      },
    });
  }

  closeDialog(): void {
    this.modalityDialogVisible = false;
    this.clearModalityForm();
    this.showToast('error', 'Operación cancelada', 'Has cancelado la operación');
  }

  clearModalityForm(): void {
    this.modalityForm.reset();
    this.selectedModality = null;
    this.isCreateModality = true;
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
