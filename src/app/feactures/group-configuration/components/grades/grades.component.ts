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
import { FormUtils } from '../../../../utils/form.utils';
import { Grade, GradeRequest } from '../../models/grade.model';
import { GradeTestService } from '../../tests/grade-test.service';

@Component({
  selector: 'app-grades',
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
  templateUrl: './grades.component.html',
  styleUrl: './grades.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class GradesComponent implements OnInit {
  searchGradeValue: string = '';
  isLoading: boolean = true;
  gradeDialogVisible: boolean = false;
  isCreateGrade: boolean = true;

  cols: Column[] = [{ field: 'name', header: 'Nombre', sortable: true }];
  grades!: Grade[];
  selectedGrade: Grade | null = null;

  tableUtils = TableUtils;
  formUtils = FormUtils;

  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private fb: FormBuilder = inject(FormBuilder);
  private gradeTestService = inject(GradeTestService);

  gradeForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        Validators.pattern(this.formUtils.onlyLettersPattern),
      ],
    ],
  });

  ngOnInit(): void {
    this.loadGrades();
  }

  loadGrades(): void {
    this.grades = this.gradeTestService.getData();
    this.isLoading = false;
  }

  saveOrUpdateGrade(): void {
    if (this.isCreateGrade) {
      this.saveGrade();
    } else {
      this.updateGrade();
    }
  }

  saveGrade(): void {
    if (this.gradeForm.valid) {

      let gradeRequest: GradeRequest = this.getGradeFormData();

      let grade: Grade = {
        gradeId: Math.random(),
        name: gradeRequest.name,
      };

      this.grades = [...this.grades, grade];
      this.clearGradeForm();
      this.showToast('success', 'Grado creado', 'El grado ha sido creado correctamente');
    } else {
      this.gradeForm.markAllAsTouched();
    }
  }

  updateGrade(): void {
    if (this.gradeForm.valid && this.selectedGrade) {
      let gradesRequest: GradeRequest = this.getGradeFormData();

      let grade: Grade = {
        gradeId: this.selectedGrade.gradeId,
        name: gradesRequest.name,
      };

      this.grades = this.grades.map((g: Grade) => (g.gradeId === grade.gradeId ? grade : g));
      this.clearGradeForm();
      this.showToast('success', 'Grado actualizado', 'El grado ha sido actualizado correctamente');
    } else {
      this.gradeForm.markAllAsTouched();
    }
  }

  editGrade(grade: Grade): void {
    this.selectedGrade = grade;
    this.isCreateGrade = false;
    this.gradeForm.patchValue({ name: grade.name });
    this.gradeDialogVisible = true;
  }

  deleteGrade(grade: Grade): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar el grado seleccionado?<br><br>Nombre: ${grade.name}`,
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
        this.grades = this.grades.filter((g: Grade) => g.gradeId !== grade.gradeId);
        this.showToast('success', 'Grado eliminado', 'El grado ha sido eliminado correctamente');
      },
      reject: () => {
        this.showToast('error', 'Eliminación cancelada', 'Has cancelado la eliminación del grado');
      },
    });
  }

  closeDialog(): void {
    this.clearGradeForm();
    this.showToast('error', 'Operación cancelada', 'Has cancelado la operación');
  }

  clearGradeForm(): void {
    this.gradeDialogVisible = false;
    this.gradeForm.reset();
    this.selectedGrade = null;
    this.isCreateGrade = true;
  }

  getGradeFormData(): GradeRequest {
    return {
      name: this.gradeForm.value.name as string,
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
