import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { VentasService, Producto, Factura } from '../../core/services/ventas.service';

interface ItemPedido extends Producto {
  cantidad: number;
}

@Component({
  selector: 'app-ventas',
  imports: [DecimalPipe],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css',
})
export class Ventas implements OnInit {
  private readonly ventasService = inject(VentasService);

  protected readonly categorias = ['Todos', 'Bebidas calientes', 'Bebidas frías', 'Alimentos', 'Postres'];
  protected readonly categoriaActiva = signal('Todos');

  protected readonly productos = signal<Producto[]>([]);
  protected readonly facturas = signal<Factura[]>([]);
  protected readonly cargando = signal(true);
  protected readonly cobrando = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.ventasService.getProductos().subscribe({
      next: (data) => {
        this.productos.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los datos de demostración. Verifica que la API esté corriendo.');
        this.cargando.set(false);
      },
    });

    this.ventasService.getFacturas().subscribe({
      next: (data) => this.facturas.set(data),
      error: () => {
        // el aviso de error de productos ya cubre el problema de conexión
      },
    });
  }

  protected readonly productosFiltrados = computed(() => {
    const cat = this.categoriaActiva();
    return cat === 'Todos' ? this.productos() : this.productos().filter((p) => p.categoria === cat);
  });

  protected readonly pedido = signal<ItemPedido[]>([]);
  protected readonly metodosPago: Array<'Efectivo' | 'Tarjeta' | 'Transferencia'> = [
    'Efectivo',
    'Tarjeta',
    'Transferencia',
  ];
  protected readonly metodoPago = signal<'Efectivo' | 'Tarjeta' | 'Transferencia'>('Tarjeta');

  protected readonly subtotal = computed(() =>
    this.pedido().reduce((acc, i) => acc + i.precio * i.cantidad, 0)
  );

  protected readonly descuento = computed(() => Math.round(this.subtotal() * 0.1 * 100) / 100);
  protected readonly total = computed(() => this.subtotal() - this.descuento());

  protected filtrarPorCategoria(categoria: string) {
    this.categoriaActiva.set(categoria);
  }

  protected agregarProducto(producto: Producto) {
    this.pedido.update((items) => {
      const existente = items.find((i) => i.nombre === producto.nombre);
      if (existente) {
        return items.map((i) => (i.nombre === producto.nombre ? { ...i, cantidad: i.cantidad + 1 } : i));
      }
      return [...items, { ...producto, cantidad: 1 }];
    });
  }

  protected quitarProducto(nombre: string) {
    this.pedido.update((items) => items.filter((i) => i.nombre !== nombre));
  }

  protected seleccionarMetodo(metodo: 'Efectivo' | 'Tarjeta' | 'Transferencia') {
    this.metodoPago.set(metodo);
  }

  protected cobrar() {
    if (this.cobrando() || this.pedido().length === 0) {
      return;
    }
    this.cobrando.set(true);
    this.error.set(null);
    const payload = {
      cliente: 'Consumidor final',
      metodo: this.metodoPago(),
      total: this.total(),
      items: this.pedido().map((i) => ({ nombre: i.nombre, cantidad: i.cantidad, precioUnitario: i.precio })),
    };
    this.ventasService.crearFactura(payload).subscribe({
      next: (factura) => {
        this.cobrando.set(false);
        this.facturas.update((f) => [factura, ...f]);
        this.pedido.set([]);
      },
      error: () => {
        this.cobrando.set(false);
        this.error.set('No se pudo registrar el pedido de demostración.');
      },
    });
  }
}
