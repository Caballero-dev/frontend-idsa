import { StudentResponse } from '../../../feactures/students/models/student.model';

export interface ReportResponse {
  reportId: number;
  student: StudentResponse;
  temperature: number;
  heartRate: number;
  systolicBloodPressure: number;
  diastolicBloodPressure: number;
  images: string[];
  createdAt: string;
}
