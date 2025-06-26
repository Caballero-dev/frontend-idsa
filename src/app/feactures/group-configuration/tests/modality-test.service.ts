import { Injectable } from '@angular/core';
import { ModalityResponse as Modality } from '../models/modality.model';

@Injectable({
  providedIn: 'root',
})
export class ModalityTestService {
  getData(): Modality[] {
    return [
      { modalityId: 1, name: 'Escolarizado' },
      { modalityId: 2, name: 'Despresurizado' },
    ];
  }
}
