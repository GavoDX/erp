import { exportCsv } from '../../core/export-csv';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { InventarioService, Insumo } from '../../core/services/inventario.service';

@Component({
  selector: 'app-inventario',
  imports: [DecimalPipe],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class Inventario implements OnInit {
  private readonly inventarioService = inject(InventarioService);

  protected readonly insumos = signal<Insumo[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.inventarioService.getInsumos().subscribe({
      next: (data) => {
        this.insumos.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los datos de demostración. Verifica que la API esté corriendo.');
        this.cargando.set(false);
      },
    });
  }

  protected nivel(insumo: Insumo): number {
    const porcentaje = (insumo.stockActual / (insumo.stockMinimo * 2)) * 100;
    return Math.min(porcentaje, 100);
  }

  protected estado(insumo: Insumo): 'OK' | 'Bajo' {
    return insumo.stockActual < insumo.stockMinimo ? 'Bajo' : 'OK';
  }

  protected readonly stockBajo = computed(() => this.insumos().filter((i) => this.estado(i) === 'Bajo').length);
  protected readonly valorInventario = computed(() =>
    this.insumos().reduce((acc, i) => acc + i.stockActual * i.valorUnitario, 0)
  );
  protected exportar() { exportCsv('inventario-demo.csv',['Nombre','Categoría','Stock','Mínimo','Unidad','Valor unitario'],this.insumos().map(i=>[i.nombre,i.categoria,i.stockActual,i.stockMinimo,i.unidad,i.valorUnitario])); }
}
