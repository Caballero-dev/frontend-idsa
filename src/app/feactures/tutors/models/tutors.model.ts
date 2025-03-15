export interface Tutor {
  tutorId: number;
  name: string;
  firstSurname: string;
  secondSurname: string;
  employeeCode: string;
  phoneNumber: string;
  email: string;
}

export interface TutorRequest {
  name: string;
  firstSurname: string;
  secondSurname: string;
  employeeCode: string;
  phoneNumber: string;
  email: string;
}

export interface EmitterDialogTutor {
  isOpen: boolean;
  message: 'save' | 'edit' | 'close';
  tutor: Tutor | null;
}
