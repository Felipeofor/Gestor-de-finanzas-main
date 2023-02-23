import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { CalculadoraDeAhorroComponent } from './calculadora-de-ahorro/calculadora-de-ahorro.component';
import { GestorDeGastosComponent } from './gestor-de-gastos/gestor-de-gastos.component';
import { ContactoComponent } from './contacto/contacto.component';
import { MillonarioComponent } from './millonario/millonario.component';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    CalculadoraDeAhorroComponent,
    GestorDeGastosComponent,
    ContactoComponent,
    MillonarioComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NoopAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
