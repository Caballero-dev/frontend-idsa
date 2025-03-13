import { Injectable } from '@angular/core';
import { Campus } from '../models/campuses.model';

@Injectable({
  providedIn: 'root',
})
export class CampusesTestService {
  getData(): Campus[] {
    return [
      { campusId: 1, name: 'Cuitláhuac' },
      { campusId: 2, name: 'Zacatenco' },
    ];
  }
}
