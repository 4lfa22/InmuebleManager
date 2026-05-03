import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';
import { Verify2FAComponent } from '../verify-2fa/verify-2fa.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, Verify2FAComponent],
  template: `
    <!-- Pantalla de verificación 2FA -->
    <app-verify-2fa 
      *ngIf="showVerification2FA"
      [email]="credentials.email"
      (verified)="onVerificationSuccess()"
      (cancelled)="onVerificationCancelled()">
    </app-verify-2fa>

    <!-- Formulario de login normal -->
    <div class="container mt-5" *ngIf="!showVerification2FA">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <h2 class="card-title fw-bold">Iniciar Sesión</h2>
                <p class="text-muted small">Accede a tu cuenta de InmuebleManager</p>
              </div>
              
              <!-- Error Alert -->
              <div class="alert alert-danger alert-dismissible fade show d-flex align-items-center" 
                   role="alert"
                   *ngIf="error">
                <svg class="bi flex-shrink-0 me-2" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0l-5.708 9.762a1.13 1.13 0 0 0 .98 1.72h11.456a1.13 1.13 0 0 0 .98-1.72L8.982 1.566ZM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5Zm.002 6a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1Z"/>
                </svg>
                <div>
                  {{ error }}
                </div>
                <button type="button" class="btn-close" (click)="error = ''"></button>
              </div>

              <form (ngSubmit)="login()" #loginForm="ngForm">
                <div class="mb-4">
                  <label for="email" class="form-label fw-5">Email</label>
                  <input 
                    type="email" 
                    class="form-control form-control-lg" 
                    id="email"
                    placeholder="tu@email.com"
                    [(ngModel)]="credentials.email"
                    name="email"
                    #emailField="ngModel"
                    required>
                  <small class="text-danger d-block mt-2" *ngIf="emailField.invalid && emailField.touched">
                    <i class="bi bi-exclamation-circle"></i>
                    El email es requerido
                  </small>
                </div>

                <div class="mb-4">
                  <label for="password" class="form-label fw-5">Contraseña</label>
                  <input 
                    type="password" 
                    class="form-control form-control-lg" 
                    id="password"
                    placeholder="••••••••"
                    [(ngModel)]="credentials.password"
                    name="password"
                    #passwordField="ngModel"
                    required>
                  <small class="text-danger d-block mt-2" *ngIf="passwordField.invalid && passwordField.touched">
                    <i class="bi bi-exclamation-circle"></i>
                    La contraseña es requerida
                  </small>
                </div>

                <button type="submit" 
                        class="btn btn-primary btn-lg w-100 fw-6 rounded-3"
                        [disabled]="!loginForm.valid || isLoading">
                  <span *ngIf="!isLoading">Iniciar Sesión</span>
                  <span *ngIf="isLoading">
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Cargando...
                  </span>
                </button>
              </form>

              <hr class="my-4">
              <p class="text-center text-muted">
                ¿No tienes cuenta? <a href="/registro" class="text-primary fw-6">Regístrate aquí</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --bs-primary: #0066ff;
    }
    .form-control:focus {
      border-color: #0066ff;
      box-shadow: 0 0 0 0.2rem rgba(0, 102, 255, 0.25);
    }
    .btn-primary {
      background: linear-gradient(135deg, #0066ff 0%, #0052cc 100%);
      border: none;
      transition: all 0.3s ease;
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 102, 255, 0.3);
    }
    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .alert {
      border-radius: 12px;
      border: none;
      background-color: #fee;
      color: #c33;
    }
    .card {
      border-radius: 1rem;
    }
  `]
})
export class LoginComponent implements OnInit {
  credentials: LoginRequest = { email: '', password: '' };
  error: string = '';
  isLoading = false;
  showVerification2FA = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    this.error = '';
    this.isLoading = true;

    const normalized = {
      ...this.credentials,
      email: (this.credentials.email || '').trim().toLowerCase()
    };
    
    this.authService.login(normalized).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Si requiere 2FA, mostrar pantalla de verificación
        if (response.requires2FA) {
          this.showVerification2FA = true;
        } else {
          // Login exitoso sin 2FA
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Email o contraseña incorrectos';
      }
    });
  }

  onVerificationSuccess() {
    // Redirigir a dashboard después de verificación exitosa
    this.router.navigate(['/dashboard']);
  }

  onVerificationCancelled() {
    // Volver al formulario de login
    this.showVerification2FA = false;
    this.credentials.password = ''; // Limpiar la contraseña por seguridad
  }
}
