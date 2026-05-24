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

export class Ahorro{
    id: number;
    ingreso: number;
    paraTodaLaVida: number;
    sueldoReal: number;
    gastosBasicos: number;
    gustosCortoPlazo: number;
    gustosLargoPlazo: number;
    emergencias: number;
    mes: string = "";
    referencia: string = "";
    editar: boolean = false;

    constructor(
        ingreso: number,
        mes: string,
        referencia: string,
        id: number = Date.now(),
        distribution: AhorroDistribution = DEFAULT_AHORRO_DISTRIBUTION,
    ){
        this.id = id;
        this.ingreso = Math.floor(ingreso);
        this.mes = mes.trim();
        this.referencia = referencia.trim();
        this.paraTodaLaVida = Math.floor(this.ingreso * (distribution.paraTodaLaVida / 100));
        this.sueldoReal = Math.floor(this.ingreso - this.paraTodaLaVida);
        this.gastosBasicos = Math.floor(this.sueldoReal * (distribution.gastosBasicos / 100));
        this.gustosCortoPlazo = Math.floor(this.sueldoReal * (distribution.gustosCortoPlazo / 100));
        this.gustosLargoPlazo = Math.floor(this.sueldoReal * (distribution.gustosLargoPlazo / 100));
        this.emergencias = Math.floor(this.sueldoReal * (distribution.emergencias / 100));
    }
}
