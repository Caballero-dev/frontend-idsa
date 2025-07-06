import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/ApiResponse.model';
import { StudentRequest, StudentResponse } from '../models/student.model';
import { hasText } from '../../../utils/string.utils';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly API_URL = `${environment.URL_API}/common/students`;
  private http: HttpClient = inject(HttpClient);

  getStudentsByGroup(
    groupId: number,
    page: number = 0,
    size: number = 20,
    search?: string | null
  ): Observable<ApiResponse<StudentResponse[]>> {
    const params: any = {
      page: page,
      size: size,
      ...(hasText(search) && { search: search }),
    };
    return this.http.get<ApiResponse<StudentResponse[]>>(`${this.API_URL}/by-group/${groupId}`, { params });
  }

  createStudent(groupId: number, student: StudentRequest): Observable<ApiResponse<StudentResponse>> {
    return this.http.post<ApiResponse<StudentResponse>>(`${this.API_URL}/by-group/${groupId}`, student);
  }

  updateStudent(studentId: number, student: StudentRequest): Observable<ApiResponse<StudentResponse>> {
    return this.http.put<ApiResponse<StudentResponse>>(`${this.API_URL}/${studentId}`, student);
  }

  deleteStudent(studentId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${studentId}`);
  }
}
