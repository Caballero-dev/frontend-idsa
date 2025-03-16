export interface Student {
  studentId: number;
  studentCode: string;
  name: string;
  firstSurname: string;
  secondSurname: string;
  phoneNumber: string;
  email: string;
  predictionResult: number | null;
}

export interface StudentRequest {
  studentCode: string;
  name: string;
  firstSurname: string;
  secondSurname: string;
  phoneNumber: string;
  email: string;
}

export interface EmitterDialogStudent {
  isOpen: boolean;
  message: 'save' | 'edit' | 'close';
  student: Student | null;
}
