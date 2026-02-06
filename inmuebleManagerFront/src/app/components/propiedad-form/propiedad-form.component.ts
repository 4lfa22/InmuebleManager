import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PropiedadService, Propiedad } from '../../services/propiedad.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-propiedad-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <h1>Agregar Nueva Propiedad</h1>
          <hr>

          <form (ngSubmit)="guardarPropiedad()" #form="ngForm">
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre de la Propiedad</label>
              <input 
                type="text" 
                class="form-control" 
                id="nombre"
                [(ngModel)]="propiedad.nombre"
                name="nombre"
                required>
            </div>

            <div class="mb-3">
              <label for="direccion" class="form-label">Dirección</label>
              <input 
                type="text" 
                class="form-control" 
                id="direccion"
                [(ngModel)]="propiedad.direccion"
                name="direccion"
                required>
            </div>

            <div class="mb-3">
              <label for="ciudad" class="form-label">Ciudad</label>
              <input 
                type="text" 
                class="form-control" 
                id="ciudad"
                [(ngModel)]="propiedad.ciudad"
                name="ciudad"
                required>
            </div>

            <div class="mb-3">
              <label for="tipo" class="form-label">Tipo de Propiedad</label>
              <select 
                class="form-control" 
                id="tipo"
                [(ngModel)]="propiedad.tipo"
                name="tipo"
                required>
                <option value="">Selecciona un tipo</option>
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Oficina">Oficina</option>
                <option value="Local">Local Comercial</option>
                <option value="Garaje">Garaje</option>
              </select>
            </div>

            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary" [disabled]="!form.valid">
                Guardar Propiedad
              </button>
              <button type="button" class="btn btn-secondary" (click)="cancelar()">
                Cancelar
              </button>
            </div>
          </form>

          <div class="alert alert-danger mt-3" *ngIf="error">
            {{ error }}
          </div>

          <div class="alert alert-success mt-3" *ngIf="exito">
            Propiedad creada exitosamente
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PropiedadFormComponent implements OnInit {
  propiedad: Partial<Propiedad> = {
    nombre: '',
    direccion: '',
    ciudad: '',
    tipo: ''
  };
  error: string = '';
  exito: string = '';

  constructor(
    private propiedadService: PropiedadService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.propiedad.usuarioId = user.id;
    }
  }

  guardarPropiedad() {
    const user = this.authService.getCurrentUser();
    if (!user || !user.id) {
      this.error = 'Usuario no autenticado';
      return;
    }

    // Validar campos requeridos
    if (!this.propiedad.nombre || !this.propiedad.direccion || !this.propiedad.ciudad || !this.propiedad.tipo) {
      this.error = 'Todos los campos son requeridos';
      return;
    }

    this.propiedad.usuarioId = user.id;

    this.propiedadService.crear(this.propiedad as Propiedad).subscribe({
      next: (response) => {
        this.exito = 'Propiedad creada exitosamente';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al crear la propiedad';
      }
    });
  }

  cancelar() {
    this.router.navigate(['/dashboard']);
  }
}
