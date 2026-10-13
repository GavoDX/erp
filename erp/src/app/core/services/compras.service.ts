import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';

export interface OrdenCompra {
  id?: number;
  orden: string;
  proveedor: string;
  insumos: string;
  fecha: string;
  total: number;
  estado: 'Pendiente' | 'Recibida' | 'Cancelada';
}

export interface Proveedor {
  id?: number;
  nombre: string;
  contacto: string;
  categoria: string;
}

@Injectable({ providedIn: 'root' })
export class ComprasService {
  private readonly http = inject(HttpClient);
  private readonly base = `${API_BASE_URL}/compras`;

  getOrdenes(): Observable<OrdenCompra[]> {
    return this.http.get<OrdenCompra[]>(`${this.base}/ordenes`);
  }

  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.base}/proveedores`);
  }
}
