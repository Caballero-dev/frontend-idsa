import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { ApiError } from '../models/ApiError.model';
import { catchError, throwError } from 'rxjs';

export const errorFormatterInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const apiError: ApiError = {
        timestamp: error.error?.timestamp ?? new Date().toISOString(),
        status: error.error?.status ?? error.statusText ?? 'UNKNOWN_ERROR',
        statusCode: error.error?.statusCode ?? error.status ?? 500,
        message: error.error?.message ?? error.message ?? 'An unexpected error occurred',
        path: error.error?.path ?? req.url,
        validationErrors: error.error?.validationErrors ?? undefined,
      };
      return throwError(() => apiError);
    })
  );
};
