import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { from } from 'rxjs';

// componentes de clientes
import { NavbarComponent } from './components/navbar/navbar.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { FormComponent } from './components/form/form.component';
import { registerLocaleData } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import localeES from '@angular/common/locales/es';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FooterComponent } from './components/footer/footer.component';



registerLocaleData(localeES, 'es');


@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    LoginComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatMomentDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
