import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { PropiedadService, Propiedad } from '../../services/propiedad.service';
import { AuthService } from '../../services/auth.service';
import { ResumenFinancieroService, ResumenFinanciero } from '../../services/resumen-financiero.service';
import { AlquilerService, Alquiler } from '../../services/alquiler.service';
import { GastoService } from '../../services/gasto.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-fluid mt-4">
      <!-- ENCABEZADO PRINCIPAL -->
      <div class="row mb-5">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h1 class="mb-0">🏢 Control Financiero</h1>
              <p class="text-muted small mt-2">Administra y analiza el desempeño de tus propiedades</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-danger" routerLink="/gastos">
                <i class="bi bi-wallet2"></i> Gestión de Gastos
              </button>
              <button class="btn btn-success btn-lg" routerLink="/propiedades/nueva">
                <i class="bi bi-plus-circle"></i> Agregar Propiedad
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN 1: DATOS GLOBALES -->
      <div class="row mb-5">
        <div class="col-12">
          <div class="mb-4">
            <h4 class="text-primary fw-bold mb-1">📊 Datos Globales</h4>
            <p class="text-muted small">Resumen histórico de todas tus propiedades (sin filtros)</p>
          </div>
        </div>

        <!-- KPI Cards Globales -->
        <div class="col-md-6 col-lg-2 mb-3">
          <div class="card shadow-sm h-100 border-primary border-2">
            <div class="card-body text-center">
              <p class="text-muted small mb-2">💰 Beneficio Total</p>
              <h3 [ngClass]="kpiGlobal.beneficioTotal >= 0 ? 'text-success' : 'text-danger'" class="fw-bold">
                {{ kpiGlobal.beneficioTotal | currency }}
              </h3>
              <small class="text-muted">Ingresos - Gastos</small>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-2 mb-3">
          <div class="card shadow-sm h-100 border-success border-2">
            <div class="card-body text-center">
              <p class="text-muted small mb-2">📈 Ingresos</p>
              <h3 class="text-success fw-bold">{{ kpiGlobal.ingresosTotales | currency }}</h3>
              <small class="text-muted">Todos los alquileres</small>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-2 mb-3">
          <div class="card shadow-sm h-100 border-danger border-2">
            <div class="card-body text-center">
              <p class="text-muted small mb-2">📉 Gastos</p>
              <h3 class="text-danger fw-bold">{{ kpiGlobal.gastosTotales | currency }}</h3>
              <small class="text-muted">Todos los gastos</small>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-2 mb-3">
          <div class="card shadow-sm h-100 border-info border-2">
            <div class="card-body text-center">
              <p class="text-muted small mb-2">🏠 Propiedades</p>
              <h3 class="text-info fw-bold">{{ propiedades.length }}</h3>
              <small class="text-muted">En tu cartera</small>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-2 mb-3">
          <div class="card shadow-sm h-100 border-warning border-2">
            <div class="card-body text-center">
              <p class="text-muted small mb-2">📅 Ocupación Actual</p>
              <h3 class="text-warning fw-bold">{{ kpiGlobal.ocupacionMedia | number:'1.0-0' }}%</h3>
              <small class="text-muted">Promedio hoy</small>
            </div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN 2: SELECCIONAR PERÍODO -->
      <div class="row mb-5">
        <div class="col-12">
          <div class="card bg-light shadow-sm border-0">
            <div class="card-body">
              <h4 class="text-primary fw-bold mb-3">
                <i class="bi bi-calendar3"></i> Seleccionar Período de Análisis
              </h4>
              <p class="text-muted mb-4">Elige el mes y año para ver el desempeño detallado de tus propiedades en ese período</p>
              
              <div class="row">
                <div class="col-md-5">
                  <label class="form-label fw-bold mb-2">📅 Mes</label>
                  <select class="form-select form-select-lg" [value]="mesSeleccionado" (change)="cambiarMes($event)">
                    <option value="0">Enero</option>
                    <option value="1">Febrero</option>
                    <option value="2">Marzo</option>
                    <option value="3">Abril</option>
                    <option value="4">Mayo</option>
                    <option value="5">Junio</option>
                    <option value="6">Julio</option>
                    <option value="7">Agosto</option>
                    <option value="8">Septiembre</option>
                    <option value="9">Octubre</option>
                    <option value="10">Noviembre</option>
                    <option value="11">Diciembre</option>
                  </select>
                </div>

                <div class="col-md-5">
                  <label class="form-label fw-bold mb-2">📆 Año</label>
                  <select class="form-select form-select-lg" [value]="anioSeleccionado" (change)="cambiarAnio($event)">
                    <option *ngFor="let ano of aniosDisponibles" [value]="ano">{{ ano }}</option>
                  </select>
                </div>

                <div class="col-md-2 d-flex align-items-end">
                  <button class="btn btn-primary btn-lg w-100" (click)="restablecerFiltros()" title="Volver a la fecha actual">
                    <i class="bi bi-arrow-counterclockwise"></i> Hoy
                  </button>
                </div>
              </div>

              <div class="alert alert-info mt-3 mb-0">
                <small>
                  <i class="bi bi-info-circle"></i>
                  Mostrando datos de <strong>{{ obtenerNombreMes(mesSeleccionado) }} de {{ anioSeleccionado }}</strong>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN 3: DATOS DEL PERÍODO SELECCIONADO -->
      <div class="row mb-5">
        <div class="col-12">
          <div class="mb-4">
            <h4 class="text-success fw-bold mb-1">🎯 Análisis del Período Seleccionado</h4>
            <p class="text-muted small">Resultados financieros para {{ obtenerNombreMes(mesSeleccionado) }} {{ anioSeleccionado }}</p>
          </div>
        </div>

        <!-- KPI Cards Dinámicos -->
        <div class="col-md-6 col-lg-2 mb-3">
          <div class="card shadow-sm h-100 border-success border-2">
            <div class="card-body text-center">
              <p class="text-muted small mb-2">💰 Beneficio</p>
              <h3 [ngClass]="kpiDinamico.beneficioTotal >= 0 ? 'text-success' : 'text-danger'" class="fw-bold">
                {{ kpiDinamico.beneficioTotal | currency }}
              </h3>
              <small class="text-muted">Este período</small>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-2 mb-3">
          <div class="card shadow-sm h-100 border-success border-2">
            <div class="card-body text-center">
              <p class="text-muted small mb-2">📈 Ingresos</p>
              <h3 class="text-success fw-bold">{{ kpiDinamico.ingresosTotales | currency }}</h3>
              <small class="text-muted">Alquileres prorratados</small>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-2 mb-3">
          <div class="card shadow-sm h-100 border-danger border-2">
            <div class="card-body text-center">
              <p class="text-muted small mb-2">📉 Gastos</p>
              <h3 class="text-danger fw-bold">{{ kpiDinamico.gastosTotales | currency }}</h3>
              <small class="text-muted">Del período</small>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-2 mb-3">
          <div class="card shadow-sm h-100 border-secondary border-2">
            <div class="card-body text-center">
              <p class="text-muted small mb-2">📊 Variación</p>
              <h3 [ngClass]="(kpiDinamico.beneficioTotal - kpiGlobal.beneficioTotal / 12) >= 0 ? 'text-success' : 'text-danger'" class="fw-bold">
                {{ ((kpiDinamico.beneficioTotal - kpiGlobal.beneficioTotal / 12) | currency) }}
              </h3>
              <small class="text-muted">vs promedio</small>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-2 mb-3">
          <div class="card shadow-sm h-100 border-warning border-2">
            <div class="card-body text-center">
              <p class="text-muted small mb-2">📅 Ocupación</p>
              <h3 class="text-warning fw-bold">{{ kpiDinamico.ocupacionMedia | number:'1.0-0' }}%</h3>
              <small class="text-muted">Promedio de propiedades</small>
            </div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN 4: LISTADO DE PROPIEDADES -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="mb-4">
            <h4 class="text-dark fw-bold mb-1">🏠 Mis Propiedades</h4>
            <p class="text-muted small">Detalle de cada propiedad con su estado y rentabilidad</p>
          </div>
        </div>
      </div>

      <div *ngIf="propiedades.length === 0" class="row">
        <div class="col-12">
          <div class="alert alert-info">
            No tienes propiedades registradas. 
            <a routerLink="/propiedades/nueva" class="alert-link">Crea una ahora</a>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 col-lg-4" *ngFor="let propiedad of propiedades">
          <div class="card mb-4 shadow-sm h-100 cursor-pointer" (click)="verDetalles(propiedad.id)">
            <div class="card-body">
              <!-- Encabezado con Estado -->
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h5 class="card-title mb-1">{{ propiedad.nombre }}</h5>
                  <p class="card-text text-muted small">{{ propiedad.direccion }}</p>
                </div>
                <span [ngClass]="obtenerEstadoClase(propiedad.id)" class="badge">
                  {{ obtenerEstado(propiedad.id) }}
                </span>
              </div>

              <div class="mb-3">
                <span class="badge bg-info">{{ propiedad.tipo }}</span>
                <span class="badge bg-secondary">{{ propiedad.ciudad }}</span>
              </div>

                <div class="row text-center small">
                <div class="col-6 mb-2">
                  <p class="text-muted mb-1">Beneficio Mes</p>
                  <p [ngClass]="obtenerBeneficioMes(propiedad.id) >= 0 ? 'text-success fw-bold' : 'text-danger fw-bold'">
                    {{ obtenerBeneficioMes(propiedad.id) | currency }}
                  </p>
                </div>
                <div class="col-6 mb-2">
                  <p class="text-muted mb-1">Ocupación {{ obtenerNombreMes(mesSeleccionado) }}</p>
                  <p class="text-primary fw-bold">{{ obtenerOcupacionPropiedad(propiedad.id) | number:'1.0-0' }}%</p>
                </div>
              </div>

              <!-- Botón Ver Detalles -->
              <button class="btn btn-primary btn-sm w-100" (click)="verDetalles(propiedad.id); $event.stopPropagation()">
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cursor-pointer {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .cursor-pointer:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
    }
  `]
})
export class DashboardComponent implements OnInit {
  propiedades: Propiedad[] = [];
  resumenes: Map<number, ResumenFinanciero> = new Map();
  alquileresPorPropiedad: Map<number, Alquiler[]> = new Map();
  gastosPorPropiedad: Map<number, any[]> = new Map();
  
  // Filtros
  mesSeleccionado: number = new Date().getMonth();
  anioSeleccionado: number = new Date().getFullYear();
  aniosDisponibles: number[] = [];
  
  // KPIs Globales (sin filtros, datos totales)
  kpiGlobal = {
    beneficioTotal: 0,
    ingresosTotales: 0,
    gastosTotales: 0,
    ocupacionMedia: 0
  };

  // KPIs Dinámicos (con filtros de mes/año)
  kpiDinamico = {
    beneficioTotal: 0,
    ingresosTotales: 0,
    gastosTotales: 0,
    ocupacionMedia: 0
  };

  constructor(
    private propiedadService: PropiedadService,
    private authService: AuthService,
    private resumenFinancieroService: ResumenFinancieroService,
    private alquilerService: AlquilerService,
    private gastoService: GastoService,
    private router: Router
  ) { }

  ngOnInit() {
    // Generar años disponibles (desde 2020 hasta próximo año)
    const anioActual = new Date().getFullYear();
    this.aniosDisponibles = [];
    for (let i = 2020; i <= anioActual + 1; i++) {
      this.aniosDisponibles.push(i);
    }
    
    this.cargarPropiedades();
  }

  cargarPropiedades() {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.propiedadService.listarPorUsuario(user.id).subscribe({
        next: (propiedades) => {
          this.propiedades = propiedades;
          this.cargarResumenesPropiedades();
          this.cargarAlquileresPropiedades();
          this.cargarGastosPropiedades();
        },
        error: (error) => console.error('Error al cargar propiedades', error)
      });
    } else {
      console.warn('Usuario no autenticado o sin ID');
    }
  }

  cargarResumenesPropiedades() {
    this.propiedades.forEach(propiedad => {
      this.resumenFinancieroService.obtenerPorPropiedad(propiedad.id).subscribe({
        next: (resumen) => {
          this.resumenes.set(propiedad.id, resumen);
          this.recalcularKPIsGlobal();
          this.recalcularKPIsDinamicos();
        },
        error: (error) => console.error(`Error al cargar resumen propiedad ${propiedad.id}`, error)
      });
    });
  }

  cargarAlquileresPropiedades() {
    this.propiedades.forEach(propiedad => {
      this.alquilerService.obtenerPorPropiedad(propiedad.id).subscribe({
        next: (alquileres) => {
          this.alquileresPorPropiedad.set(propiedad.id, alquileres);
          this.recalcularKPIsGlobal();
          this.recalcularKPIsDinamicos();
        },
        error: (error) => console.error(`Error al cargar alquileres propiedad ${propiedad.id}`, error)
      });
    });
  }

  cargarGastosPropiedades() {
    this.propiedades.forEach(propiedad => {
      this.gastoService.obtenerPorPropiedad(propiedad.id).subscribe({
        next: (gastos) => {
          this.gastosPorPropiedad.set(propiedad.id, gastos);
          this.recalcularKPIsGlobal();
          this.recalcularKPIsDinamicos();
        },
        error: (error) => console.error(`Error al cargar gastos propiedad ${propiedad.id}`, error)
      });
    });
  }

  recalcularKPIsGlobal() {
    this.kpiGlobal.beneficioTotal = 0;
    this.kpiGlobal.ingresosTotales = 0;
    this.kpiGlobal.gastosTotales = 0;

    // Calcular ingresos totales (sin filtro de fechas)
    this.propiedades.forEach(propiedad => {
      const alquileres = this.alquileresPorPropiedad.get(propiedad.id) || [];
      alquileres.forEach(alquiler => {
        this.kpiGlobal.ingresosTotales += (alquiler.importeTotal || 0);
      });
    });

    // Calcular gastos totales (sin filtro de fechas)
    this.propiedades.forEach(propiedad => {
      const gastos = this.gastosPorPropiedad.get(propiedad.id) || [];
      gastos.forEach((gasto: any) => {
        this.kpiGlobal.gastosTotales += (gasto.importe || 0);
      });
    });

    this.kpiGlobal.beneficioTotal = this.kpiGlobal.ingresosTotales - this.kpiGlobal.gastosTotales;

    // Para ocupación global: calcular promedio de ocupación actual
    let ocupacionTotal = 0;
    let contadorPropiedades = 0;
    this.alquileresPorPropiedad.forEach((alquileres, propiedadId) => {
      const hoy = new Date();
      const ocupacion = this.calcularOcupacionReal(alquileres, hoy.getMonth(), hoy.getFullYear());
      ocupacionTotal += ocupacion;
      contadorPropiedades++;
    });
    
    if (contadorPropiedades > 0) {
      this.kpiGlobal.ocupacionMedia = ocupacionTotal / contadorPropiedades;
    }
  }

  recalcularKPIsDinamicos() {
    this.kpiDinamico.beneficioTotal = 0;
    this.kpiDinamico.ingresosTotales = 0;
    this.kpiDinamico.gastosTotales = 0;
    let ocupacionTotal = 0;
    let contadorPropiedades = 0;

    // Definir rango de fechas para el mes/año seleccionado
    const primerDia = new Date(this.anioSeleccionado, this.mesSeleccionado, 1);
    const ultimoDia = new Date(this.anioSeleccionado, this.mesSeleccionado + 1, 0);

    // Calcular ingresos del mes seleccionado
    this.propiedades.forEach(propiedad => {
      const alquileresMes = this.alquileresPorPropiedad.get(propiedad.id) || [];
      let ingresosMes = 0;
      
      alquileresMes.forEach(alquiler => {
        const fechaInicio = new Date(alquiler.fechaInicio);
        const fechaFin = new Date(alquiler.fechaFin);
        
        // Si el alquiler se solapa con el mes seleccionado
        if (fechaFin >= primerDia && fechaInicio <= ultimoDia) {
          // Calcular días del alquiler en este mes
          const inicio = fechaInicio > primerDia ? fechaInicio : primerDia;
          const fin = fechaFin < ultimoDia ? fechaFin : ultimoDia;
          const diasEnMes = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24) + 1;
          
          // Prorratear el alquiler por días en el mes
          const diasTotalesAlquiler = (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24) + 1;
          const montoProrrateado = (alquiler.importeTotal || 0) * (diasEnMes / diasTotalesAlquiler);
          ingresosMes += montoProrrateado;
        }
      });
      
      this.kpiDinamico.ingresosTotales += ingresosMes;
    });

    // Calcular gastos del mes seleccionado
    this.propiedades.forEach(propiedad => {
      const gastosMes = this.gastosPorPropiedad.get(propiedad.id) || [];
      gastosMes.forEach((gasto: any) => {
        const fechaGasto = new Date(gasto.fecha);
        if (fechaGasto >= primerDia && fechaGasto <= ultimoDia) {
          this.kpiDinamico.gastosTotales += (gasto.importe || 0);
        }
      });
    });

    this.kpiDinamico.beneficioTotal = this.kpiDinamico.ingresosTotales - this.kpiDinamico.gastosTotales;

    // Calcular ocupación media basada en alquileres reales
    this.alquileresPorPropiedad.forEach((alquileres, propiedadId) => {
      const ocupacion = this.calcularOcupacionReal(alquileres, this.mesSeleccionado, this.anioSeleccionado);
      ocupacionTotal += ocupacion;
      contadorPropiedades++;
    });

    if (contadorPropiedades > 0) {
      this.kpiDinamico.ocupacionMedia = ocupacionTotal / contadorPropiedades;
    }
  }

  /**
   * Calcula el porcentaje de ocupación real basado en alquileres
   */
  private calcularOcupacionReal(alquileres: Alquiler[], mes: number, anio: number): number {
    if (alquileres.length === 0) return 0;

    const mesActual = mes;
    const anioActual = anio;

    // Primer y último día del mes actual
    const primerDia = new Date(anioActual, mesActual, 1);
    const ultimoDia = new Date(anioActual, mesActual + 1, 0);
    const diasDelMes = ultimoDia.getDate();

    let diasAlquilados = 0;

    alquileres.forEach(alquiler => {
      const fechaInicio = new Date(alquiler.fechaInicio);
      const fechaFin = new Date(alquiler.fechaFin);

      // Verificar si el alquiler se solapa con el mes actual
      if (fechaFin >= primerDia && fechaInicio <= ultimoDia) {
        // Calcular días de solapamiento
        const inicio = fechaInicio > primerDia ? fechaInicio : primerDia;
        const fin = fechaFin < ultimoDia ? fechaFin : ultimoDia;

        // Incluir el último día
        const diferenciaDias = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24) + 1;
        diasAlquilados += Math.max(0, diferenciaDias);
      }
    });

    // Retornar porcentaje basado en días del mes
    return (diasAlquilados / diasDelMes) * 100;
  }

  obtenerResumenPropiedad(propiedadId: number): ResumenFinanciero | undefined {
    return this.resumenes.get(propiedadId);
  }

  obtenerOcupacionPropiedad(propiedadId: number): number {
    const alquileres = this.alquileresPorPropiedad.get(propiedadId) || [];
    return this.calcularOcupacionReal(alquileres, this.mesSeleccionado, this.anioSeleccionado);
  }

  obtenerEstado(propiedadId: number): string {
    const ocupacion = this.obtenerOcupacionPropiedad(propiedadId);
    if (ocupacion >= 90) return '🟢 Alquilada';
    if (ocupacion >= 50) return '🟡 Parcial';
    return '🔴 Libre';
  }

  obtenerEstadoClase(propiedadId: number): string {
    const ocupacion = this.obtenerOcupacionPropiedad(propiedadId);
    if (ocupacion >= 90) return 'bg-success';
    if (ocupacion >= 50) return 'bg-warning';
    return 'bg-danger';
  }

  obtenerBeneficioMes(propiedadId: number): number {
    const resumen = this.resumenes.get(propiedadId);
    if (!resumen) return 0;
    
    // El beneficio neto ya es mensual según el backend
    return resumen.beneficioNeto || 0;
  }

  obtenerNombreMes(mes: number): string {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return meses[mes];
  }

  cambiarMes(event: any) {
    this.mesSeleccionado = parseInt(event.target.value, 10);
    this.aplicarFiltros();
  }

  cambiarAnio(event: any) {
    this.anioSeleccionado = parseInt(event.target.value, 10);
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    // Recalcular solo los KPIs dinámicos con los filtros seleccionados
    this.recalcularKPIsDinamicos();
  }

  restablecerFiltros() {
    // Volver a la fecha actual
    this.mesSeleccionado = new Date().getMonth();
    this.anioSeleccionado = new Date().getFullYear();
    this.aplicarFiltros();
  }

  verDetalles(propiedadId: number) {
    this.router.navigate(['/propiedad', propiedadId]);
  }
}

