export interface StudentResponse {
  studentId: number;
  studentCode: string;
  name: string;
  firstSurname: string;
  secondSurname: string;
  phoneNumber: string;
  predictionResult: number | null;
}

export interface StudentRequest {
  studentCode: string;
  name: string;
  firstSurname: string;
  secondSurname: string;
  phoneNumber: string;
}
