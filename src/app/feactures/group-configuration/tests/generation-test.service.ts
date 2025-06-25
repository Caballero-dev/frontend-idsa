import { Injectable } from '@angular/core';
import { GenerationResponse as Generation } from '../models/generation.model';

@Injectable({
  providedIn: 'root',
})
export class GenerationTestService {
  getData(): Generation[] {
    return [
      { generationId: 1, yearStart: '2021-01-01', yearEnd: '2021-12-31' },
      { generationId: 2, yearStart: '2022-01-01', yearEnd: '2022-12-31' },
      { generationId: 3, yearStart: '2023-01-01', yearEnd: '2023-12-31' },
      { generationId: 4, yearStart: '2024-01-01', yearEnd: '2024-12-31' },
    ];
  }
}
