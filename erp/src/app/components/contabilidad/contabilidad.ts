import { exportCsv } from '../../core/export-csv';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ContabilidadService, Movimiento } from '../../core/services/contabilidad.service';

@Component({
  selector: 'app-contabilidad',
  imports: [DecimalPipe],
  templateUrl: './contabilidad.html',
  styleUrl: './contabilidad.css',
})
export class Contabilidad implements OnInit {
  private readonly contabilidadService = inject(ContabilidadService);

  protected readonly movimientos = signal<Movimiento[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly cuentasPorPagar = 5460;

  ngOnInit(): void {
    this.contabilidadService.getMovimientos().subscribe({
      next: (data) => {
        this.movimientos.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los datos de demostración. Verifica que la API esté corriendo.');
        this.cargando.set(false);
      },
    });
  }

  protected readonly totalIngresos = computed(() =>
    this.movimientos()
      .filter((m) => m.tipo === 'Ingreso')
      .reduce((acc, m) => acc + m.monto, 0)
  );

  protected readonly totalEgresos = computed(() =>
    this.movimientos()
      .filter((m) => m.tipo === 'Egreso')
      .reduce((acc, m) => acc + m.monto, 0)
  );

  protected readonly utilidadNeta = computed(() => this.totalIngresos() - this.totalEgresos());
  protected exportar() { exportCsv('contabilidad-demo.csv',['Fecha','Concepto','Categoría','Tipo','Monto'],this.movimientos().map(m=>[m.fecha,m.concepto,m.categoria,m.tipo,m.monto])); }
}
