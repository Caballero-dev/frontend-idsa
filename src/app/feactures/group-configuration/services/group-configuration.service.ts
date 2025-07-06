import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/ApiResponse.model';
import { GroupConfigurationRequest, GroupConfigurationResponse } from '../models/group-configuration.model';
import { hasText } from '../../../utils/string.utils';

@Injectable({
  providedIn: 'root',
})
export class GroupConfigurationService {
  private readonly API_URL = `${environment.URL_API}/admin/group-configurations`;
  private http: HttpClient = inject(HttpClient);

  getAllGroupConfigurations(
    page: number = 0,
    size: number = 20,
    search?: string | null
  ): Observable<ApiResponse<GroupConfigurationResponse[]>> {
    const params: any = {
      page: page,
      size: size,
      ...(hasText(search) && { search: search }),
    };
    return this.http.get<ApiResponse<GroupConfigurationResponse[]>>(this.API_URL, { params });
  }

  createGroupConfiguration(
    groupConfiguration: GroupConfigurationRequest
  ): Observable<ApiResponse<GroupConfigurationResponse>> {
    return this.http.post<ApiResponse<GroupConfigurationResponse>>(this.API_URL, groupConfiguration);
  }

  updateGroupConfiguration(
    groupConfigurationId: number,
    groupConfiguration: GroupConfigurationRequest
  ): Observable<ApiResponse<GroupConfigurationResponse>> {
    return this.http.put<ApiResponse<GroupConfigurationResponse>>(
      `${this.API_URL}/${groupConfigurationId}`,
      groupConfiguration
    );
  }

  deleteGroupConfiguration(groupConfigurationId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${groupConfigurationId}`);
  }
}
