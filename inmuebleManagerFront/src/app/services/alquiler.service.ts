import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiBaseUrl } from '../environment';

export interface Inquilino {
  id: number;
  nombre: string;
  apellidos: string;
}

export interface Alquiler {
  id: number;
  propiedadId: number;
  inquilinoId?: number;
  inquilino?: Inquilino;
  fechaInicio: Date;
  fechaFin: Date;
  importeTotal: number;
  metodoPago: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AlquilerService {
  private apiUrl = `${getApiBaseUrl()}/api/alquileres`;

  constructor(private http: HttpClient) { }

  obtenerPorPropiedad(propiedadId: number): Observable<Alquiler[]> {
    return this.http.get<Alquiler[]>(`${this.apiUrl}/propiedad/${propiedadId}`);
  }

  obtenerPorId(id: number): Observable<Alquiler> {
    return this.http.get<Alquiler>(`${this.apiUrl}/${id}`);
  }

  crear(alquiler: any): Observable<Alquiler> {
    return this.http.post<Alquiler>(this.apiUrl, alquiler);
  }

  actualizar(id: number, alquiler: Alquiler): Observable<Alquiler> {
    return this.http.put<Alquiler>(`${this.apiUrl}/${id}`, alquiler);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  listar(): Observable<Alquiler[]> {
    return this.http.get<Alquiler[]>(this.apiUrl);
  }

  obtenerPorInquilino(inquilinoId: number): Observable<Alquiler[]> {
    return this.http.get<Alquiler[]>(`${this.apiUrl}/inquilino/${inquilinoId}`);
  }
}
