import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GastoService, Gasto } from '../../services/gasto.service';
import { PropiedadService, Propiedad } from '../../services/propiedad.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container-fluid mt-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h1 class="mb-0">💰 Gestión de Gastos</h1>
              <p class="text-muted small mt-2">Administra y filtra todos los gastos de tus propiedades</p>
            </div>
            <button class="btn btn-secondary" routerLink="/dashboard">
              <i class="bi bi-arrow-left"></i> Volver al Dashboard
            </button>
          </div>
        </div>
      </div>

      <!-- Resumen rápido -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card shadow-sm border-danger">
            <div class="card-body text-center">
              <p class="text-muted small mb-1">Total Gastos</p>
              <h3 class="text-danger fw-bold mb-0">{{ calcularTotalGastos() | currency }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card shadow-sm border-info">
            <div class="card-body text-center">
              <p class="text-muted small mb-1">Número de Gastos</p>
              <h3 class="text-info fw-bold mb-0">{{ gastosFiltrados.length }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card shadow-sm border-warning">
            <div class="card-body text-center">
              <p class="text-muted small mb-1">Gasto Promedio</p>
              <h3 class="text-warning fw-bold mb-0">{{ calcularPromedioGastos() | currency }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card shadow-sm border-secondary">
            <div class="card-body text-center">
              <p class="text-muted small mb-1">Propiedades</p>
              <h3 class="text-secondary fw-bold mb-0">{{ propiedades.length }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel de Filtros -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-light">
              <h5 class="mb-0">
                <i class="bi bi-funnel"></i> Filtros
                <button class="btn btn-sm btn-outline-secondary float-end" (click)="limpiarFiltros()">
                  <i class="bi bi-x-circle"></i> Limpiar Filtros
                </button>
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <!-- Filtro por Propiedad -->
                <div class="col-md-3 mb-3">
                  <label class="form-label fw-bold">Propiedad</label>
                  <select class="form-select" [(ngModel)]="filtros.propiedadId" (change)="aplicarFiltros()">
                    <option value="">Todas las propiedades</option>
                    <option *ngFor="let prop of propiedades" [value]="prop.id">
                      {{ prop.nombre }}
                    </option>
                  </select>
                </div>

                <!-- Filtro por Tipo de Gasto -->
                <div class="col-md-3 mb-3">
                  <label class="form-label fw-bold">Tipo de Gasto</label>
                  <select class="form-select" [(ngModel)]="filtros.tipo" (change)="aplicarFiltros()">
                    <option value="">Todos los tipos</option>
                    <option value="AGUA">💧 Agua</option>
                    <option value="LUZ">💡 Luz</option>
                    <option value="GAS">🔥 Gas</option>
                    <option value="WIFI">📡 WiFi</option>
                    <option value="COMUNIDAD">🏢 Comunidad</option>
                    <option value="MANTENIMIENTO">🔧 Mantenimiento</option>
                    <option value="SUMINISTROS">📦 Suministros</option>
                    <option value="SEGUROS">🛡️ Seguros</option>
                    <option value="IMPUESTOS">🏛️ Impuestos</option>
                    <option value="OTROS">📝 Otros</option>
                  </select>
                </div>

                <!-- Filtro por Fecha Desde -->
                <div class="col-md-3 mb-3">
                  <label class="form-label fw-bold">Fecha Desde</label>
                  <input type="date" class="form-control" [(ngModel)]="filtros.fechaDesde" (change)="aplicarFiltros()">
                </div>

                <!-- Filtro por Fecha Hasta -->
                <div class="col-md-3 mb-3">
                  <label class="form-label fw-bold">Fecha Hasta</label>
                  <input type="date" class="form-control" [(ngModel)]="filtros.fechaHasta" (change)="aplicarFiltros()">
                </div>

                <!-- Filtro por Importe Mínimo -->
                <div class="col-md-3 mb-3">
                  <label class="form-label fw-bold">Importe Mínimo (€)</label>
                  <input type="number" class="form-control" [(ngModel)]="filtros.importeMin" (change)="aplicarFiltros()" step="0.01" min="0">
                </div>

                <!-- Filtro por Importe Máximo -->
                <div class="col-md-3 mb-3">
                  <label class="form-label fw-bold">Importe Máximo (€)</label>
                  <input type="number" class="form-control" [(ngModel)]="filtros.importeMax" (change)="aplicarFiltros()" step="0.01" min="0">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de Gastos -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Listado de Gastos ({{ gastosFiltrados.length }})</h5>
              <button class="btn btn-sm btn-primary" (click)="exportarCSV()">
                <i class="bi bi-download"></i> Exportar CSV
              </button>
            </div>
            <div class="card-body">
              <div *ngIf="gastosFiltrados.length > 0; else sinGastos" class="table-responsive">
                <table class="table table-hover table-striped">
                  <thead class="table-light">
                    <tr>
                      <th>Propiedad</th>
                      <th>Descripción</th>
                      <th>Categoría</th>
                      <th class="text-end">Importe</th>
                      <th>Fecha</th>
                      <th class="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let gasto of gastosFiltrados">
                      <td>
                        <a [routerLink]="['/propiedad', gasto.propiedadId]" class="text-decoration-none">
                          {{ obtenerNombrePropiedad(gasto.propiedadId) }}
                        </a>
                      </td>
                      <td>{{ gasto.descripcion }}</td>
                      <td>
                        <span class="badge" [ngClass]="obtenerColorCategoria(gasto.tipo || gasto.categoria)">
                          {{ obtenerIconoCategoria(gasto.tipo || gasto.categoria) }} {{ gasto.tipo || gasto.categoria }}
                        </span>
                      </td>
                      <td class="text-end fw-bold text-danger">{{ (gasto.importe || gasto.monto) | currency }}</td>
                      <td>{{ gasto.fecha | date:'dd/MM/yyyy' }}</td>
                      <td class="text-center">
                        <button class="btn btn-sm btn-danger" (click)="eliminarGasto(gasto.id!)" title="Eliminar">
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot class="table-light">
                    <tr>
                      <td colspan="3" class="text-end fw-bold">TOTAL:</td>
                      <td class="text-end fw-bold text-danger">{{ calcularTotalGastos() | currency }}</td>
                      <td colspan="2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <ng-template #sinGastos>
                <div class="alert alert-info text-center">
                  <i class="bi bi-info-circle me-2"></i>
                  No hay gastos que coincidan con los filtros aplicados
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje de error -->
      <div class="alert alert-danger mt-3" *ngIf="error">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .table-responsive {
      max-height: 600px;
      overflow-y: auto;
    }
    .badge {
      font-size: 0.85rem;
      padding: 0.4em 0.6em;
    }
  `]
})
export class GastosComponent implements OnInit {
  gastos: Gasto[] = [];
  gastosFiltrados: Gasto[] = [];
  propiedades: Propiedad[] = [];
  error: string = '';

  filtros = {
    propiedadId: '',
    tipo: '',
    fechaDesde: '',
    fechaHasta: '',
    importeMin: null as number | null,
    importeMax: null as number | null
  };

  constructor(
    private gastoService: GastoService,
    private propiedadService: PropiedadService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarPropiedades();
    this.cargarGastos();
  }

  cargarPropiedades() {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.propiedadService.listarPorUsuario(user.id).subscribe({
        next: (propiedades) => {
          this.propiedades = propiedades;
          console.log('Propiedades cargadas:', this.propiedades); // Debug
        },
        error: (err) => {
          console.error('Error cargando propiedades:', err);
        }
      });
    }
  }

  cargarGastos() {
    // Cargar todos los gastos de todas las propiedades del usuario
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.propiedadService.listarPorUsuario(user.id).subscribe({
        next: (propiedades) => {
          const promesas = propiedades.map(prop => 
            this.gastoService.obtenerPorPropiedad(prop.id!).toPromise()
          );
          
          Promise.all(promesas).then(resultados => {
            this.gastos = resultados.flat().filter(g => g !== undefined) as Gasto[];
            console.log('Gastos cargados:', this.gastos); // Debug
            console.log('Primer gasto propiedadId:', this.gastos[0]?.propiedadId); // Debug
            this.aplicarFiltros();
          }).catch(err => {
            console.error('Error en Promise.all:', err);
            this.error = 'Error al cargar gastos';
          });
        },
        error: (err) => {
          this.error = 'Error al cargar gastos';
          console.error(err);
        }
      });
    }
  }

  aplicarFiltros() {
    console.log('Aplicando filtros:', this.filtros); // Debug
    this.gastosFiltrados = this.gastos.filter(gasto => {
      // Filtro por propiedad
      if (this.filtros.propiedadId) {
        const propiedadIdFiltro = parseInt(this.filtros.propiedadId);
        if (gasto.propiedadId !== propiedadIdFiltro) {
          return false;
        }
      }

      // Filtro por tipo
      if (this.filtros.tipo && (gasto.tipo || gasto.categoria) !== this.filtros.tipo) {
        return false;
      }

      // Filtro por fecha desde
      if (this.filtros.fechaDesde) {
        const fechaGasto = new Date(gasto.fecha);
        const fechaDesde = new Date(this.filtros.fechaDesde);
        if (fechaGasto < fechaDesde) {
          return false;
        }
      }

      // Filtro por fecha hasta
      if (this.filtros.fechaHasta) {
        const fechaGasto = new Date(gasto.fecha);
        const fechaHasta = new Date(this.filtros.fechaHasta);
        if (fechaGasto > fechaHasta) {
          return false;
        }
      }

      // Filtro por importe mínimo
      if (this.filtros.importeMin !== null) {
        const importe = gasto.importe || gasto.monto || 0;
        if (importe < this.filtros.importeMin) {
          return false;
        }
      }

      // Filtro por importe máximo
      if (this.filtros.importeMax !== null) {
        const importe = gasto.importe || gasto.monto || 0;
        if (importe > this.filtros.importeMax) {
          return false;
        }
      }

      return true;
    });
    console.log('Gastos filtrados:', this.gastosFiltrados); // Debug
  }

  limpiarFiltros() {
    this.filtros = {
      propiedadId: '',
      tipo: '',
      fechaDesde: '',
      fechaHasta: '',
      importeMin: null,
      importeMax: null
    };
    this.aplicarFiltros();
  }

  calcularTotalGastos(): number {
    return this.gastosFiltrados.reduce((sum, gasto) => 
      sum + (gasto.importe || gasto.monto || 0), 0
    );
  }

  calcularPromedioGastos(): number {
    if (this.gastosFiltrados.length === 0) return 0;
    return this.calcularTotalGastos() / this.gastosFiltrados.length;
  }

  obtenerNombrePropiedad(propiedadId: number): string {
    console.log('Buscando propiedad con ID:', propiedadId, 'Tipo:', typeof propiedadId); // Debug
    const propiedad = this.propiedades.find(p => {
      console.log('Comparando con propiedad ID:', p.id, 'Tipo:', typeof p.id); // Debug
      return p.id === propiedadId;
    });
    const resultado = propiedad?.nombre || 'Desconocida';
    console.log('Resultado:', resultado); // Debug
    return resultado;
  }

  obtenerColorCategoria(tipo: string | undefined): string {
    if (!tipo) return 'bg-secondary';
    const colores: {[key: string]: string} = {
      'AGUA': 'bg-info',
      'LUZ': 'bg-warning',
      'GAS': 'bg-danger',
      'WIFI': 'bg-primary',
      'COMUNIDAD': 'bg-secondary',
      'MANTENIMIENTO': 'bg-dark',
      'SUMINISTROS': 'bg-success',
      'SEGUROS': 'bg-info',
      'IMPUESTOS': 'bg-danger',
      'OTROS': 'bg-secondary'
    };
    return colores[tipo] || 'bg-secondary';
  }

  obtenerIconoCategoria(tipo: string | undefined): string {
    if (!tipo) return '📝';
    const iconos: {[key: string]: string} = {
      'AGUA': '💧',
      'LUZ': '💡',
      'GAS': '🔥',
      'WIFI': '📡',
      'COMUNIDAD': '🏢',
      'MANTENIMIENTO': '🔧',
      'SUMINISTROS': '📦',
      'SEGUROS': '🛡️',
      'IMPUESTOS': '🏛️',
      'OTROS': '📝'
    };
    return iconos[tipo] || '📝';
  }

  eliminarGasto(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este gasto?')) {
      this.gastoService.eliminar(id).subscribe({
        next: () => {
          this.cargarGastos();
          alert('Gasto eliminado correctamente');
        },
        error: (err) => {
          this.error = 'Error al eliminar el gasto';
          console.error(err);
        }
      });
    }
  }

  exportarCSV() {
    const headers = ['Propiedad', 'Descripción', 'Categoría', 'Importe', 'Fecha'];
    const rows = this.gastosFiltrados.map(gasto => [
      this.obtenerNombrePropiedad(gasto.propiedadId!),
      gasto.descripcion,
      gasto.tipo || gasto.categoria,
      (gasto.importe || gasto.monto || 0).toFixed(2),
      new Date(gasto.fecha).toLocaleDateString('es-ES')
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `gastos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
