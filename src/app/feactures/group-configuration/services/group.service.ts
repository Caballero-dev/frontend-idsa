import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/ApiResponse.model';
import { GroupRequest, GroupResponse } from '../models/group.model';
import { hasText } from '../../../utils/string.utils';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private readonly API_URL = `${environment.URL_API}/admin/groups`;
  private http: HttpClient = inject(HttpClient);

  getAllGroups(page: number = 0, size: number = 20, search?: string | null): Observable<ApiResponse<GroupResponse[]>> {
    const params: any = {
      page,
      size,
      ...(hasText(search) && { search }),
    };
    return this.http.get<ApiResponse<GroupResponse[]>>(this.API_URL, { params });
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
