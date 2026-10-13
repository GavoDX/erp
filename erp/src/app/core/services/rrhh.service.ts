import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';

export interface Empleado {
  id?: number;
  nombre: string;
  puesto: string;
  turno: string;
  estado: 'Activo' | 'En descanso';
}

@Injectable({ providedIn: 'root' })
export class RrhhService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}/rrhh/empleados`;

  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.url);
  }
}
