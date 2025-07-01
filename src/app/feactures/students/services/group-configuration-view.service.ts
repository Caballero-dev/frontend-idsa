import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupConfigurationView } from '../models/group-configuration-view.model';
import { ApiResponse } from '../../../core/models/ApiResponse.model';

@Injectable({
  providedIn: 'root',
})
export class GroupConfigurationViewService {
  private readonly API_URL = `${environment.URL_API}/common/group-configurations-view`;
  private http: HttpClient = inject(HttpClient);

  getAllGroupConfigurationsView(
    page: number = 0,
    size: number = 20
  ): Observable<ApiResponse<GroupConfigurationView[]>> {
    return this.http.get<ApiResponse<GroupConfigurationView[]>>(this.API_URL, {
      params: {
        page,
        size,
      },
    });
  }
}
