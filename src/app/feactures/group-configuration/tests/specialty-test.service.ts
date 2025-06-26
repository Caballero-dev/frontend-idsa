import { Injectable } from '@angular/core';
import { SpecialtyResponse as Specialty } from '../models/specialty.model';

@Injectable({
  providedIn: 'root',
})
export class SpecialtyTestService {
  getData(): Specialty[] {
    return [
      { specialtyId: 1, name: 'Soporte y mantenimiento de equipo de computo', shortName: 'SYMEC' },
      { specialtyId: 2, name: 'Desarrollo de software', shortName: 'DS' },
      { specialtyId: 3, name: 'Redes', shortName: 'RE' },
      { specialtyId: 4, name: 'Bases de datos', shortName: 'BD' },
      { specialtyId: 5, name: 'Diseño gráfico', shortName: 'DG' },
      { specialtyId: 6, name: 'Mecanica automotriz', shortName: 'MA' },
    ];
  }
}
