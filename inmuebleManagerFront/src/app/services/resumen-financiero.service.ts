import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiBaseUrl } from '../environment';

export interface ResumenFinanciero {
  propiedadId: number;
  nombrePropiedad: string;
  ingresosTotales: number;
  gastosTotales: number;
  beneficioNeto: number;
  gastosPorTipo: any;
  numeroAlquileres: number;
  numeroGastos: number;
  fechaInicio?: string;
  fechaFin?: string;
  
  // Propiedades adicionales para compatibilidad con el componente
  ingresos?: number;
  gastos?: number;
  ganancia?: number;
  rentabilidad?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ResumenFinancieroService {
  private apiUrl = `${getApiBaseUrl()}/api/resumen-financiero`;

  constructor(private http: HttpClient) { }

  obtenerPorPropiedad(propiedadId: number): Observable<ResumenFinanciero> {
    return this.http.get<ResumenFinanciero>(`${this.apiUrl}/propiedad/${propiedadId}`);
  }

  obtenerPorPropiedadYPeriodo(propiedadId: number, periodo: string): Observable<ResumenFinanciero> {
    return this.http.get<ResumenFinanciero>(`${this.apiUrl}/propiedad/${propiedadId}/periodo/${periodo}`);
  }

  obtenerPorUsuario(usuarioId: number): Observable<ResumenFinanciero[]> {
    return this.http.get<ResumenFinanciero[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  listar(): Observable<ResumenFinanciero[]> {
    return this.http.get<ResumenFinanciero[]>(this.apiUrl);
  }
}
