import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiBaseUrl } from '../environment';

export interface Inquilino {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  documentoIdentidad: string;
  propiedadId: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class InquilinoService {
  private apiUrl = `${getApiBaseUrl()}/api/inquilinos`;

  constructor(private http: HttpClient) { }

  obtenerPorPropiedad(propiedadId: number): Observable<Inquilino[]> {
    return this.http.get<Inquilino[]>(`${this.apiUrl}/propiedad/${propiedadId}`);
  }

  obtenerPorId(id: number): Observable<Inquilino> {
    return this.http.get<Inquilino>(`${this.apiUrl}/${id}`);
  }

  crear(inquilino: Inquilino): Observable<Inquilino> {
    return this.http.post<Inquilino>(this.apiUrl, inquilino);
  }

  actualizar(id: number, inquilino: Inquilino): Observable<Inquilino> {
    return this.http.put<Inquilino>(`${this.apiUrl}/${id}`, inquilino);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  listar(): Observable<Inquilino[]> {
    return this.http.get<Inquilino[]>(this.apiUrl);
  }

  obtenerPorUsuario(usuarioId: number): Observable<Inquilino[]> {
    return this.http.get<Inquilino[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }
}
