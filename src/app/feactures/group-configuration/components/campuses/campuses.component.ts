import { Component, inject, OnInit } from '@angular/core';
import { Column, TableUtils } from '../../../utils/table.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Campus, CampusRequest } from '../../models/campus.model';
import { CampusesTestService } from '../../tests/campuses-test.service';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { FormUtils } from '../../../../utils/form.utils';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-campuses',
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
  templateUrl: './campuses.component.html',
  styleUrl: './campuses.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class CampusesComponent implements OnInit {
  searchCampusValue: string = '';
  isLoading: boolean = true;
  campusDialogVisible: boolean = false;
  isCreateCampus: boolean = true;

  cols: Column[] = [{ field: 'name', header: 'Nombre', sortable: true }];
  campuses!: Campus[];
  selectedCampus: Campus | null = null;

  tableUtils = TableUtils;
  formUtils = FormUtils;

  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private campusTestService = inject(CampusesTestService);
  private fb: FormBuilder = inject(FormBuilder);

  campusForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(this.formUtils.onlyLettersPattern),
      ],
    ],
  });

  ngOnInit(): void {
    this.loadCampuses();
  }

  loadCampuses(): void {
    this.campuses = this.campusTestService.getData();
    this.isLoading = false;
  }

  saveOrUpdateCampus(): void {
    if (this.isCreateCampus) {
      this.saveCampus();
    } else {
      this.updateCampus();
    }
  }

  saveCampus(): void {
    if (this.campusForm.valid) {
      let campusRequest: CampusRequest = this.getCampusFormData();

      let campus: Campus = {
        campusId: Math.random(),
        name: campusRequest.name,
      };

      this.campuses = [...this.campuses, campus];
      this.campusDialogVisible = false;
      this.clearCampusForm();
      this.showToast('success', 'Campus creado', 'El campus ha sido creado correctamente');
    } else {
      this.campusForm.markAllAsTouched();
    }
  }

  updateCampus(): void {
    if (this.campusForm.valid && this.selectedCampus) {
      let campusRequest: CampusRequest = this.getCampusFormData();

      // en la petición a la api se envia el id por la url
      let campus: Campus = {
        campusId: this.selectedCampus.campusId,
        name: campusRequest.name,
      };

      this.campuses = this.campuses.map((c: Campus) => (c.campusId === campus.campusId ? campus : c));
      this.campusDialogVisible = false;
      this.clearCampusForm();
      this.showToast('success', 'Campus actualizado', 'El campus ha sido actualizado correctamente');
    } else {
      this.campusForm.markAllAsTouched();
    }
  }

  editCampus(campus: Campus): void {
    this.selectedCampus = campus;
    this.isCreateCampus = false;
    this.campusForm.patchValue({
      name: campus.name,
    });
    this.campusDialogVisible = true;
  }

  deleteCampus(campus: Campus): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro que deseas eliminar el campus seleccionado?<br><br>Nombre: ${campus.name}`,
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
        this.campuses = this.campuses.filter((c: Campus) => c.campusId !== campus.campusId);
        this.showToast('success', 'Campus eliminado', 'El campus ha sido eliminado correctamente');
      },
      reject: () => {
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación del campus');
      },
    });
  }

  closeDialog(): void {
    this.campusDialogVisible = false;
    this.clearCampusForm();
    this.showToast('error', 'Operación cancelada', 'Has cancelado la operación');
  }

  clearCampusForm(): void {
    this.campusForm.reset();
    this.selectedCampus = null;
    this.isCreateCampus = true;
  }

  getCampusFormData(): CampusRequest {
    return {
      name: this.campusForm.value.name as string,
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
