import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

import { GroupConfigurationService } from '../../../services/group-configuration.service';
import { CampusService } from '../../../services/campus.service';
import { SpecialtyService } from '../../../services/specialty.service';
import { ModalityService } from '../../../services/modality.service';
import { GradeService } from '../../../services/grade.service';
import { GroupService } from '../../../services/group.service';
import { GenerationService } from '../../../services/generation.service';
import { TutorService } from '../../../../tutors/services/tutor.service';

import { ApiError } from '../../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../../core/models/ApiResponse.model';

import { DialogState } from '../../../../../shared/types/dialog.types';
import { FormUtils } from '../../../../../utils/form.utils';

import { InputSelectComponent } from '../../../../../shared/components/input-select/input-select.component';

import { GroupConfigurationRequest, GroupConfigurationResponse } from '../../../models/group-configuration.model';
import { CampusResponse } from '../../../models/campus.model';
import { SpecialtyResponse } from '../../../models/specialty.model';
import { ModalityResponse } from '../../../models/modality.model';
import { GradeResponse } from '../../../models/grade.model';
import { GroupResponse } from '../../../models/group.model';
import { GenerationResponse } from '../../../models/generation.model';
import { TutorResponse } from '../../../../tutors/models/tutor.model';

@Component({
  selector: 'groups-configuration-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, DialogModule, ToastModule, InputSelectComponent],
  templateUrl: './groups-configuration-form.component.html',
  styleUrl: './groups-configuration-form.component.scss',
  providers: [MessageService],
})
export class GroupsConfigurationFormComponent implements OnInit, AfterViewInit {
  @Input() isGroupConfigurationDialogVisible: boolean = false;
  @Input() isCreateGroupConfiguration: boolean = true;
  @Input() selectedGroupConfiguration: GroupConfigurationResponse | null = null;
  @Output() groupConfigurationDialogChange: EventEmitter<DialogState<GroupConfigurationResponse>> = new EventEmitter<
    DialogState<GroupConfigurationResponse>
  >();

  private fb: FormBuilder = inject(FormBuilder);
  private groupConfigurationService: GroupConfigurationService = inject(GroupConfigurationService);
  private campusService: CampusService = inject(CampusService);
  private specialtyService: SpecialtyService = inject(SpecialtyService);
  private modalityService: ModalityService = inject(ModalityService);
  private gradeService: GradeService = inject(GradeService);
  private groupService: GroupService = inject(GroupService);
  private generationService: GenerationService = inject(GenerationService);
  private tutorService: TutorService = inject(TutorService);
  private messageService: MessageService = inject(MessageService);

  isLoading: boolean = false;
  formUtils = FormUtils;

  tutors: TutorResponse[] | null = null;
  campuses: CampusResponse[] | null = null;
  specialties: SpecialtyResponse[] | null = null;
  modalities: ModalityResponse[] | null = null;
  grades: GradeResponse[] | null = null;
  groups: GroupResponse[] | null = null;
  generations: GenerationResponse[] | null = null;

  groupConfigurationForm = this.fb.group({
    tutor: new FormControl<TutorResponse | null>(null, [Validators.required]),
    campus: new FormControl<CampusResponse | null>(null, [Validators.required]),
    specialty: new FormControl<SpecialtyResponse | null>(null, [Validators.required]),
    modality: new FormControl<ModalityResponse | null>(null, [Validators.required]),
    grade: new FormControl<GradeResponse | null>(null, [Validators.required]),
    group: new FormControl<GroupResponse | null>(null, [Validators.required]),
    generation: new FormControl<GenerationResponse | null>(null, [Validators.required]),
  });

  ngOnInit(): void {
    this.loadFormData();
  }

  ngAfterViewInit(): void {
    if (this.selectedGroupConfiguration) {
      this.setFormValues(this.selectedGroupConfiguration);
    }
  }

  private loadFormData(): void {
    this.loadTutors();
    this.loadCampuses();
    this.loadSpecialties();
    this.loadModalities();
    this.loadGrades();
    this.loadGroups();
    this.loadGenerations();
  }

  loadTutors(): void {
    this.tutors = null;
    this.tutorService.getAllTutors().subscribe({
      next: (response: ApiResponse<TutorResponse[]>) => {
        this.tutors = response.data;
      },
      error: () => {
        this.tutors = [];
        this.showToast('error', 'Error', 'Error al cargar tutores');
      },
    });
  }

  loadCampuses(): void {
    this.campuses = null;
    this.campusService.getAllCampuses().subscribe({
      next: (response: ApiResponse<CampusResponse[]>) => {
        this.campuses = response.data;
      },
      error: () => {
        this.campuses = [];
        this.showToast('error', 'Error', 'Error al cargar campus');
      },
    });
  }

