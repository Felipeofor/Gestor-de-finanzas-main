import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalculadoraDeAhorroComponent } from './calculadora-de-ahorro/calculadora-de-ahorro.component';
import { MillonarioComponent } from './millonario/millonario.component';
import { GestorDeGastosComponent } from './gestor-de-gastos/gestor-de-gastos.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'calculadora-de-ahorro',
    component: CalculadoraDeAhorroComponent
  },
  {
    path: 'CalculadoraDeAhorro',
    redirectTo: 'calculadora-de-ahorro',
    pathMatch: 'full'
  },
  {
    path: 'millonario',
    component: MillonarioComponent
  },
  {
    path: 'Millonario',
    redirectTo: 'millonario',
    pathMatch: 'full'
  },
  {
    path: 'gestor-de-gastos',
    component: GestorDeGastosComponent
  },
  {
    path: 'GestorDeGastos',
    redirectTo: 'gestor-de-gastos',
    pathMatch: 'full'
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
