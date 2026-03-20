import { Injectable, inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);

  // No añadir token a endpoints de autenticación (excepto /me)
  if (req.url.includes('/api/auth/login') || req.url.includes('/api/auth/registro')) {
    const clonedReq = req.clone({ withCredentials: true });
    return next(clonedReq);
  }

  const token = authService.getToken();
  let clonedReq = req;
  
  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
  } else {
    clonedReq = req.clone({ withCredentials: true });
  }

  return next(clonedReq).pipe(
    catchError(error => {
      // Si recibimos 401, limpiar localStorage
      if (error.status === 401) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
