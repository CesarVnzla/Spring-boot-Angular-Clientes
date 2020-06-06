import { Component, OnInit } from '@angular/core';
import { Cliente } from '../clientes/cliente';
import { ClientesService } from 'src/app/services/clientes.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {


  public cliente: Cliente = new Cliente();
  public titulo = 'Crear Cliente';
  // tslint:disable-next-line: ban-types
  public errors: String[];

  constructor( private clienteS: ClientesService,
               private router: Router,
               private activateRoute: ActivatedRoute,
               private auth: AuthService) { }



  ngOnInit() {

    this.cargarCliente();
  }

  cargarCliente(): void {

    this.activateRoute.params.subscribe( params => {


      // tslint:disable-next-line: no-string-literal
      const id = params['id'];

      if (id) {
        this.clienteS.getCliente(id).subscribe( (cliente) => this.cliente = cliente);
      }

    });

  }
  public create(): void {


    this.clienteS.create(this.cliente).subscribe(
      cliente =>  {


        this.router.navigate(['/clientes']);

        swal.fire('Cliente guardado', `el cliente ${cliente.nombre} ha sido creado con exito`, 'success');

      },
      err => {
        this.errors = err.error.errors as string[];
        console.error('Codigo del error desde el backed: ' + err.status);
        console.error(err.error.errors);
      }
      );

    console.log('click');
    console.log(this.cliente);

  }

  update(): void {

    this.clienteS.update(this.cliente).subscribe( json => {

      this.router.navigate(['/clientes']);

      swal.fire('Cliente Acutailizado', `${json.mensaje}: ${json.cliente.nombre}` , 'success');

    },
      err => {
        this.errors = err.error.errors as string[];
        console.error('Codigo del error desde el backed: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }

  salir() {
    this.auth.logaut();
    this.router.navigateByUrl('/clientes');
   }

}
