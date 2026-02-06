import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiBaseUrl } from '../environment';

export interface Gasto {
  id?: number;
  descripcion: string;
  importe: number;
  monto?: number; // alias para compatibilidad
  fecha: Date;
  tipo: string;
  categoria?: string; // alias para compatibilidad
  propiedadId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class GastoService {
  private apiUrl = `${getApiBaseUrl()}/api/gastos`;

  constructor(private http: HttpClient) { }

  obtenerPorPropiedad(propiedadId: number): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(`${this.apiUrl}/propiedad/${propiedadId}`);
  }

  obtenerPorId(id: number): Observable<Gasto> {
    return this.http.get<Gasto>(`${this.apiUrl}/${id}`);
  }

  crear(gasto: any): Observable<Gasto> {
    return this.http.post<Gasto>(this.apiUrl, gasto);
  }

  actualizar(id: number, gasto: Gasto): Observable<Gasto> {
    return this.http.put<Gasto>(`${this.apiUrl}/${id}`, gasto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  listar(): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(this.apiUrl);
  }
}
