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
import { ConfirmationService, MessageService } from 'primeng/api';
import { Column, TableUtils } from '../../../utils/table.utils';
import { Specialty, SpecialtyRequest } from '../../models/specialty.model';
import { FormUtils } from '../../../../utils/form.utils';
import { SpecialtyTestService } from '../../tests/specialty-test.service';

@Component({
  selector: 'app-specialties',
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
  templateUrl: './specialties.component.html',
  styleUrl: './specialties.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class SpecialtiesComponent implements OnInit {
  searchSpecialtyValue: string = '';
  isLoading: boolean = true;
  specialtyDialogVisible: boolean = false;
  isCreateSpecialty: boolean = true;

  cols: Column[] = [
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'shortName', header: 'Nombre corto', sortable: true },
  ];
  specialties!: Specialty[];
  selectedSpecialty: Specialty | null = null;

  tableUtils = TableUtils;
  formUtils = FormUtils;

  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private fb: FormBuilder = inject(FormBuilder);
  private spceialtyTestService = inject(SpecialtyTestService);

  specialtyForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(this.formUtils.onlyLettersPattern),
      ],
    ],
    shortName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10),
        Validators.pattern(this.formUtils.onlyPlainLettersPattern),
      ],
    ],
  });

  ngOnInit(): void {
    this.loadSpecialties();
  }

  loadSpecialties(): void {
    this.specialties = this.spceialtyTestService.getData();
    this.isLoading = false;
  }

  saveOrUpdateSpecialty(): void {
    if (this.isCreateSpecialty) {
      this.saveSpecialty();
    } else {
      this.updateSpecialty();
    }
  }

  saveSpecialty(): void {
    if (this.specialtyForm.valid) {
      let specialtyRequest: SpecialtyRequest = this.getSpecialtyFormData();

      let specialty: Specialty = {
        specialtyId: Math.random(),
        name: specialtyRequest.name,
        shortName: specialtyRequest.shortName,
      };

      this.specialties = [...this.specialties, specialty];
      this.clearSpecialtyForm();
      this.showToast('success', 'Especialidad creada', 'La especialidad ha sido creada correctamente');
    } else {
      this.specialtyForm.markAllAsTouched();
    }
  }

  updateSpecialty(): void {
    if (this.specialtyForm.valid && this.selectedSpecialty) {
      let specialtyResquest: SpecialtyRequest = this.getSpecialtyFormData();

      let specialty: Specialty = {
        specialtyId: this.selectedSpecialty.specialtyId,
        name: specialtyResquest.name,
        shortName: specialtyResquest.shortName,
      };

      this.specialties = this.specialties.map((s: Specialty) =>
        s.specialtyId === specialty.specialtyId ? specialty : s
      );
      this.clearSpecialtyForm();
      this.showToast('success', 'Especialidad actualizada', 'La especialidad ha sido actualizada correctamente');
    } else {
      this.specialtyForm.markAllAsTouched();
    }
  }

  editSpecialty(specialty: Specialty): void {
    this.selectedSpecialty = specialty;
    this.isCreateSpecialty = false;
    this.specialtyForm.patchValue({
      name: specialty.name,
      shortName: specialty.shortName,
    });
    this.specialtyDialogVisible = true;
  }

  deleteSpecialty(specialty: Specialty): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar la especialidad seleccionada?<br><br>Nombre: ${specialty.name}`,
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
        this.specialties = this.specialties.filter((s: Specialty) => s.specialtyId !== specialty.specialtyId);
        this.showToast('success', 'Especialidad eliminada', 'La especialidad ha sido eliminada correctamente');
      },
      reject: () => {
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación de la especialidad');
      },
    });
  }

  closeDialog(): void {
    this.clearSpecialtyForm();
    this.showToast('error', 'Operación cancelada', 'Has cancelado la operación');
  }

  clearSpecialtyForm(): void {
    this.specialtyDialogVisible = false;
    this.specialtyForm.reset();
    this.selectedSpecialty = null;
    this.isCreateSpecialty = true;
  }

  getSpecialtyFormData(): SpecialtyRequest {
    return {
      name: this.specialtyForm.value.name as string,
      shortName: this.specialtyForm.value.shortName as string,
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
