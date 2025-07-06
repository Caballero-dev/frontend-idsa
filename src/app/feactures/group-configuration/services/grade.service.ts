import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../core/models/ApiResponse.model';
import { Observable } from 'rxjs';
import { GradeRequest, GradeResponse } from '../models/grade.model';
import { hasText } from '../../../utils/string.utils';

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private readonly API_URL = `${environment.URL_API}/admin/grades`;
  private http: HttpClient = inject(HttpClient);

  getAllGrades(page: number = 0, size: number = 20, search?: string | null): Observable<ApiResponse<GradeResponse[]>> {
    const params: any = {
      page,
      size,
      ...(hasText(search) && { search }),
    };
    return this.http.get<ApiResponse<GradeResponse[]>>(this.API_URL, { params });
  }

  createGrade(grade: GradeRequest): Observable<ApiResponse<GradeResponse>> {
    return this.http.post<ApiResponse<GradeResponse>>(this.API_URL, grade);
  }

  updateGrade(gradeId: number, grade: GradeRequest): Observable<ApiResponse<GradeResponse>> {
    return this.http.put<ApiResponse<GradeResponse>>(`${this.API_URL}/${gradeId}`, grade);
  }

  deleteGrade(gradeId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${gradeId}`);
  }
}
