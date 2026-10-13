import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';

export interface Producto {
  id?: number;
  nombre: string;
  precio: number;
  categoria: string;
}

export interface Factura {
  id?: number;
  folio: string;
  cliente: string;
  fecha: string;
  total: number;
  metodo: string;
}

export interface NuevaFacturaPayload {
  cliente: string;
  metodo: 'Efectivo' | 'Tarjeta' | 'Transferencia';
  total: number;
  items: Array<{ nombre: string; cantidad: number; precioUnitario: number }>;
}

@Injectable({ providedIn: 'root' })
export class VentasService {
  private readonly http = inject(HttpClient);
  private readonly base = `${API_BASE_URL}/ventas`;

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.base}/productos`);
  }

  getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.base}/facturas`);
  }

  crearFactura(payload: NuevaFacturaPayload): Observable<Factura> {
    return this.http.post<Factura>(`${this.base}/facturas`, payload);
  }
}
