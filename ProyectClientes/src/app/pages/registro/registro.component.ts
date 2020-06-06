import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { NgForm } from '@angular/forms';
import { from } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel;
  recordar: false;

  constructor( private auth: AuthService,
               private router: Router) { }

  ngOnInit() {

    this.usuario =  new UsuarioModel();

   }

   onSubmit( form: NgForm) {

    if ( form.invalid ) { return; }

    Swal.fire({
      allowOutsideClick: false,
     icon: 'info',
     text: 'Usuario Registrado'
   });
   // tslint:disable-next-line: align
   Swal.showLoading();

     // tslint:disable-next-line: align
     this.auth.usuarioNuevo( this.usuario).subscribe( resp => {
      console.log(resp);
      Swal.close();

      if (this.recordar) {
        localStorage.setItem('email', this.usuario.email);
      }


      this.router.navigateByUrl('/home');
     }, (err) => {

      Swal.fire({
        title: 'Verifique los datos',
        icon: 'error',
        text: err.error.error.message
      });

     });
   }


}
