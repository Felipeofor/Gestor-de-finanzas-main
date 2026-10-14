import { Component, OnInit } from '@angular/core';
import {
  Ahorro,
  AhorroDistribution,
  aplicarTopeEmergencias,
  BOLSILLO_LABELS,
  BolsilloMetaKey,
  CompromisoFijo,
  DEFAULT_AHORRO_DISTRIBUTION,
  DEFAULT_TOPE_EMERGENCIAS,
  MetaBolsillo,
  MetasBolsillos,
  mesesHasta,
  TopeEmergencias
} from 'src/calculadoraDeAhorro.model';
import { AhorroService } from '../services/ahorro.service';

interface MetaProgreso {
  key: BolsilloMetaKey;
  label: string;
  meta: MetaBolsillo | null;
  saldo: number;
  porcentaje: number;
  faltante: number;
  mesesRestantes: number | null;
  aporteNecesario: number;
  aportePromedio: number;
  estado: 'sin-meta' | 'cumplida' | 'en-camino' | 'atrasada' | 'vencida';
}

@Component({
  selector: 'app-calculadora-de-ahorro',
  templateUrl: './calculadora-de-ahorro.component.html',
  styleUrls: ['./calculadora-de-ahorro.component.css']
})
export class CalculadoraDeAhorroComponent implements OnInit {
  private readonly distributionStorageKey = 'ahorroDistribution';
  private readonly compromisosStorageKey = 'compromisosFijos';
  private readonly topeStorageKey = 'topeEmergencias';
  private readonly metasStorageKey = 'metasBolsillos';

  readonly bolsillosMeta: BolsilloMetaKey[] = ['gustosCortoPlazo', 'gustosLargoPlazo', 'paraTodaLaVida'];
  readonly labels = BOLSILLO_LABELS;

  ahorros: Ahorro[] = [];
  inputMonto: number = 0;
  inputMes: string = '';
  inputReferencia: string = '';
  inputDescontarCompromisos: boolean = true;
  totalBalance: number = 0;
  compromisosBalance: number = 0;
  paraTodaLaVidaBalance: number = 0;
  gastosBasicosBalance: number = 0;
  gustosCortoPlazoBalance: number = 0;
  gustosLargoPlazoBalance: number = 0;
  emergenciasBalance: number = 0;
  excedenteEmergenciasBalance: number = 0;
  editingIndex: number | null = null;
  errorMessage: string = '';
  distributionErrorMessage: string = '';
  isEditingDistribution: boolean = false;
  distribution: AhorroDistribution = { ...DEFAULT_AHORRO_DISTRIBUTION };
  distributionDraft: AhorroDistribution = { ...DEFAULT_AHORRO_DISTRIBUTION };

  compromisos: CompromisoFijo[] = [];
  inputCompromisoNombre: string = '';
  inputCompromisoMonto: number = 0;
  compromisoErrorMessage: string = '';

  tope: TopeEmergencias = { ...DEFAULT_TOPE_EMERGENCIAS };
  topeDraft: TopeEmergencias = { ...DEFAULT_TOPE_EMERGENCIAS };
  isEditingTope: boolean = false;

  metas: MetasBolsillos = {};
  metaEditando: BolsilloMetaKey | null = null;
  metaDraft: MetaBolsillo = { nombre: '', objetivo: 0, fecha: '' };
  metaErrorMessage: string = '';
  metasProgreso: MetaProgreso[] = [];

  constructor(private ahorroService: AhorroService) {}

  ngOnInit(): void {
    this.distribution = this.readDistribution();
    this.distributionDraft = { ...this.distribution };
    this.compromisos = this.readJson<CompromisoFijo[]>(this.compromisosStorageKey, [])
      .filter((c) => c && Number(c.monto) > 0 && !!c.nombre);
    this.tope = { ...DEFAULT_TOPE_EMERGENCIAS, ...this.readJson<Partial<TopeEmergencias>>(this.topeStorageKey, {}) };
    this.topeDraft = { ...this.tope };
    this.metas = this.readJson<MetasBolsillos>(this.metasStorageKey, {});

    this.ahorroService.getAhorros(this.distribution).subscribe((ahorros) => {
      this.ahorros = ahorros;
      this.recalcular();
    });
  }

  get restantePercent(): number {
    return 100 - this.distribution.paraTodaLaVida;
  }

  get draftRestantePercent(): number {
    return 100 - this.distributionDraft.paraTodaLaVida;
  }

