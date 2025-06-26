import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  EmitterDialogGroupConfiguration,
  GroupConfiguration,
  GroupConfigurationRequest,
} from '../../models/group-configuration.model';
import { FormUtils } from '../../../../utils/form.utils';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TutorResponse as Tutor } from '../../../tutors/models/tutor.model';
import { CampusResponse as Campus } from '../../models/campus.model';
import { Specialty } from '../../models/specialty.model';
import { Modality } from '../../models/modality.model';
import { GradeResponse as Grade } from '../../models/grade.model';
import { Group } from '../../models/group.model';
import { GenerationResponse as Generation } from '../../models/generation.model';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputSelectComponent } from '../../../../shared/components/input-select/input-select.component';

@Component({
  selector: 'groups-configuration-form',
  standalone: true,
  imports: [Button, Dialog, ReactiveFormsModule, InputSelectComponent],
  templateUrl: './groups-configuration-form.component.html',
  styleUrl: './groups-configuration-form.component.scss',
})
export class GroupsConfigurationFormComponent implements OnInit {
  @Input() groupConfigurationDialog: boolean = false;
  @Input() isCreateGroupConfiguration: boolean = true;
  @Input() selectedGroupConfiguration: GroupConfiguration | null = null;
  @Output() defaultChangeGroupConfigurationDialog: EventEmitter<EmitterDialogGroupConfiguration> =
    new EventEmitter<EmitterDialogGroupConfiguration>();

  // Se simula la respuesta de la api
  tutors: Tutor[] = [
    {
      tutorId: 101,
      name: 'María',
      firstSurname: 'González',
      secondSurname: 'Pérez',
      employeeCode: 'EMP0123456789',
      phoneNumber: '5551234567',
      email: 'maria.gonzalez@escuela.edu',
    },
    {
      tutorId: 102,
      name: 'Juan',
      firstSurname: 'Martínez',
      secondSurname: 'Gómez',
      employeeCode: 'EMP0234567890',
      phoneNumber: '5552345678',
      email: 'juan.martinez@escuela.edu',
    },
    {
      tutorId: 103,
      name: 'Luisa',
      firstSurname: 'Sánchez',
      secondSurname: 'Rodríguez',
      employeeCode: 'EMP0345678901',
      phoneNumber: '5553456789',
      email: 'luisa.sanchez@escuela.edu',
    },
  ];
  campuses: Campus[] = [
    {
      campusId: 1,
      name: 'Campus Norte',
    },
    {
      campusId: 2,
      name: 'Campus Sur',
    },
  ];
  specialties: Specialty[] = [
    {
      specialtyId: 1,
      name: 'Ingeniería de Software',
      shortName: 'ISW',
    },
    {
      specialtyId: 2,
      name: 'Ciencias de la Computación',
      shortName: 'CC',
    },
  ];
  modalities: Modality[] = [
    {
      modalityId: 1,
      name: 'Presencial',
    },
    {
      modalityId: 2,
      name: 'En línea',
    },
  ];
  grades: Grade[] = [
    {
      gradeId: 1,
      name: 'Primer Semestre',
    },
    {
      gradeId: 3,
      name: 'Tercer Semestre',
    },
    {
      gradeId: 5,
      name: 'Quinto Semestre',
    },
  ];
  groups: Group[] = [
    {
      groupId: 101,
      name: 'A',
    },
    {
      groupId: 102,
      name: 'B',
    },
    {
      groupId: 103,
      name: 'C',
    },
    {
      groupId: 104,
      name: 'D',
    },
  ];
  generations: Generation[] = [
    {
      generationId: 2023,
      yearStart: '2023-01-01',
      yearEnd: '2023-12-31',
    },
    {
      generationId: 2022,
      yearStart: '2022-01-01',
      yearEnd: '2022-12-31',
    },
    {
      generationId: 2021,
      yearStart: '2021-01-01',
      yearEnd: '2021-12-31',
    },
    {
      generationId: 2020,
      yearStart: '2020-01-01',
      yearEnd: '2020-12-31',
    },
  ];

  formUtils = FormUtils;
  private fb: FormBuilder = inject(FormBuilder);

  groupConfigurationForm = this.fb.group({
    tutor: new FormControl<Tutor | null>(null, [Validators.required]),
    campus: new FormControl<Campus | null>(null, [Validators.required]),
    specialty: new FormControl<Specialty | null>(null, [Validators.required]),
    modality: new FormControl<Modality | null>(null, [Validators.required]),
    grade: new FormControl<Grade | null>(null, [Validators.required]),
    group: new FormControl<Group | null>(null, [Validators.required]),
    generation: new FormControl<Generation | null>(null, [Validators.required]),
  });

  ngOnInit(): void {
    if (this.selectedGroupConfiguration) {
      this.setValuesToForm(this.selectedGroupConfiguration);
    }
  }

  setValuesToForm(groupConfiguration: GroupConfiguration): void {
    this.groupConfigurationForm.setValue({
      tutor: groupConfiguration.tutor,
      campus: groupConfiguration.campus,
      specialty: groupConfiguration.specialty,
      modality: groupConfiguration.modality,
      grade: groupConfiguration.grade,
      group: groupConfiguration.group,
      generation: groupConfiguration.generation,
    });
  }

  closeDialog() {
    this.defaultChangeGroupConfigurationDialog.emit({ isOpen: false, message: 'close', groupConfiguration: null });
  }

  saveOrUpdateGroupConfiguration() {
    if (this.isCreateGroupConfiguration) {
      this.saveGroupConfiguration();
    } else {
      this.updateGroupConfiguration();
    }
  }

  saveGroupConfiguration() {
    if (this.groupConfigurationForm.valid) {
      let gc: GroupConfigurationRequest = this.getGroupConfigurationData(); // Esto se almacena en la base de datos

      // Aqui simula la respuesta de la base de datos
      let gcSaved: GroupConfiguration = {
        groupConfigurationId: Math.floor(Math.random() * 100),
        ...gc,
      };

      this.defaultChangeGroupConfigurationDialog.emit({ isOpen: false, message: 'save', groupConfiguration: gcSaved });
    } else {
      this.groupConfigurationForm.markAllAsTouched();
    }
  }

  updateGroupConfiguration() {
    if (this.groupConfigurationForm.valid && this.selectedGroupConfiguration) {
      let gc: GroupConfigurationRequest = this.getGroupConfigurationData();

      // Aqui simula la respuesta de la base de datos
      let gcUpdated: GroupConfiguration = {
        groupConfigurationId: this.selectedGroupConfiguration.groupConfigurationId,
        ...gc,
      };

      this.defaultChangeGroupConfigurationDialog.emit({
        isOpen: false,
        message: 'edit',
        groupConfiguration: gcUpdated,
      });
    } else {
      this.groupConfigurationForm.markAllAsTouched();
    }
  }

  getGroupConfigurationData(): GroupConfigurationRequest {
    return {
      tutor: this.groupConfigurationForm.value.tutor as Tutor,
      campus: this.groupConfigurationForm.value.campus as Campus,
      specialty: this.groupConfigurationForm.value.specialty as Specialty,
      modality: this.groupConfigurationForm.value.modality as Modality,
      grade: this.groupConfigurationForm.value.grade as Grade,
      group: this.groupConfigurationForm.value.group as Group,
      generation: this.groupConfigurationForm.value.generation as Generation,
    };
  }
}
