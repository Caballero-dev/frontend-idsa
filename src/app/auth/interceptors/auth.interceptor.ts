import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../../core/services/token.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, EMPTY, switchMap, throwError } from 'rxjs';
import { ApiError } from '../../core/models/ApiError.model';
import { ApiResponse } from '../../core/models/ApiResponse.model';
import { RefreshTokenResponse } from '../models/RefreshToken.model';

const addToken = (req: HttpRequest<any>, accessToken: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const handleLogout = (tokenService: TokenService, router: Router): void => {
  tokenService.clearTokens();
  router.navigate(['/auth/login']);
};

const handleRefreshError = (error: ApiError, tokenService: TokenService, router: Router) => {
  const logoutErrors: string[] = [
    'invalid_token_type',
    'invalid_refresh_token',
    'expired_non_refreshable_access_token',
    'invalid_access_token',
    'expired_refresh_token',
    'invalid_token',
  ];

  if (error.message.includes('access_token_valid')) {
    return throwError(() => error);
  }
  if (logoutErrors.some((errorCode: string) => error.message.includes(errorCode))) {
    handleLogout(tokenService, router);
    return EMPTY;
  }

  return throwError(() => error);
};

const handle401Error = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  accessToken: string,
  refreshToken: string,
  tokenService: TokenService,
  authService: AuthService,
  router: Router
) => {
  return authService.refreshToken({ accessToken, refreshToken }).pipe(
    switchMap((response: ApiResponse<RefreshTokenResponse>) => {
      const newReq = addToken(req, response.data.accessToken);
      return next(newReq);
    }),
    catchError((error: ApiError) => {
      return handleRefreshError(error, tokenService, router);
    })
  );
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const accessToken = tokenService.getAccessToken();
  const refreshToken = tokenService.getRefreshToken();
  let authReq = req;

  if (req.url.includes('/api/auth/')) {
    return next(req);
  }

  if (accessToken) {
    authReq = addToken(req, accessToken);
  }

  return next(authReq).pipe(
    catchError((error: ApiError) => {
      if (error.statusCode === 401 && error.message.includes('token_expired')) {
        if (accessToken && refreshToken) {
          return handle401Error(req, next, accessToken, refreshToken, tokenService, authService, router);
        } else {
          handleLogout(tokenService, router);
          return EMPTY;
        }
      }
      return throwError(() => error);
    })
  );
};
