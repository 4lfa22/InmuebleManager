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

  // Añadir header para evitar la página de advertencia de ngrok
  let headers = req.headers.set('ngrok-skip-browser-warning', 'true');

  // No añadir token a endpoints de autenticación (excepto /me)
  if (req.url.includes('/api/auth/login') || req.url.includes('/api/auth/registro')) {
    const clonedReq = req.clone({ headers });
    return next(clonedReq);
  }

  const token = authService.getToken();
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const clonedReq = req.clone({ headers });
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
