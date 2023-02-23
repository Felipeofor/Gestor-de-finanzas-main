import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalculadoraDeAhorroComponent } from './calculadora-de-ahorro/calculadora-de-ahorro.component';
import { MillonarioComponent } from './millonario/millonario.component';
import { GestorDeGastosComponent } from './gestor-de-gastos/gestor-de-gastos.component';
import { ContactoComponent } from './contacto/contacto.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'calculadora-de-ahorro',
    pathMatch: 'full'
  },
  {
    path: 'calculadoraDeAhorro',
    component: CalculadoraDeAhorroComponent
  },
  {
    path: 'Millonario',
    component: MillonarioComponent
  },
  {
    	path: 'GestorDeGastos',
    component: GestorDeGastosComponent
},
{
  path: 'Contacto',
  component: ContactoComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
