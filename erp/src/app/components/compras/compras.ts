import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ComprasService, OrdenCompra, Proveedor } from '../../core/services/compras.service';

@Component({
  selector: 'app-compras',
  imports: [DecimalPipe],
  templateUrl: './compras.html',
  styleUrl: './compras.css',
})
export class Compras implements OnInit {
  private readonly comprasService = inject(ComprasService);

  protected readonly ordenes = signal<OrdenCompra[]>([]);
  protected readonly proveedores = signal<Proveedor[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly vistaProveedores = signal(false);

  ngOnInit(): void {
    this.comprasService.getOrdenes().subscribe({
      next: (data) => {
        this.ordenes.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los datos de demostración. Verifica que la API esté corriendo.');
        this.cargando.set(false);
      },
    });

    this.comprasService.getProveedores().subscribe({
      next: (data) => this.proveedores.set(data),
      error: () => {},
    });
  }

  protected readonly pendientes = computed(() => this.ordenes().filter((o) => o.estado === 'Pendiente').length);
  protected readonly recibidas = computed(() => this.ordenes().filter((o) => o.estado === 'Recibida').length);
  protected readonly gastoTotal = computed(() =>
    this.ordenes()
      .filter((o) => o.estado !== 'Cancelada')
      .reduce((acc, o) => acc + o.total, 0)
  );

  protected alternarVista(mostrarProveedores: boolean) {
    this.vistaProveedores.set(mostrarProveedores);
  }
}
