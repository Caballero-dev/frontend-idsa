import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/ApiResponse.model';
import { ModalityRequest, ModalityResponse } from '../models/modality.model';

@Injectable({
  providedIn: 'root',
})
export class ModalityService {
  private readonly API_URL = `${environment.URL_API}/admin/modalities`;
  private http: HttpClient = inject(HttpClient);

  getAllModalities(page: number = 0, size: number = 20): Observable<ApiResponse<ModalityResponse[]>> {
    return this.http.get<ApiResponse<ModalityResponse[]>>(this.API_URL, {
      params: {
        page,
        size,
      },
    });
  }

  createModality(modality: ModalityRequest): Observable<ApiResponse<ModalityResponse>> {
    return this.http.post<ApiResponse<ModalityResponse>>(this.API_URL, modality);
  }

  updateModality(modalityId: number, modality: ModalityRequest): Observable<ApiResponse<ModalityResponse>> {
    return this.http.put<ApiResponse<ModalityResponse>>(`${this.API_URL}/${modalityId}`, modality);
  }

  deleteModality(modalityId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${modalityId}`);
  }
}