  loadSpecialties(): void {
    this.specialties = null;
    this.specialtyService.getAllSpecialties().subscribe({
      next: (response: ApiResponse<SpecialtyResponse[]>) => {
        this.specialties = response.data;
      },
      error: () => {
        this.specialties = [];
        this.showToast('error', 'Error', 'Error al cargar especialidades');
      },
    });
  }

  loadModalities(): void {
    this.modalities = null;
    this.modalityService.getAllModalities().subscribe({
      next: (response: ApiResponse<ModalityResponse[]>) => {
        this.modalities = response.data;
      },
      error: () => {
        this.modalities = [];
        this.showToast('error', 'Error', 'Error al cargar modalidades');
      },
    });
  }

  loadGrades(): void {
    this.grades = null;
    this.gradeService.getAllGrades().subscribe({
      next: (response: ApiResponse<GradeResponse[]>) => {
        this.grades = response.data;
      },
      error: () => {
        this.grades = [];
        this.showToast('error', 'Error', 'Error al cargar grados');
      },
    });
  }

  loadGroups(): void {
    this.groups = null;
    this.groupService.getAllGroups().subscribe({
      next: (response: ApiResponse<GroupResponse[]>) => {
        this.groups = response.data;
      },
      error: () => {
        this.groups = [];
        this.showToast('error', 'Error', 'Error al cargar grupos');
      },
    });
  }

  loadGenerations(): void {
    this.generations = null;
    this.generationService.getAllGenerations().subscribe({
      next: (response: ApiResponse<GenerationResponse[]>) => {
        this.generations = response.data;
      },
      error: () => {
        this.generations = [];
        this.showToast('error', 'Error', 'Error al cargar generaciones');
      },
    });
  }

  setFormValues(groupConfiguration: GroupConfigurationResponse): void {
    this.groupConfigurationForm.patchValue({
      tutor: groupConfiguration.tutor,
      campus: groupConfiguration.campus,
      specialty: groupConfiguration.specialty,
      modality: groupConfiguration.modality,
      grade: groupConfiguration.grade,
      group: groupConfiguration.group,
      generation: groupConfiguration.generation,
    });
  }

  closeDialog(): void {
    this.groupConfigurationDialogChange.emit({ isOpen: false, message: 'close', data: null });
  }

  saveOrUpdateGroupConfiguration(): void {
    if (this.isCreateGroupConfiguration) {
      this.createGroupConfiguration();
    } else {
      this.updateGroupConfiguration();
    }
  }

  createGroupConfiguration(): void {
    if (this.groupConfigurationForm.valid) {
      this.isLoading = true;
      const groupConfigurationRequest: GroupConfigurationRequest = this.buildGroupConfigurationRequest();

      this.groupConfigurationService.createGroupConfiguration(groupConfigurationRequest).subscribe({
        next: (response: ApiResponse<GroupConfigurationResponse>) => {
          this.groupConfigurationDialogChange.emit({ isOpen: false, message: 'save', data: response.data });
          this.isLoading = false;
        },
        error: (error: ApiError) => {
          if (error.statusCode === 409 && error.message.includes('group_configuration_already_exists')) {
            this.showToast('error', 'Error', 'Ya existe una configuración con los mismos parámetros');
          } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
            this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
          } else {
            this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.groupConfigurationForm.markAllAsTouched();
    }
  }

  updateGroupConfiguration(): void {
    if (this.groupConfigurationForm.valid && this.selectedGroupConfiguration) {
      this.isLoading = true;
      const groupConfigurationRequest: GroupConfigurationRequest = this.buildGroupConfigurationRequest();

      this.groupConfigurationService
        .updateGroupConfiguration(this.selectedGroupConfiguration.groupConfigurationId, groupConfigurationRequest)
        .subscribe({
          next: (response: ApiResponse<GroupConfigurationResponse>) => {
            this.groupConfigurationDialogChange.emit({ isOpen: false, message: 'edit', data: response.data });
            this.isLoading = false;
          },
          error: (error: ApiError) => {
            if (error.statusCode === 404 && error.message.includes('group_configuration_not_found')) {
              this.showToast(
                'error',
                'Configuración no encontrada',
                'La configuración que intentó actualizar ya no existe en el sistema'
              );
            } else if (error.statusCode === 409 && error.message.includes('group_configuration_already_exists')) {
              this.showToast('error', 'Error', 'Ya existe una configuración con los mismos parámetros');
            } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
              this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
            } else {
              this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
            }
            this.isLoading = false;
          },
        });
    } else {
      this.groupConfigurationForm.markAllAsTouched();
    }
  }

  buildGroupConfigurationRequest(): GroupConfigurationRequest {
    const formValues = this.groupConfigurationForm.value;
    return {
      tutor: formValues.tutor!,
      campus: formValues.campus!,
      specialty: formValues.specialty!,
      modality: formValues.modality!,
      grade: formValues.grade!,
      group: formValues.group!,
      generation: formValues.generation!,
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
