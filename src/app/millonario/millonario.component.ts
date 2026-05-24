import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-millonario',
  templateUrl: './millonario.component.html',
  styleUrls: ['./millonario.component.css']
})
export class MillonarioComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

  inputTiempo: number = 1;
  inputMillones: number = 1000000;
  resultado: number = 0;
  mostrarResultado: boolean = false;
  alertaMillones: boolean = false;
  alerta: boolean = false;

  currency(value: number | bigint): string {
    return new Intl.NumberFormat('es-AR').format(value);
  }

  calcularMillonario(): void {
    if (this.inputTiempo > 0 && this.inputMillones >= 1000000) {
      const dias = this.inputTiempo * 365;
      this.resultado = Math.round(this.inputMillones / dias);
      this.mostrarResultado = true;
      this.alertaMillones = false;
      this.alerta = false;
    }
    if (this.inputMillones < 1000000) {
      this.alertaMillones = true;
      this.mostrarResultado = false;
    }

    if (this.inputTiempo <= 0) {
      this.alerta = true;
      this.mostrarResultado = false;
    }
  }
}
