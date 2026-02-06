import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsuarioService, Usuario } from '../../services/usuario.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container mt-5 mb-5">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <!-- Header -->
          <div class="mb-4">
            <button class="btn btn-secondary mb-3" routerLink="/dashboard">
              <i class="bi bi-arrow-left"></i> Volver al Dashboard
            </button>
            <h1 class="mb-3">Mi Perfil</h1>
          </div>

          <!-- Card Perfil -->
          <div class="card shadow-sm">
            <div class="card-body">
              <!-- Avatar -->
              <div class="text-center mb-4">
                <i class="bi bi-person-circle display-1 text-primary"></i>
              </div>

              <div *ngIf="usuario" class="mb-4">
                <!-- Nombre -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Nombre de Usuario</label>
                  <input type="text" class="form-control" [value]="usuario.nombre" disabled>
                </div>

                <!-- Email -->
                <div class="mb-4">
                  <label class="form-label fw-bold">Email</label>
                  <input type="email" class="form-control" [value]="usuario.email" disabled>
                </div>

                <!-- Botones de Acción -->
                <div class="d-flex gap-2">
                  <button class="btn btn-primary" (click)="abrirModalEditar()">
                    <i class="bi bi-pencil-square"></i> Editar Nombre
                  </button>
                  <button class="btn btn-warning">
                    <i class="bi bi-key"></i> Cambiar Contraseña
                  </button>
                  <button class="btn btn-danger" (click)="abrirModalEliminar()">
                    <i class="bi bi-trash"></i> Eliminar Cuenta
                  </button>
                </div>
              </div>

              <div *ngIf="!usuario" class="text-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Editar Nombre -->
    <div class="modal fade" id="modalEditar" tabindex="-1" #modalEditar>
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Nombre</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Nuevo Nombre</label>
              <input type="text" class="form-control" [(ngModel)]="nuevoNombre" placeholder="Ingresa tu nuevo nombre">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" (click)="guardarNombre()" data-bs-dismiss="modal">
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Eliminar Cuenta -->
    <div class="modal fade" id="modalEliminar" tabindex="-1" #modalEliminar>
      <div class="modal-dialog">
        <div class="modal-content border-danger">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">⚠️ Eliminar Cuenta</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p class="text-danger fw-bold">Esta acción es <strong>irreversible</strong>.</p>
            <p>Se eliminarán permanentemente:</p>
            <ul>
              <li>Tu cuenta de usuario</li>
              <li>Todos tus datos de perfil</li>
              <li>Tus propiedades registradas</li>
              <li>Todos los registros asociados</li>
            </ul>
            <div class="alert alert-warning">
              <strong>¿Estás seguro de que deseas continuar?</strong>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" (click)="eliminarCuenta()" data-bs-dismiss="modal">
              Sí, Eliminar Mi Cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-control:disabled {
      background-color: #f8f9fa;
      border-color: #dee2e6;
    }
  `]
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  nuevoNombre = '';
  modalEditarInstance: any;
  modalEliminarInstance: any;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.usuarioService.obtenerPorId(user.id).subscribe({
        next: (usuario) => {
          this.usuario = usuario;
        },
        error: (err) => {
          console.error('Error al cargar perfil:', err);
        }
      });
    }
  }

  abrirModalEditar() {
    this.nuevoNombre = this.usuario?.nombre || '';
    const modalEl = document.getElementById('modalEditar');
    if (modalEl) {
      this.modalEditarInstance = new (window as any).bootstrap.Modal(modalEl);
      this.modalEditarInstance.show();
    }
  }

  guardarNombre() {
    if (!this.usuario || !this.usuario.id || !this.nuevoNombre.trim()) {
      alert('Por favor ingresa un nombre válido');
      return;
    }

    const usuarioActualizado: Usuario = {
      ...this.usuario,
      nombre: this.nuevoNombre
    };

    this.usuarioService.actualizar(this.usuario.id, usuarioActualizado).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        alert('Nombre actualizado correctamente');
        this.cargarPerfil();
      },
      error: (err) => {
        console.error('Error al actualizar nombre:', err);
        alert('Error al actualizar el nombre');
      }
    });
  }

  abrirModalEliminar() {
    const modalEl = document.getElementById('modalEliminar');
    if (modalEl) {
      this.modalEliminarInstance = new (window as any).bootstrap.Modal(modalEl);
      this.modalEliminarInstance.show();
    }
  }

  eliminarCuenta() {
    if (!this.usuario || !this.usuario.id) {
      alert('Error: no se puede eliminar la cuenta');
      return;
    }

    this.usuarioService.eliminar(this.usuario.id).subscribe({
      next: () => {
        alert('Cuenta eliminada correctamente');
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al eliminar cuenta:', err);
        alert('Error al eliminar la cuenta');
      }
    });
  }
}
