import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, VerifyCodeRequest } from '../../services/auth.service';

@Component({
  selector: 'app-verify-2fa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="verify-2fa-container">
      <div class="card shadow-lg">
        <div class="card-body p-5">
          <div class="text-center mb-4">
            <div class="icon-container mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-shield-lock text-primary" viewBox="0 0 16 16">
                <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
                <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415z"/>
              </svg>
            </div>
            <h3 class="fw-bold">Verificación en dos pasos</h3>
            <p class="text-muted">Hemos enviado un código de 6 dígitos a tu correo electrónico</p>
          </div>

          <form (ngSubmit)="verifyCode()" #verifyForm="ngForm">
            <div class="mb-4">
              <label for="code" class="form-label fw-semibold">Código de verificación</label>
              <input
                type="text"
                class="form-control form-control-lg text-center code-input"
                id="code"
                [(ngModel)]="code"
                name="code"
                placeholder="000000"
                maxlength="6"
                pattern="[0-9]{6}"
                required
                [disabled]="isLoading"
                (input)="onCodeInput($event)"
              >
              <div class="form-text text-center">Ingresa el código de 6 dígitos</div>
            </div>

            <div *ngIf="error" class="alert alert-danger" role="alert">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill me-2" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              {{ error }}
            </div>

            <button
              type="submit"
              class="btn btn-primary btn-lg w-100 mb-3"
              [disabled]="!verifyForm.form.valid || isLoading"
            >
              <span *ngIf="!isLoading">Verificar</span>
              <span *ngIf="isLoading">
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Verificando...
              </span>
            </button>

            <button
              type="button"
              class="btn btn-outline-secondary w-100"
              (click)="cancel()"
              [disabled]="isLoading"
            >
              Cancelar
            </button>
          </form>

          <div class="text-center mt-4">
            <p class="text-muted small mb-0">
              ¿No recibiste el código? 
              <a href="javascript:void(0)" class="text-primary fw-semibold">Reenviar</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .verify-2fa-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .card {
      max-width: 450px;
      width: 100%;
      border: none;
      border-radius: 1rem;
    }

    .icon-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .code-input {
      font-size: 1.5rem;
      letter-spacing: 0.5rem;
      font-weight: 600;
      font-family: 'Courier New', monospace;
    }

    .code-input:focus {
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
    }
  `]
})
export class Verify2FAComponent {
  @Input() email: string = '';
  @Output() verified = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  code: string = '';
  error: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  onCodeInput(event: any) {
    // Solo permitir números
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.code = input.value;
  }

  verifyCode() {
    if (this.code.length !== 6) {
      this.error = 'El código debe tener 6 dígitos';
      return;
    }

    this.error = '';
    this.isLoading = true;

    const request: VerifyCodeRequest = {
      email: this.email,
      code: this.code
    };

    this.authService.verify2FA(request).subscribe({
      next: () => {
        this.isLoading = false;
        this.verified.emit();
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Código incorrecto o expirado';
      }
    });
  }

  cancel() {
    this.cancelled.emit();
  }
}
