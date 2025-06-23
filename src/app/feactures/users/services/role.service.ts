import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/ApiResponse.model';
import { RoleResponse } from '../models/Role.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly API_URL = `${environment.URL_API}/admin/roles`;
  private http: HttpClient = inject(HttpClient);

  getRoles(): Observable<ApiResponse<RoleResponse[]>> {
    return this.http.get<ApiResponse<RoleResponse[]>>(`${this.API_URL}`);
  }
}
