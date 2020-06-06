import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';

// componentes de cliente
import { ClientesComponent } from './components/clientes/clientes.component';
import { FormComponent } from './components/form/form.component';

const routes: Routes = [

  { path: 'registro', component: RegistroComponent },
  { path: 'login'   , component: LoginComponent },
  { path: 'clientes', component: ClientesComponent},
  { path: 'clientes/page/:page', component: ClientesComponent},
  { path: 'clientes/form', component: FormComponent},
  { path: 'clientes/form/:id', component: FormComponent},
  { path: '**', redirectTo: 'registro' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
