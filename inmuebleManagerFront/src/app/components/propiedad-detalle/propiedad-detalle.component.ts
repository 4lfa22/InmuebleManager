import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { PropiedadService, Propiedad } from '../../services/propiedad.service';
import { InquilinoService, Inquilino } from '../../services/inquilino.service';
import { AlquilerService, Alquiler } from '../../services/alquiler.service';
import { GastoService, Gasto } from '../../services/gasto.service';
import { ImagenService, Imagen } from '../../services/imagen.service';
import { ResumenFinancieroService, ResumenFinanciero } from '../../services/resumen-financiero.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-propiedad-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container-fluid mt-4">
      <!-- Header con navegación -->
      <div class="row mb-4">
        <div class="col-12">
          <button class="btn btn-secondary mb-3" routerLink="/dashboard">
            <i class="bi bi-arrow-left"></i> Volver al Dashboard
          </button>
          
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h1 class="mb-1">{{ propiedad?.nombre }}</h1>
              <p class="text-muted">{{ propiedad?.direccion }}, {{ propiedad?.ciudad }}</p>
            </div>
            <span class="badge bg-info p-2">{{ propiedad?.tipo }}</span>
          </div>
        </div>
      </div>

      <div *ngIf="propiedad; else cargando">
        <!-- TABS/NAVEGACIÓN -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="btn-group" role="tablist">
              <button 
                class="btn btn-outline-primary"
                [class.active]="tabActivo === 'resumen'"
                (click)="cambiarTab('resumen')">
                <i class="bi bi-speedometer2"></i> Resumen
              </button>
              <button 
                class="btn btn-outline-primary"
                [class.active]="tabActivo === 'alquileres'"
                (click)="cambiarTab('alquileres')">
                <i class="bi bi-receipt"></i> Alquileres
              </button>
              <button 
                class="btn btn-outline-primary"
                [class.active]="tabActivo === 'gastos'"
                (click)="cambiarTab('gastos')">
                <i class="bi bi-wallet2"></i> Gastos
              </button>
            </div>
          </div>
        </div>

        <!-- CONTENIDO DE TABS -->
        
        <!-- TAB: RESUMEN/OVERVIEW -->
        <div *ngIf="tabActivo === 'resumen'">
          <div class="row mb-4">
            <div class="col-md-3">
              <div class="card shadow-sm">
                <div class="card-body text-center">
                  <p class="text-muted small">Ingresos</p>
                  <h3 class="text-success">{{ resumenFinanciero?.ingresosTotales | currency }}</h3>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card shadow-sm">
                <div class="card-body text-center">
                  <p class="text-muted small">Gastos</p>
                  <h3 class="text-danger">{{ resumenFinanciero?.gastosTotales | currency }}</h3>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card shadow-sm">
                <div class="card-body text-center">
                  <p class="text-muted small">Beneficio</p>
                  <h3 [ngClass]="resumenFinanciero?.beneficioNeto >= 0 ? 'text-success' : 'text-danger'">
                    {{ resumenFinanciero?.beneficioNeto | currency }}
                  </h3>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card shadow-sm">
                <div class="card-body text-center">
                  <p class="text-muted small">Rentabilidad</p>
                  <h3 class="text-info">{{ calcularRentabilidad() | number:'1.0-1' }}%</h3>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="card shadow-sm">
                <div class="card-header bg-light">
                  <h5 class="mb-0">Información</h5>
                </div>
                <div class="card-body">
                  <dl class="row">
                    <dt class="col-6">Tipo:</dt>
                    <dd class="col-6">{{ propiedad.tipo }}</dd>
                    <dt class="col-6">Dirección:</dt>
                    <dd class="col-6">{{ propiedad.direccion }}</dd>
                    <dt class="col-6">Ciudad:</dt>
                    <dd class="col-6">{{ propiedad.ciudad }}</dd>
                    <dt class="col-6">Creada:</dt>
                    <dd class="col-6 small">{{ propiedad.createdAt | date:'short' }}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="card shadow-sm">
                <div class="card-header bg-light">
                  <h5 class="mb-0">Estadísticas</h5>
                </div>
                <div class="card-body">
                  <dl class="row">
                    <dt class="col-6">Alquileres:</dt>
                    <dd class="col-6 fw-bold">{{ resumenFinanciero?.numeroAlquileres || 0 }}</dd>
                    <dt class="col-6">Gastos registrados:</dt>
                    <dd class="col-6 fw-bold">{{ resumenFinanciero?.numeroGastos || 0 }}</dd>
                    <dt class="col-6">Inquilinos:</dt>
                    <dd class="col-6 fw-bold">{{ obtenerInquilinosUnicos().length }}</dd>
                    <dt class="col-6">Imágenes:</dt>
                    <dd class="col-6 fw-bold">{{ imagenes.length }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB: ALQUILERES -->
        <div *ngIf="tabActivo === 'alquileres'" class="card shadow-sm">
          <div class="card-header bg-light d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Historial de Alquileres</h5>
            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalAlquiler">
              <i class="bi bi-plus-circle"></i> Nuevo Alquiler
            </button>
          </div>
          <div class="card-body">
            <div *ngIf="alquileres.length > 0; else sinAlquileres">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Inquilino</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Importe</th>
                    <th>Método Pago</th>
                    <th class="text-center" style="width: 50px;">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let alquiler of alquileres">
                    <td>{{ obtenerNombreInquilino(alquiler) }}</td>
                    <td>{{ alquiler.fechaInicio | date:'short' }}</td>
                    <td>{{ alquiler.fechaFin | date:'short' }}</td>
                    <td>{{ alquiler.importeTotal | currency }}</td>
                    <td>{{ alquiler.metodoPago }}</td>
                    <td class="text-center">
                      <button class="btn btn-danger btn-sm" (click)="eliminarAlquiler(alquiler.id)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ng-template #sinAlquileres>
              <p class="text-muted">No hay alquileres registrados</p>
            </ng-template>
          </div>
        </div>

        <!-- TAB: GASTOS -->
        <div *ngIf="tabActivo === 'gastos'" class="card shadow-sm">
          <div class="card-header bg-light d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Gastos</h5>
            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalGasto">
              <i class="bi bi-plus-circle"></i> Agregar
            </button>
          </div>
          <div class="card-body">
            <div *ngIf="gastos.length > 0; else sinGastos">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                    <th class="text-center" style="width: 50px;">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let gasto of gastos">
                    <td>{{ gasto.descripcion }}</td>
                    <td><span class="badge bg-secondary">{{ gasto.tipo || gasto.categoria }}</span></td>
                    <td>{{ (gasto.importe || gasto.monto) | currency }}</td>
                    <td>{{ gasto.fecha | date:'short' }}</td>
                    <td class="text-center">
                      <button class="btn btn-danger btn-sm" (click)="eliminarGasto(gasto.id!)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ng-template #sinGastos>
              <p class="text-muted">No hay gastos registrados</p>
            </ng-template>
          </div>
        </div>

        <!-- GESTIÓN DE PROPIEDAD -->
        <div class="row mt-5">
          <div class="col-12">
            <div class="card border-primary">
              <div class="card-header bg-primary text-white">
                <h5 class="mb-0">⚙️ Gestión de Propiedad</h5>
              </div>
              <div class="card-body">
                <p class="text-muted mb-3">Administra los datos y recursos de esta propiedad</p>
                <div class="d-flex gap-2">
                  <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalEditarPropiedad">
                    <i class="bi bi-pencil-square"></i> Editar Propiedad e Imágenes
                  </button>
                  <button class="btn btn-danger" (click)="eliminarPropiedad()">
                    <i class="bi bi-trash"></i> Eliminar Propiedad
                  </button>
                </div>
                <small class="text-muted d-block mt-2">
                  <i class="bi bi-info-circle"></i> Eliminar esta propiedad eliminará todos sus datos asociados (alquileres, gastos, imágenes). Esta acción no se puede deshacer.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CARGANDO -->
      <ng-template #cargando>
        <div class="alert alert-info text-center">
          <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          Cargando detalles de la propiedad...
        </div>
      </ng-template>

      <!-- ERROR -->
      <div class="alert alert-danger mt-3" *ngIf="error">
        {{ error }}
        <button class="btn btn-sm btn-danger ms-2" (click)="cargarPropiedad()">
          Reintentar
        </button>
      </div>
    </div>

    <!-- MODAL: Nuevo Alquiler con opción de crear inquilino -->
    <div class="modal fade" id="modalAlquiler" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Nuevo Alquiler</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="guardarAlquiler()">
              <!-- Sección Inquilino -->
              <div class="card mb-4">
                <div class="card-header bg-light">
                  <h6 class="mb-0">Inquilino</h6>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Seleccionar inquilino existente</label>
                    <select class="form-select" [(ngModel)]="formularioAlquiler.inquilinoId" name="inquilinoId">
                      <option value="">-- Crear nuevo inquilino --</option>
                      <option *ngFor="let inq of inquilinos" [value]="inq.id">
                        {{ inq.nombre }} {{ inq.apellidos }} ({{ inq.email }})
                      </option>
                    </select>
                  </div>

                  <!-- Mostrar formulario de inquilino si no seleccionó uno existente -->
                  <div *ngIf="!formularioAlquiler.inquilinoId" class="card card-sm mb-3">
                    <div class="card-header bg-warning bg-opacity-10">
                      <h6 class="mb-0 text-warning">Crear nuevo inquilino</h6>
                    </div>
                    <div class="card-body">
                      <div class="row">
                        <div class="col-md-6 mb-2">
                          <label class="form-label">Nombre</label>
                          <input type="text" class="form-control" [(ngModel)]="formularioAlquiler.nuevoInquilino.nombre" name="nuevoNombre" required>
                        </div>
                        <div class="col-md-6 mb-2">
                          <label class="form-label">Apellidos</label>
                          <input type="text" class="form-control" [(ngModel)]="formularioAlquiler.nuevoInquilino.apellidos" name="nuevoApellidos" required>
                        </div>
                        <div class="col-md-6 mb-2">
                          <label class="form-label">Email</label>
                          <input type="email" class="form-control" [(ngModel)]="formularioAlquiler.nuevoInquilino.email" name="nuevoEmail" required>
                        </div>
                        <div class="col-md-6 mb-2">
                          <label class="form-label">Teléfono</label>
                          <input type="tel" class="form-control" [(ngModel)]="formularioAlquiler.nuevoInquilino.telefono" name="nuevoTelefono" required>
                        </div>
                        <div class="col-12 mb-2">
                          <label class="form-label">Documento de Identidad</label>
                          <input type="text" class="form-control" [(ngModel)]="formularioAlquiler.nuevoInquilino.documentoIdentidad" name="nuevoDoc" required>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sección Alquiler -->
              <div class="card mb-4">
                <div class="card-header bg-light">
                  <h6 class="mb-0">Detalles del Alquiler</h6>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Fecha Inicio</label>
                      <input type="date" class="form-control" [(ngModel)]="formularioAlquiler.fechaInicio" name="fechaInicio" required>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Fecha Fin</label>
                      <input type="date" class="form-control" [(ngModel)]="formularioAlquiler.fechaFin" name="fechaFin" required>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Importe Total (€)</label>
                      <input type="number" class="form-control" [(ngModel)]="formularioAlquiler.importeTotal" name="importe" step="0.01" required>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Método de Pago</label>
                      <select class="form-select" [(ngModel)]="formularioAlquiler.metodoPago" name="metodoPago" required>
                        <option value="">-- Seleccionar --</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Tarjeta">Tarjeta</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-primary">Crear Alquiler</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: Nuevo Gasto -->
    <div class="modal fade" id="modalGasto" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Agregar Gasto</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="guardarGasto()">
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <input type="text" class="form-control" [(ngModel)]="formularioGasto.descripcion" name="descripcion" required>
              </div>

              <div class="mb-3">
                <label class="form-label">Categoría</label>
                <select class="form-select" [(ngModel)]="formularioGasto.tipo" name="tipo" required>
                  <option value="">-- Seleccionar --</option>
                  <option value="AGUA">Agua</option>
                  <option value="LUZ">Luz</option>
                  <option value="GAS">Gas</option>
                  <option value="WIFI">WiFi</option>
                  <option value="COMUNIDAD">Comunidad</option>
                  <option value="MANTENIMIENTO">Mantenimiento</option>
                  <option value="SUMINISTROS">Suministros</option>
                  <option value="SEGUROS">Seguros</option>
                  <option value="IMPUESTOS">Impuestos</option>
                  <option value="OTROS">Otros</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">Importe (€)</label>
                <input type="number" class="form-control" [(ngModel)]="formularioGasto.importe" name="importe" step="0.01" required>
              </div>

              <div class="mb-3">
                <label class="form-label">Fecha</label>
                <input type="date" class="form-control" [(ngModel)]="formularioGasto.fecha" name="fecha" required>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-primary">Agregar Gasto</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: Editar Propiedad e Imágenes -->
    <div class="modal fade" id="modalEditarPropiedad" tabindex="-1">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-pencil-square"></i> Editar Propiedad e Imágenes
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <!-- TABS dentro del modal -->
            <ul class="nav nav-tabs mb-4" role="tablist">
              <li class="nav-item">
                <button 
                  class="nav-link active" 
                  data-bs-toggle="tab" 
                  data-bs-target="#tabDatosBasicos"
                  type="button">
                  📋 Datos Básicos
                </button>
              </li>
              <li class="nav-item">
                <button 
                  class="nav-link" 
                  data-bs-toggle="tab" 
                  data-bs-target="#tabImagenes"
                  type="button">
                  🖼️ Imágenes
                </button>
              </li>
            </ul>

            <div class="tab-content">
              <!-- TAB: Datos Básicos -->
              <div class="tab-pane fade show active" id="tabDatosBasicos">
                <form (ngSubmit)="actualizarPropiedad()">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-bold">Nombre de la Propiedad</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        [(ngModel)]="formularioPropiedad.nombre" 
                        name="nombre" 
                        required>
                    </div>

                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-bold">Tipo de Propiedad</label>
                      <select 
                        class="form-select" 
                        [(ngModel)]="formularioPropiedad.tipo" 
                        name="tipo" 
                        required>
                        <option value="Casa">Casa</option>
                        <option value="Apartamento">Apartamento</option>
                        <option value="Oficina">Oficina</option>
                        <option value="Local">Local Comercial</option>
                        <option value="Garaje">Garaje</option>
                      </select>
                    </div>

                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-bold">Dirección</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        [(ngModel)]="formularioPropiedad.direccion" 
                        name="direccion" 
                        required>
                    </div>

                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-bold">Ciudad</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        [(ngModel)]="formularioPropiedad.ciudad" 
                        name="ciudad" 
                        required>
                    </div>
                  </div>

                  <div class="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                      Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary">
                      <i class="bi bi-save"></i> Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>

              <!-- TAB: Imágenes -->
              <div class="tab-pane fade" id="tabImagenes">
                <div class="mb-4">
                  <h6 class="fw-bold mb-3">Subir nueva imagen</h6>
                  <div class="input-group">
                    <input 
                      type="file" 
                      class="form-control" 
                      (change)="seleccionarArchivo($event)" 
                      accept="image/*">
                    <button 
                      class="btn btn-primary" 
                      (click)="subirImagen()" 
                      [disabled]="!archivoSeleccionado">
                      <i class="bi bi-upload"></i> Subir
                    </button>
                  </div>
                </div>

                <hr>

                <h6 class="fw-bold mb-3">Imágenes de la Propiedad ({{ imagenes.length }})</h6>
                
                <div *ngIf="imagenes.length > 0; else sinImagenesModal">
                  <div class="row">
                    <div class="col-md-4 mb-3" *ngFor="let imagen of imagenes">
                      <div class="card h-100 shadow-sm">
                        <img 
                          [src]="imagen.url" 
                          class="card-img-top" 
                          alt="Imagen" 
                          style="height: 200px; object-fit: cover;">
                        <div class="card-body d-flex flex-column">
                          <button 
                            class="btn btn-danger btn-sm mt-auto" 
                            (click)="eliminarImagen(imagen.id)">
                            <i class="bi bi-trash"></i> Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <ng-template #sinImagenesModal>
                  <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> No hay imágenes cargadas para esta propiedad
                  </div>
                </ng-template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-group {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .btn-outline-primary {
      border-color: #0d6efd;
      color: #0d6efd;
    }
    .btn-outline-primary:hover {
      background-color: #0d6efd;
      border-color: #0d6efd;
      color: white;
    }
    .btn-outline-primary.active {
      background-color: #0d6efd;
      border-color: #0d6efd;
      color: white;
    }
    .btn-group .btn {
      flex: 1;
      min-width: 120px;
    }
    @media (max-width: 768px) {
      .btn-group {
        flex-direction: column;
      }
      .btn-group .btn {
        flex: unset;
      }
    }
  `]
})
export class PropiedadDetalleComponent implements OnInit {
  propiedad: Propiedad | null = null;
  error: string = '';
  propiedadId: number = 0;
  tabActivo: string = 'resumen'; // TAB activo en lugar de seccionActiva

  // Datos para las diferentes secciones
  inquilinos: Inquilino[] = [];
  alquileres: Alquiler[] = [];
  gastos: Gasto[] = [];
  imagenes: Imagen[] = [];
  resumenFinanciero: any = null;

  // Para manejo de archivos
  archivoSeleccionado: File | null = null;

  // Para formulario de alquiler con inquilino inline
  formularioAlquiler: any = {
    inquilinoId: '',
    fechaInicio: '',
    fechaFin: '',
    importeTotal: '',
    metodoPago: '',
    nuevoInquilino: {
      nombre: '',
      apellidos: '',
      email: '',
      telefono: '',
      documentoIdentidad: ''
    }
  };

  // Para formulario de gasto
  formularioGasto: any = {
    descripcion: '',
    tipo: '',
    importe: '',
    fecha: ''
  };

  // Para formulario de edición de propiedad
  formularioPropiedad: any = {
    nombre: '',
    direccion: '',
    ciudad: '',
    tipo: ''
  };

  constructor(
    private route: ActivatedRoute,
    private propiedadService: PropiedadService,
    private inquilinoService: InquilinoService,
    private alquilerService: AlquilerService,
    private gastoService: GastoService,
    private imagenService: ImagenService,
    private resumenFinancieroService: ResumenFinancieroService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.propiedadId = params['id'];
      this.cargarPropiedad();
      this.cargarTodasLasSecciones(); // Cargar datos en background
    });
  }

  cargarPropiedad() {
    this.error = '';
    this.propiedadService.obtenerPorId(this.propiedadId).subscribe({
      next: (propiedad) => {
        this.propiedad = propiedad;
        this.cargarDatosEnFormularioPropiedad();
        this.cargarResumenFinanciero(); // Cargar resumen para el overview
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles de la propiedad';
        console.error(err);
      }
    });
  }

  cargarDatosEnFormularioPropiedad() {
    if (this.propiedad) {
      this.formularioPropiedad = {
        nombre: this.propiedad.nombre,
        direccion: this.propiedad.direccion,
        ciudad: this.propiedad.ciudad,
        tipo: this.propiedad.tipo
      };
    }
  }

  cargarTodasLasSecciones() {
    // Cargar todos los datos en background mientras el usuario ve el overview
    this.cargarInquilinos();
    this.cargarAlquileres();
    this.cargarGastos();
    this.cargarImagenes();
  }

  cambiarTab(tab: string) {
    this.tabActivo = tab;
    
    // Recargar datos según la pestaña seleccionada
    switch(tab) {
      case 'resumen':
        this.cargarResumenFinanciero();
        break;
      case 'alquileres':
        this.cargarAlquileres();
        break;
      case 'gastos':
        this.cargarGastos();
        break;
    }
  }

  // ============== INQUILINOS (carga desde alquileres) ==============
  cargarInquilinos() {
    // Los inquilinos se cargan indirectamente desde los alquileres
    // Aquí solo cargamos para el dropdown del modal de alquiler
    const usuario = this.authService.getCurrentUser();
    if (usuario?.id) {
      this.inquilinoService.obtenerPorUsuario(usuario.id).subscribe({
        next: (datos) => {
          this.inquilinos = datos;
        },
        error: (err) => {
          console.error('Error cargando inquilinos:', err);
        }
      });
    }
  }

  // ============== ALQUILERES ==============
  guardarAlquiler() {
    // Validar que tengamos un inquilino (existente o nuevo)
    if (!this.formularioAlquiler.inquilinoId && 
        (!this.formularioAlquiler.nuevoInquilino.nombre || 
         !this.formularioAlquiler.nuevoInquilino.apellidos ||
         !this.formularioAlquiler.nuevoInquilino.email ||
         !this.formularioAlquiler.nuevoInquilino.telefono ||
         !this.formularioAlquiler.nuevoInquilino.documentoIdentidad)) {
      alert('Por favor completa los datos del inquilino');
      return;
    }

    // Validar datos del alquiler
    if (!this.formularioAlquiler.fechaInicio || !this.formularioAlquiler.fechaFin || 
        !this.formularioAlquiler.importeTotal || !this.formularioAlquiler.metodoPago) {
      alert('Por favor completa todos los campos del alquiler');
      return;
    }

    // Si es un inquilino nuevo, crearlo primero
    if (!this.formularioAlquiler.inquilinoId) {
      const nuevoInquilino: any = {
        nombre: this.formularioAlquiler.nuevoInquilino.nombre,
        apellidos: this.formularioAlquiler.nuevoInquilino.apellidos,
        email: this.formularioAlquiler.nuevoInquilino.email,
        telefono: this.formularioAlquiler.nuevoInquilino.telefono,
        documentoIdentidad: this.formularioAlquiler.nuevoInquilino.documentoIdentidad
      };

      this.inquilinoService.crear(nuevoInquilino).subscribe({
        next: (inquilinoCreado) => {
          // Ahora crear el alquiler con el inquilino que acabamos de crear
          this.crearAlquilerConInquilino(inquilinoCreado.id);
        },
        error: (err) => {
          console.error('Error al crear inquilino:', err);
          alert('Error al crear el inquilino: ' + (err.error?.message || err.message || 'Error desconocido'));
        }
      });
    } else {
      // Crear alquiler directamente
      this.crearAlquilerConInquilino(this.formularioAlquiler.inquilinoId);
    }
  }

  private crearAlquilerConInquilino(inquilinoId: number) {
    const alquilerData: any = {
      inquilinoId: inquilinoId,
      propiedadId: this.propiedadId,
      fechaInicio: this.formularioAlquiler.fechaInicio,
      fechaFin: this.formularioAlquiler.fechaFin,
      importeTotal: parseFloat(this.formularioAlquiler.importeTotal),
      metodoPago: this.formularioAlquiler.metodoPago
    };

    this.alquilerService.crear(alquilerData).pipe(
      catchError((err) => {
        // Si el error es 201 Created, considerarlo como éxito
        if (err.status === 201) {
          return of({ success: true });
        }
        throw err;
      })
    ).subscribe({
      next: () => {
        this.limpiarFormularioAlquiler();
        this.cargarAlquileres();
        this.cargarInquilinos(); // Actualizar lista de inquilinos disponibles
        alert('Alquiler creado correctamente');
        const modalEl = document.getElementById('modalAlquiler');
        if (modalEl) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
          modal?.hide();
        }
      },
      error: (err) => {
        console.error('Error al crear alquiler:', err);
        alert('Error al crear el alquiler: ' + (err.error?.message || err.message || 'Error desconocido'));
      }
    });
  }

  private limpiarFormularioAlquiler() {
    this.formularioAlquiler = {
      inquilinoId: '',
      fechaInicio: '',
      fechaFin: '',
      importeTotal: '',
      metodoPago: '',
      nuevoInquilino: {
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        documentoIdentidad: ''
      }
    };
  }

  obtenerNombreInquilino(alquiler: any): string {
    if (alquiler?.inquilino) {
      return `${alquiler.inquilino.nombre} ${alquiler.inquilino.apellidos}`;
    }
    const inquilino = this.inquilinos.find(i => i.id === alquiler?.inquilinoId);
    return inquilino ? `${inquilino.nombre} ${inquilino.apellidos}` : 'Desconocido';
  }

  // ============== ALQUILERES ==============
  cargarAlquileres() {
    this.alquilerService.obtenerPorPropiedad(this.propiedadId).subscribe({
      next: (datos) => {
        this.alquileres = datos;
        // También cargar inquilinos para mostrar sus nombres
        if (this.inquilinos.length === 0) {
          this.cargarInquilinos();
        }
      },
      error: (err) => {
        console.error('Error cargando alquileres:', err);
      }
    });
  }

  abrirFormularioAlquiler() {
    // Limpiar formulario
    this.limpiarFormularioAlquiler();
    // El modal se abre con data-bs-toggle en el template
  }

  eliminarAlquiler(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este alquiler?')) {
      this.alquilerService.eliminar(id).subscribe({
        next: () => {
          this.cargarAlquileres();
        },
        error: (err) => {
          this.error = 'Error al eliminar alquiler';
          console.error(err);
        }
      });
    }
  }

  // ============== GASTOS ==============
  cargarGastos() {
    this.gastoService.obtenerPorPropiedad(this.propiedadId).subscribe({
      next: (datos) => {
        this.gastos = datos;
      },
      error: (err) => {
        console.error('Error cargando gastos:', err);
      }
    });
  }

  abrirFormularioGasto() {
    // El modal se abre con data-bs-toggle desde el template
  }

  guardarGasto() {
    if (!this.formularioGasto.descripcion || !this.formularioGasto.tipo || !this.formularioGasto.importe || !this.formularioGasto.fecha) {
      alert('Por favor completa todos los campos del gasto');
      return;
    }

    const gastoData = {
      descripcion: this.formularioGasto.descripcion,
      tipo: this.formularioGasto.tipo,
      importe: parseFloat(this.formularioGasto.importe),
      fecha: this.formularioGasto.fecha, // Será una string YYYY-MM-DD
      propiedadId: this.propiedadId
    };

    console.log('Enviando gasto:', gastoData);

    this.gastoService.crear(gastoData).subscribe({
      next: () => {
        // Cerrar modal
        const modal = document.getElementById('modalGasto');
        if (modal) {
          const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
          if (bootstrapModal) {
            bootstrapModal.hide();
          }
        }
        // Limpiar formulario
        this.formularioGasto = {
          descripcion: '',
          tipo: '',
          importe: '',
          fecha: ''
        };
        // Recargar gastos
        this.cargarGastos();
      },
      error: (err) => {
        console.error('Error response:', err);
        alert('Error al crear el gasto: ' + (err.error?.message || err.message || 'Error desconocido'));
      }
    });
  }

  eliminarGasto(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este gasto?')) {
      this.gastoService.eliminar(id).subscribe({
        next: () => {
          this.cargarGastos();
        },
        error: (err) => {
          this.error = 'Error al eliminar gasto';
          console.error(err);
        }
      });
    }
  }

  // ============== IMÁGENES ==============
  cargarImagenes() {
    this.imagenService.obtenerPorPropiedad(this.propiedadId).subscribe({
      next: (datos) => {
        this.imagenes = datos;
      },
      error: (err) => {
        console.error('Error cargando imágenes:', err);
      }
    });
  }

  seleccionarArchivo(event: any) {
    const archivo = event.target.files[0];
    if (archivo) {
      this.archivoSeleccionado = archivo;
    }
  }

  subirImagen() {
    if (this.archivoSeleccionado) {
      this.imagenService.subirArchivo(this.propiedadId, this.archivoSeleccionado).subscribe({
        next: () => {
          this.archivoSeleccionado = null;
          this.cargarImagenes();
          alert('Imagen subida correctamente');
        },
        error: (err) => {
          this.error = 'Error al subir imagen';
          console.error(err);
        }
      });
    }
  }

  eliminarImagen(id: number) {
    if (confirm('¿Está seguro de que desea eliminar esta imagen?')) {
      this.imagenService.eliminar(id).subscribe({
        next: () => {
          this.cargarImagenes();
        },
        error: (err) => {
          this.error = 'Error al eliminar imagen';
          console.error(err);
        }
      });
    }
  }

  // ============== RESUMEN FINANCIERO ==============
  cargarResumenFinanciero() {
    this.resumenFinancieroService.obtenerPorPropiedad(this.propiedadId).subscribe({
      next: (datos) => {
        this.resumenFinanciero = datos;
      },
      error: (err) => {
        console.error('Error cargando resumen financiero:', err);
      }
    });
  }

  calcularRentabilidad(): number {
    if (!this.resumenFinanciero || this.resumenFinanciero.ingresosTotales === 0) {
      return 0;
    }
    return (this.resumenFinanciero.beneficioNeto / this.resumenFinanciero.ingresosTotales) * 100;
  }

  // ============== OBTENER INQUILINOS ÚNICOS ==============
  obtenerInquilinosUnicos(): any[] {
    // Extraer inquilinos únicos de los alquileres de esta propiedad
    const inquilinosMap = new Map<number, any>();
    
    this.alquileres.forEach(alquiler => {
      if (alquiler.inquilino && alquiler.inquilino.id) {
        inquilinosMap.set(alquiler.inquilino.id, alquiler.inquilino);
      }
    });
    
    return Array.from(inquilinosMap.values());
  }

  // ============== EDITAR PROPIEDAD ==============
  actualizarPropiedad() {
    if (!this.formularioPropiedad.nombre || !this.formularioPropiedad.direccion || 
        !this.formularioPropiedad.ciudad || !this.formularioPropiedad.tipo) {
      alert('Por favor completa todos los campos');
      return;
    }

    const propiedadActualizada = {
      nombre: this.formularioPropiedad.nombre,
      direccion: this.formularioPropiedad.direccion,
      ciudad: this.formularioPropiedad.ciudad,
      tipo: this.formularioPropiedad.tipo
    };

    this.propiedadService.actualizar(this.propiedadId, propiedadActualizada as Propiedad).subscribe({
      next: () => {
        alert('Propiedad actualizada correctamente');
        this.cargarPropiedad(); // Recargar para ver los cambios
        // Cerrar el modal
        const modalElement = document.getElementById('modalEditarPropiedad');
        if (modalElement) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
          modal?.hide();
        }
      },
      error: (err) => {
        this.error = 'Error al actualizar la propiedad';
        console.error(err);
      }
    });
  }

  // ============== ELIMINAR PROPIEDAD ==============
  eliminarPropiedad() {
    if (confirm('⚠️ ADVERTENCIA: ¿Está completamente seguro de que desea eliminar esta propiedad y TODOS sus datos (inquilinos, alquileres, gastos, imágenes)? Esta acción NO se puede deshacer.')) {
      this.propiedadService.eliminar(this.propiedadId).subscribe({
        next: () => {
          alert('Propiedad eliminada correctamente');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error = 'Error al eliminar propiedad';
          console.error(err);
        }
      });
    }
  }
}
