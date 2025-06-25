import { TutorResponse as Tutor } from '../../tutors/models/tutor.model';
import { CampusResponse as Campus } from './campus.model';
import { Specialty } from './specialty.model';
import { Modality } from './modality.model';
import { Grade } from './grade.model';
import { Group } from './group.model';
import { Generation } from './generation.model';

export interface GroupConfiguration {
  groupConfigurationId: number;
  tutor: Tutor;
  campus: Campus;
  specialty: Specialty;
  modality: Modality;
  grade: Grade;
  group: Group;
  generation: Generation;
}

export interface GroupConfigurationRequest {
  tutor: Tutor;
  campus: Campus;
  specialty: Specialty;
  modality: Modality;
  grade: Grade;
  group: Group;
  generation: Generation;
}

export interface EmitterDialogGroupConfiguration {
  isOpen: boolean;
  message: 'save' | 'edit' | 'close';
  groupConfiguration: GroupConfiguration | null;
}
