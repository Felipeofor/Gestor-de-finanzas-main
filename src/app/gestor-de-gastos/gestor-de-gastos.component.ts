import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gestor-de-gastos',
  templateUrl: './gestor-de-gastos.component.html',
  styleUrls: ['./gestor-de-gastos.component.css']
})
export class GestorDeGastosComponent implements OnInit {

  constructor() {
    if (localStorage.getItem('gastos') !== null) {
      this.gastos = JSON.parse(localStorage.getItem('gastos') || '[]');
    }
  }


  ngOnInit(): void {
  }

  inputNombre: string = '';
  inputDetalle: string = '';
  inputPrecio: string = '';
  inputTipo: string = '';
  obtenerfecha = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear();
  obtenerHora= new Date().getHours() + ':' + new Date().getMinutes();
  fechaYHora: string = `${this.obtenerfecha} ${this.obtenerHora}`;
  modoEdicion: boolean = false;

  gastos: any[] = [];


  agregarGasto(): void{
    if(this.inputDetalle !== '' && this.inputPrecio !== ''){
      this.gastos.push({
        nombre: this.inputNombre,
        detalle: this.inputDetalle,
        fechaYHora: this.fechaYHora,
        tipo: this.inputTipo,
        precio: this.inputPrecio,
        modoEdicion: false
      });
      this.inputNombre = '';
      this.inputDetalle = '';
      this.inputTipo = '';
      this.fechaYHora = '';
      this.inputPrecio = '';
      this.modoEdicion = false;
    }
    localStorage.setItem('gastos', JSON.stringify(this.gastos));
  }

  eliminarGasto(index: number): void{
    this.gastos.splice(index, 1);
    localStorage.setItem('gastos', JSON.stringify(this.gastos));
  }

  editarGasto(index: number): void{
    this.inputNombre = this.gastos[index].nombre;
    this.inputDetalle = this.gastos[index].detalle;
    this.fechaYHora = this.gastos[index].fechaYHora;
    this.inputPrecio = this.gastos[index].precio;
    this.inputPrecio = this.gastos[index].precio;
    this.gastos.splice(index, 1);
    this.modoEdicion = !this.modoEdicion;
    localStorage.setItem('gastos', JSON.stringify(this.gastos));
  }
}
