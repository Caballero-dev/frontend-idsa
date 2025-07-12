export interface TutorResponse {
  tutorId: string;
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
