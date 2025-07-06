import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/ApiResponse.model';
import { CampusRequest, CampusResponse } from '../models/campus.model';
import { hasText } from '../../../utils/string.utils';

@Injectable({
  providedIn: 'root',
})
export class CampusService {
  private readonly API_URL = `${environment.URL_API}/admin/campuses`;
  private http: HttpClient = inject(HttpClient);

  getAllCampuses(
    page: number = 0,
    size: number = 20,
    search?: string | null
  ): Observable<ApiResponse<CampusResponse[]>> {
    const params: any = {
      page: page,
      size: size,
      ...(hasText(search) && { search: search }),
    };
    return this.http.get<ApiResponse<CampusResponse[]>>(this.API_URL, { params });
  }

  createCampus(campus: CampusRequest): Observable<ApiResponse<CampusResponse>> {
    return this.http.post<ApiResponse<CampusResponse>>(this.API_URL, campus);
  }

  updateCampus(campusId: number, campus: CampusRequest): Observable<ApiResponse<CampusResponse>> {
    return this.http.put<ApiResponse<CampusResponse>>(`${this.API_URL}/${campusId}`, campus);
  }

  deleteCampus(campusId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${campusId}`);
  }
}
