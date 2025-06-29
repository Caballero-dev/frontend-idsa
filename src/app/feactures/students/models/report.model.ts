import { StudentResponse as Student } from './student.model';

export interface Report {
  student: Student;
  reportId: number;
  createdAt: string;
  images: string[];
  temperature: number;
  pupilDilationRight: number;
  pupilDilationLeft: number;
  heartRate: number;
  oxygenLevels: number;
}
