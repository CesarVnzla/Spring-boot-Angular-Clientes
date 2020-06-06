import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClientesService } from '../../services/clientes.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',

})
export class ClientesComponent implements OnInit {

  public clientes: Cliente[];
  paginador1: any;

  public errormsg;

  constructor( private clienteS: ClientesService,
               private activateR: ActivatedRoute,
               private auth: AuthService,
               private route: Router) { }


  ngOnInit() {

    // tslint:disable-next-line: prefer-const

    this.activateR.paramMap.subscribe( param => {
      let page: number = +param.get('page');

      if (!page) {
        page = 0;
      }
      this.clienteS.getClientes(page).subscribe( resp => {
        this.clientes = resp.content as Cliente[];
        this.paginador1 = resp;

      } ,
      // tslint:disable-next-line: no-unused-expression
      error => this.errormsg = error


      );
    });

  }


  delete(cliente: Cliente): void {

    Swal.fire({
      title: 'Esta seguro?',
      text: `Seguro que desea Eliminar al Cliente ${cliente.nombre} ${cliente.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, Eliminar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.value) {

        this.clienteS.delete(cliente.id).subscribe( response => {

          this.clientes = this.clientes.filter(cli => cli !== cliente);

          Swal.fire(
            'Cliente Eliminado!',
            `Cliente ${cliente.nombre} se ha eliminado con exito`,
            'success'
          );

        });
      }
    });


  }

  salir() {
    this.auth.logaut();
    this.route.navigateByUrl('/login');
   }


}
