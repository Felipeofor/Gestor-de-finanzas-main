export interface AhorroDistribution {
  paraTodaLaVida: number;
  gastosBasicos: number;
  gustosCortoPlazo: number;
  gustosLargoPlazo: number;
  emergencias: number;
}

export const DEFAULT_AHORRO_DISTRIBUTION: AhorroDistribution = {
  paraTodaLaVida: 10,
  gastosBasicos: 60,
  gustosCortoPlazo: 10,
  gustosLargoPlazo: 10,
  emergencias: 20
};

/** Monto fijo que sale antes de repartir (cuota de un préstamo, resumen de tarjeta, etc.). */
export interface CompromisoFijo {
  id: number;
  nombre: string;
  monto: number;
}

/** Bolsillos a los que se puede redirigir el excedente de emergencias o asignar una meta. */
export type BolsilloMetaKey = 'paraTodaLaVida' | 'gustosCortoPlazo' | 'gustosLargoPlazo';

export const BOLSILLO_LABELS: Record<BolsilloMetaKey | 'emergencias' | 'gastosBasicos', string> = {
  paraTodaLaVida: 'Para toda la vida',
  gastosBasicos: 'Gastos básicos',
  gustosCortoPlazo: 'Gustos de corto plazo',
  gustosLargoPlazo: 'Gustos de largo plazo',
  emergencias: 'Emergencias'
};

/** Cuando el fondo de emergencias llega a `monto`, lo que sobra va a `destino`. monto <= 0 = sin tope. */
export interface TopeEmergencias {
  monto: number;
  destino: BolsilloMetaKey;
}

export const DEFAULT_TOPE_EMERGENCIAS: TopeEmergencias = {
  monto: 0,
  destino: 'gustosLargoPlazo'
};

export interface MetaBolsillo {
  nombre: string;
  objetivo: number;
  /** Mes objetivo en formato yyyy-mm (input type="month"). */
  fecha: string;
}

export type MetasBolsillos = Partial<Record<BolsilloMetaKey, MetaBolsillo>>;

export class Ahorro {
    id: number;
    ingreso: number;
    /** Compromisos fijos descontados de este ingreso (se guarda el monto del momento en que se cargó). */
    compromisos: number;
    /** Lo que queda para repartir después de los compromisos. */
    disponible: number;
    paraTodaLaVida: number;
    sueldoReal: number;
    gastosBasicos: number;
    gustosCortoPlazo: number;
    gustosLargoPlazo: number;
    emergencias: number;
    /** Parte de emergencias que no entró por el tope y se movió a otro bolsillo. */
    excedenteEmergencias: number = 0;
    mes: string = "";
    referencia: string = "";
    editar: boolean = false;

    constructor(
        ingreso: number,
        mes: string,
        referencia: string,
        id: number = Date.now(),
        distribution: AhorroDistribution = DEFAULT_AHORRO_DISTRIBUTION,
        compromisos: number = 0,
    ){
        this.id = id;
        this.ingreso = Math.floor(ingreso);
        this.compromisos = Math.max(0, Math.min(Math.floor(compromisos) || 0, this.ingreso));
        this.disponible = this.ingreso - this.compromisos;
        this.mes = mes.trim();
        this.referencia = referencia.trim();
        this.paraTodaLaVida = Math.floor(this.disponible * (distribution.paraTodaLaVida / 100));
        this.sueldoReal = Math.floor(this.disponible - this.paraTodaLaVida);
        this.gastosBasicos = Math.floor(this.sueldoReal * (distribution.gastosBasicos / 100));
        this.gustosCortoPlazo = Math.floor(this.sueldoReal * (distribution.gustosCortoPlazo / 100));
        this.gustosLargoPlazo = Math.floor(this.sueldoReal * (distribution.gustosLargoPlazo / 100));
        this.emergencias = Math.floor(this.sueldoReal * (distribution.emergencias / 100));
    }
}

/**
 * Recorre los ingresos en el orden en que se cargaron y, una vez que el acumulado
 * de emergencias alcanza el tope, mueve el excedente al bolsillo destino.
 * Se aplica sobre ahorros recién construidos (no es idempotente sobre la misma lista).
 */
export function aplicarTopeEmergencias(ahorros: Ahorro[], tope: TopeEmergencias): void {
  if (!tope || !(tope.monto > 0)) {
    return;
  }

  let acumulado = 0;

  for (const ahorro of ahorros) {
    const lugar = Math.max(0, tope.monto - acumulado);
    const entra = Math.min(ahorro.emergencias, lugar);
    const excedente = ahorro.emergencias - entra;

    ahorro.emergencias = entra;
    ahorro.excedenteEmergencias = excedente;
    ahorro[tope.destino] += excedente;
    acumulado += entra;
  }
}

/** Meses completos entre el mes actual y el mes objetivo (yyyy-mm). Puede ser negativo si ya pasó. */
export function mesesHasta(fecha: string, hoy: Date = new Date()): number | null {
  const match = /^(\d{4})-(\d{2})$/.exec(fecha || '');

  if (!match) {
    return null;
  }

  const anio = Number(match[1]);
  const mes = Number(match[2]) - 1;

  return (anio - hoy.getFullYear()) * 12 + (mes - hoy.getMonth());
}
