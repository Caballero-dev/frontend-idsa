import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, EMPTY, throwError } from 'rxjs';
import { ApiError } from '../models/ApiError.model';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

const handleLogout = (tokenService: TokenService, router: Router): void => {
  tokenService.clearTokens();
  router.navigate(['/auth/login']);
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: ApiError) => {
      if (error.statusCode === 401 && error.message.includes('authentication_failed')) {
        handleLogout(tokenService, router);
        return EMPTY;
      }
      return throwError(() => error);
    })
  );
};
