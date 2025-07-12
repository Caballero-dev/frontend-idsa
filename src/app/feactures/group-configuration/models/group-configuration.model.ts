import { TutorResponse } from '../../tutors/models/tutor.model';
import { CampusResponse } from './campus.model';
import { SpecialtyResponse } from './specialty.model';
import { ModalityResponse } from './modality.model';
import { GradeResponse } from './grade.model';
import { GroupResponse } from './group.model';
import { GenerationResponse } from './generation.model';

export interface GroupConfigurationResponse {
  groupConfigurationId: string;
  tutor: TutorResponse;
  campus: CampusResponse;
  specialty: SpecialtyResponse;
  modality: ModalityResponse;
  grade: GradeResponse;
  group: GroupResponse;
  generation: GenerationResponse;
}

export interface GroupConfigurationRequest {
  tutor: TutorResponse;
  campus: CampusResponse;
  specialty: SpecialtyResponse;
  modality: ModalityResponse;
  grade: GradeResponse;
  group: GroupResponse;
  generation: GenerationResponse;
}
