export interface TutorResponse {
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
