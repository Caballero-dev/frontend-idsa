import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../core/models/ApiResponse.model';
import { TokenService } from '../../core/services/token.service';
import { LoginRequest, LoginResponse } from '../models/Login.model';
import { RefreshTokenRequest, RefreshTokenResponse } from '../models/RefreshToken.model';
import { VerifyEmailRequest } from '../models/VerifyEmail.model';
import { ForgotPasswordRequest } from '../models/ForgotPassword.model';
import { ResetPasswordRequest } from '../models/ResetPassword.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = `${environment.URL_API}/auth`;
  private http: HttpClient = inject(HttpClient);
  private tokenService: TokenService = inject(TokenService);

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.API_URL}/login`, credentials).pipe(
      tap((response: ApiResponse<LoginResponse>) => {
        this.tokenService.setTokens(response.data.accessToken, response.data.refreshToken);
      })
    );
  }

  refreshToken(tokens: RefreshTokenRequest): Observable<ApiResponse<RefreshTokenResponse>> {
    return this.http.post<ApiResponse<RefreshTokenResponse>>(`${this.API_URL}/refresh-token`, tokens).pipe(
      tap((response: ApiResponse<RefreshTokenResponse>) => {
        this.tokenService.setTokens(response.data.accessToken, response.data.refreshToken);
      })
    );
  }

  verifyEmailAndSetPassword(verifyEmailRequest: VerifyEmailRequest): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/verify-email`, verifyEmailRequest);
  }

  requestPasswordReset(forgotPasswordRequest: ForgotPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/forgot-password`, forgotPasswordRequest);
  }

  resetPassword(resetPasswordRequest: ResetPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/reset-password`, resetPasswordRequest);
  }

  confirmEmailChange(token: string): Observable<void> {
    return this.http.get<void>(`${this.API_URL}/confirm-email-change`, { params: { token } });
  }
}
