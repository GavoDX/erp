import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';

export interface Movimiento {
  id?: number;
  fecha: string;
  concepto: string;
  categoria: string;
  tipo: 'Ingreso' | 'Egreso';
  monto: number;
}

@Injectable({ providedIn: 'root' })
export class ContabilidadService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}/contabilidad/movimientos`;

  getMovimientos(): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(this.url);
  }
}
