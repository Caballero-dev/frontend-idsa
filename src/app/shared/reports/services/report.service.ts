import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportResponse } from '../model/report.model';
import { ApiResponse } from '../../../core/models/ApiResponse.model';
import { ReportSummaryResponse } from '../model/report-summary.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly API_URL = `${environment.URL_API}/common/reports`;
  private http: HttpClient = inject(HttpClient);

  getReports(page: number = 0, size: number = 20): Observable<ApiResponse<ReportResponse[]>> {
    return this.http.get<ApiResponse<ReportResponse[]>>(this.API_URL, {
      params: {
        page,
        size,
      },
    });
  }

  getReportByStudentId(
    studentId: number,
    page: number = 0,
    size: number = 20
  ): Observable<ApiResponse<ReportResponse[]>> {
    return this.http.get<ApiResponse<ReportResponse[]>>(`${this.API_URL}/student/${studentId}`, {
      params: {
        page,
        size,
      },
    });
  }

  getReportSummary(): Observable<ApiResponse<ReportSummaryResponse>> {
    return this.http.get<ApiResponse<ReportSummaryResponse>>(`${this.API_URL}/summary`);
  }
}
