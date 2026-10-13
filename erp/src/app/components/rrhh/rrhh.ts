import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RrhhService, Empleado } from '../../core/services/rrhh.service';

@Component({
  selector: 'app-rrhh',
  imports: [],
  templateUrl: './rrhh.html',
  styleUrl: './rrhh.css',
})
export class Rrhh implements OnInit {
  private readonly rrhhService = inject(RrhhService);

  protected readonly dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  protected readonly empleados = signal<Empleado[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly calendario = [
    { turno: 'Matutino', color: 'turno-matutino', dias: [1, 1, 1, 1, 1, 0, 0] },
    { turno: 'Vespertino', color: 'turno-vespertino', dias: [1, 1, 1, 1, 1, 0, 0] },
    { turno: 'Fin de semana', color: 'turno-finde', dias: [0, 0, 0, 0, 0, 1, 1] },
  ];

  ngOnInit(): void {
    this.rrhhService.getEmpleados().subscribe({
      next: (data) => {
        this.empleados.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los datos de demostración. Verifica que la API esté corriendo.');
        this.cargando.set(false);
      },
    });
  }

  protected readonly activos = computed(() => this.empleados().filter((e) => e.estado === 'Activo').length);
}
