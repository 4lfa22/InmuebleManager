import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { getApiBaseUrl } from '../environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  nombre: string;
  expiresIn: number;
}

export interface RegistroRequest {
  email: string;
  password: string;
  nombre: string;
}

export interface RegistroResponse {
  id: number;
  email: string;
  nombre: string;
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${getApiBaseUrl()}/api/auth`;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;

  constructor(private http: HttpClient) {
    // Inicializar con el usuario del localStorage
    const user = this.getUserFromStorage();
    this.currentUserSubject = new BehaviorSubject<any>(user);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.saveToken(response.token);
        const user = {
          id: response.id,
          email: response.email,
          nombre: response.nombre
        };
        this.saveUser(user);
        this.currentUserSubject.next(user);
      })
    );
  }

  registro(data: RegistroRequest): Observable<RegistroResponse> {
    return this.http.post<RegistroResponse>(`${this.apiUrl}/registro`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private saveUser(user: any): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private getUserFromStorage(): any {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  restoreUserFromStorage(): Observable<LoginResponse | null> {
    const user = this.getUserFromStorage();
    const token = this.getToken();

    if (!user || !token) {
      this.currentUserSubject.next(null);
      return new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
    }

    // Validar el usuario contra el backend
    return new Observable(observer => {
      this.http.get<LoginResponse>(`${this.apiUrl}/me`).subscribe({
        next: (response) => {
          // Usuario válido
          const userData = {
            id: response.id,
            email: response.email,
            nombre: response.nombre
          };
          this.saveUser(userData);
          this.currentUserSubject.next(userData);
          observer.next(response);
          observer.complete();
        },
        error: () => {
          // Usuario no válido o token expirado
          this.logout();
          observer.next(null);
          observer.complete();
        }
      });
    });
  }
}
