import { Injectable } from '@angular/core';
import { JwtUtils } from '../../utils/jwt.utils';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null && this.getRefreshToken() !== null;
  }

  isValidSession(): boolean {
    const accessToken: string | null = this.getAccessToken();
    const refreshToken: string | null = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return false;
    }

    const email: string | null = JwtUtils.getEmailFromToken(accessToken);
    return email !== null;
  }
}
