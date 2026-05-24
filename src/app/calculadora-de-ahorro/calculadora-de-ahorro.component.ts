import { Component, OnInit } from '@angular/core';
import { Ahorro } from 'src/calculadoraDeAhorro.model';
import { AhorroService } from '../services/ahorro.service';

@Component({
  selector: 'app-calculadora-de-ahorro',
  templateUrl: './calculadora-de-ahorro.component.html',
  styleUrls: ['./calculadora-de-ahorro.component.css']
})
export class CalculadoraDeAhorroComponent implements OnInit {
  ahorros: Ahorro[] = [];
  inputMonto: number = 0;
  inputMes: string = '';
  inputReferencia: string = '';
  totalBalance: number = 0;
  paraTodaLaVidaBalance: number = 0;
  gastosBasicosBalance: number = 0;
  gustosCortoPlazoBalance: number = 0;
  gustosLargoPlazoBalance: number = 0;
  emergenciasBalance: number = 0;
  editingIndex: number | null = null;
  errorMessage: string = '';

  constructor(private ahorroService: AhorroService) {}

  ngOnInit(): void {
    this.ahorroService.getAhorros().subscribe((ahorros) => {
      this.ahorros = ahorros;
      this.balance();
    });
  }

  currency(value: number | bigint): string {
    return new Intl.NumberFormat('es-AR').format(value);
  }

  agregarAhorro(): void {
    if (!this.isValidForm()) {
      return;
    }

    if (this.editingIndex === null) {
      this.ahorros.push(new Ahorro(this.inputMonto, this.inputMes, this.inputReferencia));
    } else {
      this.ahorros[this.editingIndex] = new Ahorro(
        this.inputMonto,
        this.inputMes,
        this.inputReferencia,
        this.ahorros[this.editingIndex].id
      );
    }

    this.resetForm();
    this.persist();
  }

  eliminarAhorro(index: number): void {
    this.ahorros.splice(index, 1);
    this.persist();
  }

  editarAhorro(index: number): void {
    const ahorro = this.ahorros[index];
    this.inputMonto = ahorro.ingreso;
    this.inputMes = ahorro.mes;
    this.inputReferencia = ahorro.referencia;
    this.editingIndex = index;
    this.errorMessage = '';
  }

  cancelarEdicion(): void {
    this.resetForm();
  }

  private balance(): void {
    this.totalBalance = this.ahorros.reduce((total, ahorro) => total + ahorro.ingreso, 0);
    this.paraTodaLaVidaBalance = this.ahorros.reduce((total, ahorro) => total + ahorro.paraTodaLaVida, 0);
    this.gastosBasicosBalance = this.ahorros.reduce((total, ahorro) => total + ahorro.gastosBasicos, 0);
    this.gustosCortoPlazoBalance = this.ahorros.reduce((total, ahorro) => total + ahorro.gustosCortoPlazo, 0);
    this.gustosLargoPlazoBalance = this.ahorros.reduce((total, ahorro) => total + ahorro.gustosLargoPlazo, 0);
    this.emergenciasBalance = this.ahorros.reduce((total, ahorro) => total + ahorro.emergencias, 0);
  }

  private isValidForm(): boolean {
    if (this.inputMonto <= 0 || this.inputMes.trim() === '' || this.inputReferencia.trim() === '') {
      this.errorMessage = 'Completá todos los campos con un monto mayor a cero.';
      return false;
    }

    if (this.inputMes.trim().length < 3) {
      this.errorMessage = 'Ingresá un mes válido.';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  private resetForm(): void {
    this.inputMonto = 0;
    this.inputMes = '';
    this.inputReferencia = '';
    this.editingIndex = null;
    this.errorMessage = '';
  }

  private persist(): void {
    this.balance();
    this.ahorroService.saveAhorros(this.ahorros);
  }
}
