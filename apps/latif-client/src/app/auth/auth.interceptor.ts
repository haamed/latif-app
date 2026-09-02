import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  const authReq = token
    ? req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    })
    : req;

  return next(authReq).pipe(
    catchError((err: unknown) => {
      // Stale/expired token: log out so the user is sent back to login instead of seeing empty data.
      if (err instanceof HttpErrorResponse && err.status === 401 && token) {
        auth.logout();
      }
      return throwError(() => err);
    }),
  );
};

