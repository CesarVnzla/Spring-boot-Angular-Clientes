import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Cliente } from '../components/clientes/cliente';
import { Observable, of, throwError } from 'rxjs';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import {  DatePipe } from '@angular/common';




@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private url = 'http://localhost:8080/api/clientes';

  private httpHeader = new HttpHeaders({'Content-Type': 'application/json'});

  constructor( private http: HttpClient, private router: Router ) { }


  // getClientes(): Observable<Cliente[]> {
  //   return of(CLIENTES);

  // }


  getClientes( page: number): Observable<any> {

    return this.http.get(this.url + '/page/' + page ).pipe(

      map(  (response: any) => {

         (response.content as Cliente[]).map( cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          // tslint:disable-next-line: prefer-const
          let datePipe = new DatePipe('es');
          cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd-MMMM yyyy');
          return cliente;
        });
        // tslint:disable-next-line: align
        return response;

      }),
      catchError(this.errorClientes),

      tap((response: any) => {

        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        });

      })

    );
  }

  errorClientes( error: HttpErrorResponse) {

   // tslint:disable-next-line: deprecation
    return throwError(error.message);

  }

  private creaArrreglo( clienteObj: object) {

    const cliente: Cliente[] = [];

    // // tslint:disable-next-line: curly
    // if (this.httpError.error.status == 0) { return 'afalso'; }

    // tslint:disable-next-line: whitespace
    if (clienteObj === null ) { return [];}


    Object.keys( clienteObj ).forEach( (key: any) => {
      const cliente1: Cliente = clienteObj[key];
       // tslint:disable-next-line: align
      //  cliente1.id = key;
      cliente.push(cliente1);
    });

    return cliente;

  }

  // Crear -----Convirtiendo manualmente el JSON con el operador map--------


  create(cliente: Cliente): Observable<any> {

    return this.http.post(this.url, cliente, {headers: this.httpHeader}).pipe(
      map((response: any) => response.cliente as Cliente),

      catchError(e => {

        // tslint:disable-next-line: triple-equals
        if (e.status == 400) {
          return throwError(e);
        }

        console.error(e.error.error);
        swal.fire(e.error.error, e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  // Obtener Datos-------------------------------------

  getCliente( id ): Observable<Cliente> {

    return this.http.get<Cliente>(`${this.url}/${id}`).pipe(
      catchError(e => {

        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal.fire('Error el Editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  // Actualizar Cliente -----------------------------------

  update(cliente: Cliente): Observable<any> {

    return this.http.put<any>(`${this.url}/${cliente.id}`, cliente, {headers: this.httpHeader}).pipe(
       catchError(e => {

        // tslint:disable-next-line: triple-equals
        if (e.status == 400) {
          return throwError(e);
        }

        console.error(e.error.mensajee);
        swal.fire('Error al editar Cliente', e.error.mensajee, 'error');
        return throwError(e);
      })
    );
  }

  // Borrar Cliente ------------------------------------------

  delete(id: number): Observable<Cliente> {

    return this.http.delete<Cliente>(`${this.url}/${id}`, {headers: this.httpHeader}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire('Error al borrar Cliente', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }


}


