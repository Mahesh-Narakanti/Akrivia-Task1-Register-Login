import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Interceptor invoked');

  let token: string | null = null;
  if (typeof window !== 'undefined' && window.sessionStorage) {
    token=window.sessionStorage.getItem('token');
  }
  console.log('Token from sessionStorage:', token);

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`, // Use Bearer token format
      },
    });
      req = clonedRequest;
    }
    return next(req).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            console.error('Unauthorized request:', err);
          }
            if (err.status === 404)
            {
                console.error('Not Found:', err);
            } else {
            console.error('HTTP error:', err);
          }
        } else {
          console.error('An unexpected error occurred:', err);
        }

        // Propagate the error to the subscriber
        return throwError(() => err);
      })
    );
};
