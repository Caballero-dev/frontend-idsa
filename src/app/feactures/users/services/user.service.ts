import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../core/models/ApiResponse.model';
import { Observable } from 'rxjs';
import { UserRequest, UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL = `${environment.URL_API}/admin/users`;
  private http: HttpClient = inject(HttpClient);

  getAllUsers(page: number = 0, size: number = 20): Observable<ApiResponse<UserResponse[]>> {
    return this.http.get<ApiResponse<UserResponse[]>>(`${this.API_URL}`, {
      params: {
        page,
        size,
      },
    });
  }

  createUser(user: UserRequest): Observable<ApiResponse<UserResponse>> {
    return this.http.post<ApiResponse<UserResponse>>(`${this.API_URL}`, user);
  }

  updateUser(userId: number, isUpdatePassword: boolean, user: UserRequest): Observable<ApiResponse<UserResponse>> {
    return this.http.put<ApiResponse<UserResponse>>(`${this.API_URL}/${userId}`, user, {
      params: {
        isUpdatePassword,
      },
    });
  }

  updateUserStatus(userId: number, isActive: boolean): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${userId}/status`, null, { params: { isActive } });
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${userId}`);
  }
}
