import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectLazyLoadEvent } from 'primeng/select';
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

interface LazyLoadData<T> {
  currentPage: number;
  totalElements: number;
  hasNext: boolean;
  isLoading: boolean;
  data: T[];
}

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

  tutors: LazyLoadData<TutorResponse> = {
    currentPage: 0,
    totalElements: 0,
    hasNext: false,
    isLoading: false,
    data: [],
  };
  campuses: LazyLoadData<CampusResponse> = {
    currentPage: 0,
    totalElements: 0,
    hasNext: false,
    isLoading: false,
    data: [],
  };
  specialties: LazyLoadData<SpecialtyResponse> = {
    currentPage: 0,
    totalElements: 0,
    hasNext: false,
    isLoading: false,
    data: [],
  };
  modalities: LazyLoadData<ModalityResponse> = {
    currentPage: 0,
    totalElements: 0,
    hasNext: false,
    isLoading: false,
    data: [],
  };
  grades: LazyLoadData<GradeResponse> = {
    currentPage: 0,
    totalElements: 0,
    hasNext: false,
    isLoading: false,
    data: [],
  };
  groups: LazyLoadData<GroupResponse> = {
    currentPage: 0,
    totalElements: 0,
    hasNext: false,
    isLoading: false,
    data: [],
  };
  generations: LazyLoadData<GenerationResponse> = {
    currentPage: 0,
    totalElements: 0,
    hasNext: false,
    isLoading: false,
    data: [],
  };

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
    this.loadTutors(this.tutors.currentPage, 20);
    this.loadCampuses(this.campuses.currentPage, 20);
    this.loadSpecialties(this.specialties.currentPage, 20);
    this.loadModalities(this.modalities.currentPage, 20);
    this.loadGrades(this.grades.currentPage, 20);
    this.loadGroups(this.groups.currentPage, 20);
    this.loadGenerations(this.generations.currentPage, 20);
  }

  onLazyLoadTutors(event: SelectLazyLoadEvent): void {
    if (this.tutors.isLoading) return;
    const { first, last } = event;
    if (this.tutors.hasNext && last >= this.tutors.data.length) {
      this.tutors.currentPage++;
      this.loadTutors(this.tutors.currentPage, 20);
    }
  }

  loadTutors(page: number, size: number): void {
    this.tutors.isLoading = true;
    this.tutorService.getAllTutors(page, size).subscribe({
      next: (response: ApiResponse<TutorResponse[]>) => {
        if (response.pageInfo!.page === 0) {
          this.tutors.data = [...response.data];
          this.tutors.currentPage = 0;
        } else {
          this.tutors.data = [...this.tutors.data, ...response.data];
        }
        this.tutors.hasNext = response.pageInfo!.hasNext;
        this.tutors.totalElements = response.pageInfo!.totalElements;
        this.tutors.isLoading = false;
      },
      error: () => {
        this.tutors.data = [];
        this.tutors.isLoading = false;
        this.showToast('error', 'Error', 'Error al cargar tutores');
      },
    });
  }

  onLazyLoadCampuses(event: SelectLazyLoadEvent): void {
    if (this.campuses.isLoading) return;
    const { first, last } = event;
    if (this.campuses.hasNext && last >= this.campuses.data.length) {
      this.campuses.currentPage++;
      this.loadCampuses(this.campuses.currentPage, 20);
    }
  }

  loadCampuses(page: number, size: number): void {
    this.campuses.isLoading = true;
    this.campusService.getAllCampuses(page, size).subscribe({
      next: (response: ApiResponse<CampusResponse[]>) => {
        if (response.pageInfo!.page === 0) {
          this.campuses.data = [...response.data];
          this.campuses.currentPage = 0;
        } else {
          this.campuses.data = [...this.campuses.data, ...response.data];
        }
        this.campuses.hasNext = response.pageInfo!.hasNext;
        this.campuses.totalElements = response.pageInfo!.totalElements;
        this.campuses.isLoading = false;
      },
      error: () => {
        this.campuses.data = [];
        this.campuses.isLoading = false;
        this.showToast('error', 'Error', 'Error al cargar campus');
      },
    });
  }

  onLazyLoadSpecialties(event: SelectLazyLoadEvent): void {
    if (this.specialties.isLoading) return;
    const { first, last } = event;
    if (this.specialties.hasNext && last >= this.specialties.data.length) {
      this.specialties.currentPage++;
      this.loadSpecialties(this.specialties.currentPage, 20);
    }
  }

  loadSpecialties(page: number, size: number): void {
    this.specialties.isLoading = true;
    this.specialtyService.getAllSpecialties(page, size).subscribe({
      next: (response: ApiResponse<SpecialtyResponse[]>) => {
        if (response.pageInfo!.page === 0) {
          this.specialties.data = [...response.data];
          this.specialties.currentPage = 0;
        } else {
          this.specialties.data = [...this.specialties.data, ...response.data];
        }
        this.specialties.hasNext = response.pageInfo!.hasNext;
        this.specialties.totalElements = response.pageInfo!.totalElements;
        this.specialties.isLoading = false;
      },
      error: () => {
        this.specialties.data = [];
        this.specialties.isLoading = false;
        this.showToast('error', 'Error', 'Error al cargar especialidades');
      },
    });
  }

  onLazyLoadModalities(event: SelectLazyLoadEvent): void {
    if (this.modalities.isLoading) return;
    const { first, last } = event;
    if (this.modalities.hasNext && last >= this.modalities.data.length) {
      this.modalities.currentPage++;
      this.loadModalities(this.modalities.currentPage, 20);
    }
  }

  loadModalities(page: number, size: number): void {
    this.modalities.isLoading = true;
    this.modalityService.getAllModalities(page, size).subscribe({
      next: (response: ApiResponse<ModalityResponse[]>) => {
        if (response.pageInfo!.page === 0) {
          this.modalities.data = [...response.data];
          this.modalities.currentPage = 0;
        } else {
          this.modalities.data = [...this.modalities.data, ...response.data];
        }
        this.modalities.hasNext = response.pageInfo!.hasNext;
        this.modalities.totalElements = response.pageInfo!.totalElements;
        this.modalities.isLoading = false;
      },
      error: () => {
        this.modalities.data = [];
        this.modalities.isLoading = false;
        this.showToast('error', 'Error', 'Error al cargar modalidades');
      },
    });
  }

  onLazyLoadGrades(event: SelectLazyLoadEvent): void {
    if (this.grades.isLoading) return;
    const { first, last } = event;
    if (this.grades.hasNext && last >= this.grades.data.length) {
      this.grades.currentPage++;
      this.loadGrades(this.grades.currentPage, 20);
    }
  }

  loadGrades(page: number, size: number): void {
    this.grades.isLoading = true;
    this.gradeService.getAllGrades(page, size).subscribe({
      next: (response: ApiResponse<GradeResponse[]>) => {
        if (response.pageInfo!.page === 0) {
          this.grades.data = [...response.data];
          this.grades.currentPage = 0;
        } else {
          this.grades.data = [...this.grades.data, ...response.data];
        }
        this.grades.hasNext = response.pageInfo!.hasNext;
        this.grades.totalElements = response.pageInfo!.totalElements;
        this.grades.isLoading = false;
      },
      error: () => {
        this.grades.data = [];
        this.grades.isLoading = false;
        this.showToast('error', 'Error', 'Error al cargar grados');
      },
    });
  }

  onLazyLoadGroups(event: SelectLazyLoadEvent): void {
    if (this.groups.isLoading) return;
    const { first, last } = event;
    if (this.groups.hasNext && last >= this.groups.data.length) {
      this.groups.currentPage++;
      this.loadGroups(this.groups.currentPage, 20);
    }
  }

  loadGroups(page: number, size: number): void {
    this.groups.isLoading = true;
    this.groupService.getAllGroups(page, size).subscribe({
      next: (response: ApiResponse<GroupResponse[]>) => {
        if (response.pageInfo!.page === 0) {
          this.groups.data = [...response.data];
          this.groups.currentPage = 0;
        } else {
          this.groups.data = [...this.groups.data, ...response.data];
        }
        this.groups.hasNext = response.pageInfo!.hasNext;
        this.groups.totalElements = response.pageInfo!.totalElements;
        this.groups.isLoading = false;
      },
      error: () => {
        this.groups.data = [];
        this.groups.isLoading = false;
        this.showToast('error', 'Error', 'Error al cargar grupos');
      },
    });
  }

  onLazyLoadGenerations(event: SelectLazyLoadEvent): void {
    if (this.generations.isLoading) return;
    const { first, last } = event;
    if (this.generations.hasNext && last >= this.generations.data.length) {
      this.generations.currentPage++;
      this.loadGenerations(this.generations.currentPage, 20);
    }
  }

  loadGenerations(page: number, size: number): void {
    this.generations.isLoading = true;
    this.generationService.getAllGenerations(page, size).subscribe({
      next: (response: ApiResponse<GenerationResponse[]>) => {
        if (response.pageInfo!.page === 0) {
          this.generations.data = [...response.data];
          this.generations.currentPage = 0;
        } else {
          this.generations.data = [...this.generations.data, ...response.data];
        }
        this.generations.hasNext = response.pageInfo!.hasNext;
        this.generations.totalElements = response.pageInfo!.totalElements;
        this.generations.isLoading = false;
      },
      error: () => {
        this.generations.data = [];
        this.generations.isLoading = false;
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
          if (error.statusCode === 409 && error.message.includes('configuration_already_exists')) {
            this.showToast('error', 'Error', 'Ya existe una configuración de grupo con los mismos datos');
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
            } else if (error.statusCode === 409 && error.message.includes('configuration_already_exists')) {
              this.showToast('error', 'Error', 'Ya existe una configuración de grupo con los mismos datos');
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
