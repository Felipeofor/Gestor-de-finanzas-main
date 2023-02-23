import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalculadoraDeAhorroComponent } from './calculadora-de-ahorro/calculadora-de-ahorro.component';
import { MillonarioComponent } from './millonario/millonario.component';
import { GestorDeGastosComponent } from './gestor-de-gastos/gestor-de-gastos.component';
import { ContactoComponent } from './contacto/contacto.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'CalculadoraDeAhorro',
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
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
