import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../core/models/ApiResponse.model';
import { Observable } from 'rxjs';
import { SpecialtyRequest, SpecialtyResponse } from '../models/specialty.model';
import { hasText } from '../../../utils/string.utils';

@Injectable({
  providedIn: 'root',
})
export class SpecialtyService {
  private readonly API_URL = `${environment.URL_API}/admin/specialities`;
  private http: HttpClient = inject(HttpClient);

  getAllSpecialties(
    page: number = 0,
    size: number = 20,
    search?: string | null
  ): Observable<ApiResponse<SpecialtyResponse[]>> {
    const params: any = {
      page: page,
      size: size,
      ...(hasText(search) && { search: search }),
    };
    return this.http.get<ApiResponse<SpecialtyResponse[]>>(this.API_URL, { params });
  }

  createSpecialty(specialty: SpecialtyRequest): Observable<ApiResponse<SpecialtyResponse>> {
    return this.http.post<ApiResponse<SpecialtyResponse>>(this.API_URL, specialty);
  }

  updateSpecialty(specialtyId: number, specialty: SpecialtyRequest): Observable<ApiResponse<SpecialtyResponse>> {
    return this.http.put<ApiResponse<SpecialtyResponse>>(`${this.API_URL}/${specialtyId}`, specialty);
  }

  deleteSpecialty(specialtyId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${specialtyId}`);
  }
}

