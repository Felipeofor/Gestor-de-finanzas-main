import { Component, OnInit } from '@angular/core';

interface Gasto {
  nombre: string;
  detalle: string;
  fechaYHora: string;
  tipo: string;
  precio: number;
}

@Component({
  selector: 'app-gestor-de-gastos',
  templateUrl: './gestor-de-gastos.component.html',
  styleUrls: ['./gestor-de-gastos.component.css']
})
export class GestorDeGastosComponent implements OnInit {
  private readonly storageKey = 'gastos';

  inputNombre: string = '';
  inputDetalle: string = '';
  inputPrecio: number = 0;
  inputTipo: string = '';
  modoEdicion: boolean = false;
  editingIndex: number | null = null;
  errorMessage: string = '';
  gastos: Gasto[] = [];

  ngOnInit(): void {
    this.gastos = this.readGastos();
  }

  get totalGastos(): number {
    return this.gastos.reduce((total, gasto) => total + gasto.precio, 0);
  }

  currency(value: number | bigint): string {
    return new Intl.NumberFormat('es-AR').format(value);
  }

  agregarGasto(): void {
    if (!this.isValidForm()) {
      return;
    }

    const gasto: Gasto = {
      nombre: this.inputNombre.trim(),
      detalle: this.inputDetalle.trim(),
      fechaYHora: this.formatDate(new Date()),
      tipo: this.inputTipo.trim(),
      precio: Math.floor(this.inputPrecio)
    };

    if (this.editingIndex === null) {
      this.gastos.push(gasto);
    } else {
      this.gastos[this.editingIndex] = {
        ...gasto,
        fechaYHora: this.gastos[this.editingIndex].fechaYHora
      };
    }

    this.resetForm();
    this.persist();
  }

  eliminarGasto(index: number): void {
    this.gastos.splice(index, 1);
    this.persist();
  }

  editarGasto(index: number): void {
    const gasto = this.gastos[index];
    this.inputNombre = gasto.nombre;
    this.inputDetalle = gasto.detalle;
    this.inputTipo = gasto.tipo;
    this.inputPrecio = gasto.precio;
    this.editingIndex = index;
    this.modoEdicion = true;
    this.errorMessage = '';
  }

  cancelarEdicion(): void {
    this.resetForm();
  }

  private isValidForm(): boolean {
    if (this.inputDetalle.trim() === '' || this.inputPrecio <= 0) {
      this.errorMessage = 'Completá el detalle y un precio mayor a cero.';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  private resetForm(): void {
    this.inputNombre = '';
    this.inputDetalle = '';
    this.inputTipo = '';
    this.inputPrecio = 0;
    this.modoEdicion = false;
    this.editingIndex = null;
    this.errorMessage = '';
  }

  private persist(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.gastos));
  }

  private readGastos(): Gasto[] {
    let rawGastos: Partial<Gasto>[] = [];

    try {
      rawGastos = JSON.parse(localStorage.getItem(this.storageKey) || '[]') as Partial<Gasto>[];
    } catch {
      this.persist();
    }

    return rawGastos
      .filter((gasto) => !!gasto.detalle && Number(gasto.precio) > 0)
      .map((gasto) => ({
        nombre: String(gasto.nombre || ''),
        detalle: String(gasto.detalle),
        fechaYHora: String(gasto.fechaYHora || this.formatDate(new Date())),
        tipo: String(gasto.tipo || ''),
        precio: Number(gasto.precio)
      }));
  }

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}
