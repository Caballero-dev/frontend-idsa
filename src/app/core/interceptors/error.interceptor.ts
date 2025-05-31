import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, EMPTY, throwError } from 'rxjs';
import { ApiError } from '../models/ApiError.model';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: ApiError) => {
      if (error.statusCode === 401 && error.message.includes('invalid_token')) {
        authService.logout();
        return EMPTY;
      }
      if (error.statusCode === 401 && error.message.includes('authentication_failed')) {
        authService.logout();
        return EMPTY;
      }
      return throwError(() => error);
    })
  );
};
