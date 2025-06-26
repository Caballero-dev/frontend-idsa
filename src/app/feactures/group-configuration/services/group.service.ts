import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/ApiResponse.model';
import { GroupRequest, GroupResponse } from '../models/group.model';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private readonly API_URL = `${environment.URL_API}/admin/groups`;
  private http: HttpClient = inject(HttpClient);

  getAllGroups(page: number = 0, size: number = 20): Observable<ApiResponse<GroupResponse[]>> {
    return this.http.get<ApiResponse<GroupResponse[]>>(this.API_URL, {
      params: {
        page,
        size,
      },
    });
  }

  createGroup(group: GroupRequest): Observable<ApiResponse<GroupResponse>> {
    return this.http.post<ApiResponse<GroupResponse>>(this.API_URL, group);
  }

  updateGroup(groupId: number, group: GroupRequest): Observable<ApiResponse<GroupResponse>> {
    return this.http.put<ApiResponse<GroupResponse>>(`${this.API_URL}/${groupId}`, group);
  }

  deleteGroup(groupId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${groupId}`);
  }
}

