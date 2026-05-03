import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-5 mb-5">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <!-- Header -->
          <div class="mb-4">
            <button class="btn btn-secondary mb-3" routerLink="/dashboard">
              <i class="bi bi-arrow-left"></i> Volver al Dashboard
            </button>
            <h1 class="mb-3">Configuración</h1>
          </div>

          <!-- Tabs de Configuración -->
          <ul class="nav nav-tabs mb-4" role="tablist">
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link active" 
                id="general-tab" 
                data-bs-toggle="tab" 
                data-bs-target="#general" 
                type="button" 
                role="tab">
                <i class="bi bi-gear me-2"></i> General
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link" 
                id="privacidad-tab" 
                data-bs-toggle="tab" 
                data-bs-target="#privacidad" 
                type="button" 
                role="tab">
                <i class="bi bi-shield-lock me-2"></i> Privacidad
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link" 
                id="notificaciones-tab" 
                data-bs-toggle="tab" 
                data-bs-target="#notificaciones" 
                type="button" 
                role="tab">
                <i class="bi bi-bell me-2"></i> Notificaciones
              </button>
            </li>
          </ul>

          <!-- Contenido de Tabs -->
          <div class="tab-content">
            <!-- Tab General -->
            <div class="tab-pane fade show active" id="general" role="tabpanel">
              <div class="card shadow-sm">
                <div class="card-body">
                  <h5 class="card-title mb-4">Configuración General</h5>
                  
                  <div class="mb-3">
                    <label class="form-label fw-bold">Idioma</label>
                    <select class="form-select">
                      <option selected>Español</option>
                      <option>English</option>
                      <option>Français</option>
                    </select>
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-bold">Zona Horaria</label>
                    <select class="form-select">
                      <option selected>Europa/Madrid (UTC+1)</option>
                      <option>Europa/Londres (UTC+0)</option>
                      <option>América/New_York (UTC-5)</option>
                    </select>
                  </div>

                  <div class="mb-3">
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" id="tema" checked>
                      <label class="form-check-label" for="tema">
                        Tema oscuro (próximamente)
                      </label>
                    </div>
                  </div>

                  <button class="btn btn-primary">
                    <i class="bi bi-check-circle"></i> Guardar Cambios
                  </button>
                </div>
              </div>
            </div>

            <!-- Tab Privacidad -->
            <div class="tab-pane fade" id="privacidad" role="tabpanel">
              <div class="card shadow-sm">
                <div class="card-body">
                  <h5 class="card-title mb-4">Privacidad y Seguridad</h5>
                  
                  <!-- Mensajes de éxito/error -->
                  <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
                    <i class="bi bi-check-circle-fill me-2"></i>
                    {{ successMessage }}
                    <button type="button" class="btn-close" (click)="successMessage = ''"></button>
                  </div>

                  <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    {{ errorMessage }}
                    <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
                  </div>

                  <div class="mb-4">
                    <h6>Autenticación de Dos Factores</h6>
                    <p class="text-muted">
                      {{ twoFactorEnabled ? 'La autenticación de dos factores está activada. Tu cuenta está protegida con un código que se enviará a tu correo al iniciar sesión.' : 'Añade una capa extra de seguridad a tu cuenta. Recibirás un código por correo electrónico cada vez que inicies sesión.' }}
                    </p>
                    <div class="d-flex align-items-center gap-3">
                      <button 
                        class="btn"
                        [class.btn-danger]="twoFactorEnabled"
                        [class.btn-primary]="!twoFactorEnabled"
                        (click)="toggle2FA()"
                        [disabled]="isLoading2FA">
                        <span *ngIf="!isLoading2FA">
                          <i class="bi" [class.bi-shield-x]="twoFactorEnabled" [class.bi-shield-check]="!twoFactorEnabled"></i>
                          {{ twoFactorEnabled ? 'Deshabilitar 2FA' : 'Habilitar 2FA' }}
                        </span>
                        <span *ngIf="isLoading2FA">
                          <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Procesando...
                        </span>
                      </button>
                      <span *ngIf="twoFactorEnabled" class="badge bg-success">
                        <i class="bi bi-shield-fill-check"></i> Activo
                      </span>
                    </div>
                  </div>

                  <div class="mb-4">
                    <h6>Sesiones Activas</h6>
                    <p class="text-muted">Gestiona tus sesiones en diferentes dispositivos</p>
                    <button class="btn btn-outline-secondary">
                      <i class="bi bi-laptop"></i> Ver Sesiones
                    </button>
                  </div>

                  <div class="alert alert-info">
                    <strong>Nota:</strong> La gestión de sesiones activas estará disponible próximamente.
                  </div>
                </div>
              </div>
            </div>

            <!-- Tab Notificaciones -->
            <div class="tab-pane fade" id="notificaciones" role="tabpanel">
              <div class="card shadow-sm">
                <div class="card-body">
                  <h5 class="card-title mb-4">Preferencias de Notificaciones</h5>
                  
                  <div class="mb-3">
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" id="notif-alquiler" checked>
                      <label class="form-check-label" for="notif-alquiler">
                        Notificaciones de alquileres próximos a vencer
                      </label>
                    </div>
                  </div>

                  <div class="mb-3">
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" id="notif-gastos" checked>
                      <label class="form-check-label" for="notif-gastos">
                        Alertas de gastos inusuales
                      </label>
                    </div>
                  </div>

                  <div class="mb-3">
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" id="notif-reportes">
                      <label class="form-check-label" for="notif-reportes">
                        Resumen semanal de reportes
                      </label>
                    </div>
                  </div>

                  <div class="mb-3">
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" id="notif-email" checked>
                      <label class="form-check-label" for="notif-email">
                        Recibir notificaciones por email
                      </label>
                    </div>
                  </div>

                  <button class="btn btn-primary">
                    <i class="bi bi-check-circle"></i> Guardar Preferencias
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .nav-tabs .nav-link {
      color: #495057;
      border: 1px solid #dee2e6;
    }
    .nav-tabs .nav-link.active {
      color: #0d6efd;
      border-color: #dee2e6 #dee2e6 #fff;
    }
  `]
})
export class ConfiguracionComponent implements OnInit {
  twoFactorEnabled = false;
  isLoading2FA = false;
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.checkUserProfile();
  }

  checkUserProfile() {
    // Obtener el perfil del usuario para saber si tiene 2FA habilitado
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      // Asumimos que el usuario tiene un campo twoFactorEnabled
      // En una implementación real, deberías hacer una llamada al backend
      // para obtener el estado actual de 2FA
      this.twoFactorEnabled = currentUser.twoFactorEnabled || false;
    }
  }

  toggle2FA() {
    if (this.twoFactorEnabled) {
      this.disable2FA();
    } else {
      this.enable2FA();
    }
  }

  enable2FA() {
    this.isLoading2FA = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.enable2FA().subscribe({
      next: (response) => {
        this.isLoading2FA = false;
        this.twoFactorEnabled = response.twoFactorEnabled;
        this.successMessage = '¡Autenticación de dos factores habilitada! A partir de ahora recibirás un código por correo al iniciar sesión.';
      },
      error: (err) => {
        this.isLoading2FA = false;
        this.errorMessage = err.error?.message || 'Error al habilitar 2FA. Por favor, intenta nuevamente.';
      }
    });
  }

  disable2FA() {
    this.isLoading2FA = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.disable2FA().subscribe({
      next: (response) => {
        this.isLoading2FA = false;
        this.twoFactorEnabled = response.twoFactorEnabled;
        this.successMessage = 'Autenticación de dos factores deshabilitada. Ya no recibirás códigos al iniciar sesión.';
      },
      error: (err) => {
        this.isLoading2FA = false;
        this.errorMessage = err.error?.message || 'Error al deshabilitar 2FA. Por favor, intenta nuevamente.';
      }
    });
  }
}
