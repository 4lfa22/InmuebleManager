import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiBaseUrl } from '../environment';

export interface Propiedad {
  id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  tipo: string;
  usuarioId?: number;
  createdAt?: string;
  updatedAt?: string;
}

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
}

@Injectable({
  providedIn: 'root'
})
export class PropiedadService {
  private apiUrl = `${getApiBaseUrl()}/api/propiedades`;

  constructor(private http: HttpClient) { }

  listar(): Observable<Propiedad[]> {
    return this.http.get<Propiedad[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Propiedad> {
    return this.http.get<Propiedad>(`${this.apiUrl}/${id}`);
  }

  listarPorUsuario(usuarioId: number): Observable<Propiedad[]> {
    return this.http.get<Propiedad[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  listarPorCiudad(ciudad: string): Observable<Propiedad[]> {
    return this.http.get<Propiedad[]>(`${this.apiUrl}/ciudad/${ciudad}`);
  }

  crear(propiedad: Propiedad): Observable<Propiedad> {
    return this.http.post<Propiedad>(this.apiUrl, propiedad);
  }

  actualizar(id: number, propiedad: Propiedad): Observable<Propiedad> {
    return this.http.put<Propiedad>(`${this.apiUrl}/${id}`, propiedad);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obtenerResumen(id: number): Observable<ResumenFinanciero> {
    return this.http.get<ResumenFinanciero>(`${this.apiUrl}/${id}/resumen`);
  }

  obtenerResumenPorFechas(id: number, inicio: string, fin: string): Observable<ResumenFinanciero> {
    return this.http.get<ResumenFinanciero>(
      `${this.apiUrl}/${id}/resumen/fechas?inicio=${inicio}&fin=${fin}`
    );
  }
}
