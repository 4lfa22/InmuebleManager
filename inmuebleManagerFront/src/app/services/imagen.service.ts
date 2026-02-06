import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getApiBaseUrl } from '../environment';

export interface Imagen {
  id: number;
  imagenData: string;
  orden: number;
  propiedadId: number;
  createdAt: Date;
  updatedAt: Date;
  url?: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImagenService {
  private apiUrl = `${getApiBaseUrl()}/api/imagenes`;

  constructor(private http: HttpClient) { }

  obtenerPorPropiedad(propiedadId: number): Observable<Imagen[]> {
    return this.http.get<Imagen[]>(`${this.apiUrl}/propiedad/${propiedadId}`).pipe(
      map(imagenes => imagenes.map(img => ({
        ...img,
        url: `data:image/jpeg;base64,${img.imagenData}`,
        descripcion: `Imagen ${img.orden || 1}`
      })) as any)
    );
  }

  obtenerPorId(id: number): Observable<Imagen> {
    return this.http.get<Imagen>(`${this.apiUrl}/${id}`);
  }

  crear(imagen: Imagen): Observable<Imagen> {
    return this.http.post<Imagen>(this.apiUrl, imagen);
  }

  subirArchivo(propiedadId: number, archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('propiedadId', propiedadId.toString());
    return this.http.post<any>(`${this.apiUrl}/upload`, formData).pipe(
      map(img => ({
        ...img,
        url: `data:image/jpeg;base64,${img.imagenData}`,
        descripcion: `Imagen ${img.orden || 1}`
      }))
    );
  }

  actualizar(id: number, imagen: Imagen): Observable<Imagen> {
    return this.http.put<Imagen>(`${this.apiUrl}/${id}`, imagen);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  listar(): Observable<Imagen[]> {
    return this.http.get<Imagen[]>(this.apiUrl);
  }
}

