import { Injectable } from '@angular/core';
import { GradeResponse as Grade } from '../models/grade.model';

@Injectable({
  providedIn: 'root',
})
export class GradeTestService {
  getData(): Grade[] {
    return [
      { gradeId: 1, name: 'Primer Semestre' },
      { gradeId: 2, name: 'Segundo Semestre' },
      { gradeId: 3, name: 'Tercer Semestre' },
      { gradeId: 4, name: 'Cuarto Semestre' },
      { gradeId: 5, name: 'Quinto Semestre' },
      { gradeId: 6, name: 'Sexto Semestre' },
      { gradeId: 7, name: 'Septimo Semestre' },
      { gradeId: 8, name: 'Octavo Semestre' },
      { gradeId: 9, name: 'Noveno Semestre' },
      { gradeId: 10, name: 'Decimo Semestre' },
    ];
  }
}
