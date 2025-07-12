export interface StudentResponse {
  studentId: string;
  studentCode: string;
  name: string;
  firstSurname: string;
  secondSurname: string;
  phoneNumber: string;
  predictionResult: string | null;
}

export interface StudentRequest {
  studentCode: string;
  name: string;
  firstSurname: string;
  secondSurname: string;
  phoneNumber: string;
}