  get totalCompromisos(): number {
    return this.compromisos.reduce((total, c) => total + c.monto, 0);
  }

  /** Cantidad de meses distintos cargados (por nombre de mes), para promedios mensuales. */
  get mesesCargados(): number {
    return new Set(this.ahorros.map((a) => a.mes.toLowerCase())).size || 1;
  }

  get gastosBasicosPromedio(): number {
    return Math.floor(this.gastosBasicosBalance / this.mesesCargados);
  }

  get emergenciasPorcentaje(): number {
    return this.tope.monto > 0 ? Math.min(100, Math.round((this.emergenciasBalance / this.tope.monto) * 100)) : 0;
  }

  currency(value: number | bigint): string {
    return new Intl.NumberFormat('es-AR').format(value);
  }

  // ---------------------------------------------------------------- ingresos

  agregarAhorro(): void {
    if (!this.isValidForm()) {
      return;
    }

    const compromisos = this.compromisosParaGuardar();

    if (compromisos > this.inputMonto) {
      this.errorMessage = `Los compromisos fijos ($${this.currency(compromisos)}) superan el monto.`;
      return;
    }

    if (this.editingIndex === null) {
      this.ahorros.push(new Ahorro(this.inputMonto, this.inputMes, this.inputReferencia, Date.now(), this.distribution, compromisos));
    } else {
      this.ahorros[this.editingIndex] = new Ahorro(
        this.inputMonto,
        this.inputMes,
        this.inputReferencia,
        this.ahorros[this.editingIndex].id,
        this.distribution,
        compromisos
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
    this.inputDescontarCompromisos = ahorro.compromisos > 0;
    this.editingIndex = index;
    this.errorMessage = '';
  }

  cancelarEdicion(): void {
    this.resetForm();
  }

  // ---------------------------------------------------------- distribución

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
    this.persist();
    this.distributionErrorMessage = '';
    this.isEditingDistribution = false;
  }

  restaurarDistribucion(): void {
    this.distributionDraft = { ...DEFAULT_AHORRO_DISTRIBUTION };
    this.distributionErrorMessage = '';
    this.guardarDistribucion();
  }

  // ------------------------------------------------------------ compromisos

  agregarCompromiso(): void {
    const nombre = this.inputCompromisoNombre.trim();
    const monto = Math.floor(Number(this.inputCompromisoMonto) || 0);

    if (!nombre || monto <= 0) {
      this.compromisoErrorMessage = 'Poné un nombre y un monto mayor a cero.';
      return;
    }

    this.compromisos.push({ id: Date.now(), nombre, monto });
    this.inputCompromisoNombre = '';
    this.inputCompromisoMonto = 0;
    this.compromisoErrorMessage = '';
    this.saveJson(this.compromisosStorageKey, this.compromisos);
  }

  eliminarCompromiso(index: number): void {
    this.compromisos.splice(index, 1);
    this.saveJson(this.compromisosStorageKey, this.compromisos);
  }

  // ------------------------------------------------------- tope emergencias

  editarTope(): void {
    this.topeDraft = { ...this.tope };
    this.isEditingTope = true;
  }

  usarMesesDeGastos(meses: number): void {
    this.topeDraft.monto = this.gastosBasicosPromedio * meses;
  }

  guardarTope(): void {
    this.tope = {
      monto: Math.max(0, Math.floor(Number(this.topeDraft.monto) || 0)),
      destino: this.topeDraft.destino
    };
    this.saveJson(this.topeStorageKey, this.tope);
    this.isEditingTope = false;
    this.recalcular();
  }

  cancelarTope(): void {
    this.topeDraft = { ...this.tope };
    this.isEditingTope = false;
  }

  // ------------------------------------------------------------------ metas

  editarMeta(key: BolsilloMetaKey): void {
    const actual = this.metas[key];
    this.metaDraft = actual ? { ...actual } : { nombre: '', objetivo: 0, fecha: '' };
    this.metaEditando = key;
    this.metaErrorMessage = '';
  }

  guardarMeta(): void {
    if (!this.metaEditando) {
      return;
    }

    const objetivo = Math.floor(Number(this.metaDraft.objetivo) || 0);

    if (!this.metaDraft.nombre.trim() || objetivo <= 0 || mesesHasta(this.metaDraft.fecha) === null) {
      this.metaErrorMessage = 'Completá nombre, monto objetivo y mes objetivo.';
      return;
    }

    this.metas[this.metaEditando] = { nombre: this.metaDraft.nombre.trim(), objetivo, fecha: this.metaDraft.fecha };
    this.saveJson(this.metasStorageKey, this.metas);
    this.metaEditando = null;
    this.calcularMetas();
  }

  eliminarMeta(key: BolsilloMetaKey): void {
    delete this.metas[key];
    this.saveJson(this.metasStorageKey, this.metas);
    this.metaEditando = null;
    this.calcularMetas();
  }

  cancelarMeta(): void {
    this.metaEditando = null;
    this.metaErrorMessage = '';
  }

  // ---------------------------------------------------------------- cálculo

  /** Reconstruye cada fila con la distribución actual, aplica el tope y recalcula balances y metas. */
  private recalcular(): void {
    this.ahorros = this.ahorros.map((ahorro) => new Ahorro(
      ahorro.ingreso,
      ahorro.mes,
      ahorro.referencia,
      ahorro.id,
      this.distribution,
      ahorro.compromisos
    ));
    aplicarTopeEmergencias(this.ahorros, this.tope);
    this.balance();
    this.calcularMetas();
  }

  private balance(): void {
    const sum = (key: keyof Ahorro) => this.ahorros.reduce((total, ahorro) => total + (ahorro[key] as number), 0);

    this.totalBalance = sum('ingreso');
    this.compromisosBalance = sum('compromisos');
    this.paraTodaLaVidaBalance = sum('paraTodaLaVida');
    this.gastosBasicosBalance = sum('gastosBasicos');
    this.gustosCortoPlazoBalance = sum('gustosCortoPlazo');
    this.gustosLargoPlazoBalance = sum('gustosLargoPlazo');
    this.emergenciasBalance = sum('emergencias');
    this.excedenteEmergenciasBalance = sum('excedenteEmergencias');
  }

  private calcularMetas(): void {
    const saldos: Record<BolsilloMetaKey, number> = {
      paraTodaLaVida: this.paraTodaLaVidaBalance,
      gustosCortoPlazo: this.gustosCortoPlazoBalance,
      gustosLargoPlazo: this.gustosLargoPlazoBalance
    };

    this.metasProgreso = this.bolsillosMeta.map((key) => {
      const meta = this.metas[key] || null;
      const saldo = saldos[key];
      const aportePromedio = Math.floor(saldo / this.mesesCargados);
      const base: MetaProgreso = {
        key, label: BOLSILLO_LABELS[key], meta, saldo,
        porcentaje: 0, faltante: 0, mesesRestantes: null, aporteNecesario: 0, aportePromedio, estado: 'sin-meta'
      };

      if (!meta) {
        return base;
      }

      const faltante = Math.max(0, meta.objetivo - saldo);
      const meses = mesesHasta(meta.fecha);
      const cuotas = Math.max(1, meses ?? 1);
      const aporteNecesario = Math.ceil(faltante / cuotas);
      let estado: MetaProgreso['estado'];

      if (faltante === 0) {
        estado = 'cumplida';
      } else if (meses !== null && meses < 0) {
        estado = 'vencida';
      } else {
        estado = aportePromedio >= aporteNecesario ? 'en-camino' : 'atrasada';
      }

      return {
        ...base,
        porcentaje: Math.min(100, Math.round((saldo / meta.objetivo) * 100)),
        faltante,
        mesesRestantes: meses,
        aporteNecesario,
        estado
      };
    });
  }

  private compromisosParaGuardar(): number {
    if (!this.inputDescontarCompromisos) {
      return 0;
    }

    // Al editar una fila que ya tenía compromisos, se respeta el monto de ese momento.
    if (this.editingIndex !== null && this.ahorros[this.editingIndex].compromisos > 0) {
      return this.ahorros[this.editingIndex].compromisos;
    }

    return this.totalCompromisos;
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

  private readJson<T>(key: string, fallback: T): T {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value ?? fallback;
    } catch {
      localStorage.removeItem(key);
      return fallback;
    }
  }

  private saveJson(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private resetForm(): void {
    this.inputMonto = 0;
    this.inputMes = '';
    this.inputReferencia = '';
    this.inputDescontarCompromisos = true;
    this.editingIndex = null;
    this.errorMessage = '';
  }

  private persist(): void {
    this.recalcular();
    this.ahorroService.saveAhorros(this.ahorros);
  }
}
