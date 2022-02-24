import { Component, OnInit } from '@angular/core';
import { Ahorro } from 'src/calculadoraDeAhorro.model';
import { AhorroService } from '../services/ahorro.service';

@Component({
  selector: 'app-calculadora-de-ahorro',
  templateUrl: './calculadora-de-ahorro.component.html',
  styleUrls: ['./calculadora-de-ahorro.component.css']
})
export class CalculadoraDeAhorroComponent implements OnInit {

  public ahorros: any[] = []

  constructor(private ahorroService: AhorroService) {}

  async ngOnInit(){
    this.getAhorros();

    setTimeout(() => {
      this.balance();
    }
    , 10);
  }

  async getAhorros(){
    this.ahorroService.getAhorro().subscribe(
      response => {
        console.log(response);
        this.ahorros = response;
      },
      error => {
        console.log(error);
      }
    )
  }

  inputMonto: number = 0;
  inputMes: string = "";
  inputReferencia: string = "";
  totalBalance: number = 0;
  paraTodaLaVidaBalance: number = 0;
  gastosBasicosBalance: number = 0;
  gustosCortoPlazoBalance: number = 0;
  gustosLargoPlazoBalance: number = 0;
  emergenciasBalance: number = 0;
  modoEdicion: boolean = false;
  mostrarTabla: boolean = true;

  //moneda local
  currency = function(number: number | bigint){
    return new Intl.NumberFormat().format(number);
  };

  balance = (): void =>{
    if (this.ahorros.length > 0) {
      this.totalBalance = this.ahorros.reduce((a, b) => a + b.ingreso, 0);
      this.paraTodaLaVidaBalance = this.ahorros.reduce((a, b) => a + b.paraTodaLaVida, 0);
      this.gastosBasicosBalance = this.ahorros.reduce((a, b) => a + b.gastosBasicos, 0);
      this.gustosCortoPlazoBalance = this.ahorros.reduce((a, b) => a + b.gustosCortoPlazo, 0);
      this.gustosLargoPlazoBalance = this.ahorros.reduce((a, b) => a + b.gustosLargoPlazo, 0);
      this.emergenciasBalance = this.ahorros.reduce((a, b) => a + b.emergencias, 0);
    }
    if (this.ahorros.length === 0) {
      this.totalBalance = 0;
      this.paraTodaLaVidaBalance = 0;
      this.gastosBasicosBalance = 0;
      this.gustosCortoPlazoBalance = 0;
      this.gustosLargoPlazoBalance = 0;
      this.emergenciasBalance = 0;
    }
  }

  async agregarAhorro(): Promise<void>{
      this.ahorros.push(new Ahorro(this.inputMonto, this.inputMes, this.inputReferencia));
      this.inputMonto = 0;
      this.inputMes = "";
      this.inputReferencia = "";
      this.ahorroService.postAhorro(this.ahorros[this.ahorros.length - 1]).subscribe(
        response => {
          console.log(response);
        }
      )
      this.balance()
      console.log(this.ahorros, "agregar ahorro")
    if(this.ahorros.length > 0){
      this.mostrarTabla = true;
    }
  }


  eliminarAhorro(id: number): void{
    // const id = this.ahorros[index].id;
    this.ahorros.splice(id, 1);
    console.log(id, "id")
    this.ahorroService.deleteAhorro(id).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    )
    console.log(this.ahorros, "eliminar ahorro")
    this.balance();
    if(this.ahorros.length === 0){
      this.mostrarTabla = false;
    }

    this.ngOnInit();
  }

  editarAhorro(index: number){
    this.ahorros[index].editar = !this.ahorros[index].editar;
    this.ahorros[index].ingreso = this.inputMonto;
    this.ahorros[index].mes = this.inputMes.toUpperCase();
    this.ahorros[index].referencia = this.inputReferencia.toUpperCase();
    this.ahorroService.putAhorro(this.ahorros[index]).subscribe(
      response => {
        console.log(response);
      }
    )
    this.inputMonto = 0;
    this.inputMes = "";
    this.inputReferencia = "";
    this.balance();
    this.modoEdicion = !this.modoEdicion;
  }
}
