import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel;
  recordar: false;

  constructor( private auth: AuthService,
               private router: Router) {

   }

  ngOnInit() {

    this.usuario =  new UsuarioModel();

    if (localStorage.getItem('email')) {
     this.usuario.email = localStorage.getItem('email');
     // tslint:disable-next-line: no-unused-expression
     this.recordar;
    }

  }

  login(form: NgForm) {

    if ( form.invalid ) { return; }

    Swal.fire({
       allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.auth.login( this.usuario ).subscribe( resp => {
    console.log(resp);

    Swal.close();



  // tslint:disable-next-line: align
  if (this.recordar) {
    localStorage.setItem('email', this.usuario.email);
  }

    this.router.navigateByUrl('/clientes');
    }, (error) => {


      Swal.fire({
       title: 'Error al autenticar',
       icon: 'error',
       text: error.error.error.message
     });
    });


  }

}
