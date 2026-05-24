import { Component, OnInit } from '@angular/core';
import { Ahorro, AhorroDistribution, DEFAULT_AHORRO_DISTRIBUTION } from 'src/calculadoraDeAhorro.model';
import { AhorroService } from '../services/ahorro.service';

@Component({
  selector: 'app-calculadora-de-ahorro',
  templateUrl: './calculadora-de-ahorro.component.html',
  styleUrls: ['./calculadora-de-ahorro.component.css']
})
export class CalculadoraDeAhorroComponent implements OnInit {
  private readonly distributionStorageKey = 'ahorroDistribution';

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
  distributionErrorMessage: string = '';
  isEditingDistribution: boolean = false;
  distribution: AhorroDistribution = { ...DEFAULT_AHORRO_DISTRIBUTION };
  distributionDraft: AhorroDistribution = { ...DEFAULT_AHORRO_DISTRIBUTION };

  constructor(private ahorroService: AhorroService) {}

  ngOnInit(): void {
    this.distribution = this.readDistribution();
    this.distributionDraft = { ...this.distribution };

    this.ahorroService.getAhorros(this.distribution).subscribe((ahorros) => {
      this.ahorros = ahorros;
      this.balance();
    });
  }

  get restantePercent(): number {
    return 100 - this.distribution.paraTodaLaVida;
  }

  get draftRestantePercent(): number {
    return 100 - this.distributionDraft.paraTodaLaVida;
  }

  currency(value: number | bigint): string {
    return new Intl.NumberFormat('es-AR').format(value);
  }

  agregarAhorro(): void {
    if (!this.isValidForm()) {
      return;
    }

    if (this.editingIndex === null) {
      this.ahorros.push(new Ahorro(this.inputMonto, this.inputMes, this.inputReferencia, Date.now(), this.distribution));
    } else {
      this.ahorros[this.editingIndex] = new Ahorro(
        this.inputMonto,
        this.inputMes,
        this.inputReferencia,
        this.ahorros[this.editingIndex].id,
        this.distribution
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

  editarDistribucion(): void {
    this.distributionDraft = { ...this.distribution };
    this.distributionErrorMessage = '';
    this.isEditingDistribution = true;
  }

  cancelarDistribucion(): void {
    this.distributionDraft = { ...this.distribution };
    this.distributionErrorMessage = '';
    this.isEditingDistribution = false;
  }

  guardarDistribucion(): void {
    this.normalizeDistributionDraft();

    if (!this.isValidDistribution(this.distributionDraft)) {
      return;
    }

    this.distribution = { ...this.distributionDraft };
    localStorage.setItem(this.distributionStorageKey, JSON.stringify(this.distribution));
    this.recalculateAhorros();
    this.persist();
    this.distributionErrorMessage = '';
    this.isEditingDistribution = false;
  }

  restaurarDistribucion(): void {
    this.distributionDraft = { ...DEFAULT_AHORRO_DISTRIBUTION };
    this.distributionErrorMessage = '';
    this.guardarDistribucion();
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

  private isValidDistribution(distribution: AhorroDistribution): boolean {
    const values = Object.values(distribution);

    if (values.some((value) => value < 0 || value > 100 || Number.isNaN(value))) {
      this.distributionErrorMessage = 'Todos los porcentajes tienen que estar entre 0 y 100.';
      return false;
    }

    const restanteTotal = distribution.gastosBasicos
      + distribution.gustosCortoPlazo
      + distribution.gustosLargoPlazo
      + distribution.emergencias;

    if (restanteTotal !== 100) {
      this.distributionErrorMessage = 'Los porcentajes del monto restante tienen que sumar 100%.';
      return false;
    }

    this.distributionErrorMessage = '';
    return true;
  }

  private normalizeDistributionDraft(): void {
    this.distributionDraft = {
      paraTodaLaVida: Number(this.distributionDraft.paraTodaLaVida) || 0,
      gastosBasicos: Number(this.distributionDraft.gastosBasicos) || 0,
      gustosCortoPlazo: Number(this.distributionDraft.gustosCortoPlazo) || 0,
      gustosLargoPlazo: Number(this.distributionDraft.gustosLargoPlazo) || 0,
      emergencias: Number(this.distributionDraft.emergencias) || 0
    };
  }

  private recalculateAhorros(): void {
    this.ahorros = this.ahorros.map((ahorro) => new Ahorro(
      ahorro.ingreso,
      ahorro.mes,
      ahorro.referencia,
      ahorro.id,
      this.distribution
    ));
  }

  private readDistribution(): AhorroDistribution {
    try {
      const storedDistribution = JSON.parse(localStorage.getItem(this.distributionStorageKey) || 'null') as AhorroDistribution | null;

      if (storedDistribution && this.isValidDistribution(storedDistribution)) {
        return storedDistribution;
      }
    } catch {
      localStorage.removeItem(this.distributionStorageKey);
    }

    this.distributionErrorMessage = '';
    return { ...DEFAULT_AHORRO_DISTRIBUTION };
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
