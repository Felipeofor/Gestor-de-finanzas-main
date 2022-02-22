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

  calcularMillonario(): void {
    if (this.inputTiempo > 0 && this.inputMillones >= 1000000) {
      let dias = this.inputTiempo * 365;
      this.resultado = Math.round(this.inputMillones / dias);
      this.mostrarResultado = true;
      this.alertaMillones = false;
      this.alerta = false;
    }
    if(this.inputMillones < 1000000){
      this.alertaMillones = true;
    }
    if(this.inputTiempo <= 0){
      this.alerta = true;
    }

  }

}
