import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../core/models/ApiResponse.model';
import { Observable } from 'rxjs';
import { TutorRequest, TutorResponse } from '../models/tutor.model';

@Injectable({
  providedIn: 'root',
})
export class TutorService {
  private readonly API_URL = `${environment.URL_API}/admin/tutors`;
  private http: HttpClient = inject(HttpClient);

  getAllTutors(page: number = 0, size: number = 20): Observable<ApiResponse<TutorResponse[]>> {
    return this.http.get<ApiResponse<TutorResponse[]>>(`${this.API_URL}`, {
      params: {
        page,
        size,
      },
    });
  }

  createTutor(tutor: TutorRequest): Observable<ApiResponse<TutorResponse>> {
    return this.http.post<ApiResponse<TutorResponse>>(`${this.API_URL}`, tutor);
  }

  updateTutor(tutorId: number, tutor: TutorRequest): Observable<ApiResponse<TutorResponse>> {
    return this.http.put<ApiResponse<TutorResponse>>(`${this.API_URL}/${tutorId}`, tutor);
  }

  deleteTutor(tutorId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${tutorId}`);
  }
}

