export class Ahorro{
    static reduce(arg0: (a: any, b: any) => any, arg1: number) {
      throw new Error('Method not implemented.');
    }
    
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
    ){
        this.ingreso = Math.floor(ingreso);
        this.mes = mes;
        this.referencia = referencia;
        this.paraTodaLaVida = Math.floor(this.ingreso * 0.10);
        this.sueldoReal = Math.floor(this.ingreso - this.paraTodaLaVida);
        this.gastosBasicos = Math.floor(this.sueldoReal * 0.60);
        this.gustosCortoPlazo = Math.floor(this.sueldoReal * 0.10);
        this.gustosLargoPlazo = Math.floor(this.sueldoReal * 0.10);
        this.emergencias = Math.floor(this.sueldoReal * 0.20);
    }
}