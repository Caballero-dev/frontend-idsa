import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../core/models/ApiResponse.model';
import { Observable } from 'rxjs';
import { GenerationRequest, GenerationResponse } from '../models/generation.model';
import { hasText } from '../../../utils/string.utils';

@Injectable({
  providedIn: 'root',
})
export class GenerationService {
  private readonly API_URL = `${environment.URL_API}/admin/generations`;
  private http: HttpClient = inject(HttpClient);

  getAllGenerations(
    page: number = 0,
    size: number = 20,
    search?: string | null
  ): Observable<ApiResponse<GenerationResponse[]>> {
    const params: any = {
      page,
      size,
      ...(hasText(search) && { search }),
    };
    return this.http.get<ApiResponse<GenerationResponse[]>>(this.API_URL, { params });
  }

  createGeneration(generation: GenerationRequest): Observable<ApiResponse<GenerationResponse>> {
    return this.http.post<ApiResponse<GenerationResponse>>(this.API_URL, generation);
  }

  updateGeneration(generationId: number, generation: GenerationRequest): Observable<ApiResponse<GenerationResponse>> {
    return this.http.put<ApiResponse<GenerationResponse>>(`${this.API_URL}/${generationId}`, generation);
  }

  deleteGeneration(generationId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${generationId}`);
  }
}
