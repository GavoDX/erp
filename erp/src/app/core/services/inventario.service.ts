import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';

export interface Insumo {
  id?: number;
  nombre: string;
  categoria: string;
  stockActual: number;
  stockMinimo: number;
  unidad: string;
  valorUnitario: number;
}

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}/inventario/insumos`;

  getInsumos(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(this.url);
  }

  crearInsumo(insumo: Insumo): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.url, insumo);
  }
}
