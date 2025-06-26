import { Injectable } from '@angular/core';
import { GroupResponse as Group } from '../models/group.model';

@Injectable({
  providedIn: 'root',
})
export class GroupTestService {
  getData(): Group[] {
    return [
      { groupId: 1, name: 'A' },
      { groupId: 2, name: 'B' },
      { groupId: 3, name: 'C' },
      { groupId: 4, name: 'D' },
      { groupId: 5, name: 'E' },
      { groupId: 6, name: 'F' },
    ];
  }
}
