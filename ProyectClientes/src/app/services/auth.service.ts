import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1';
  private apikey = 'AIzaSyDzSI7hiVPMEBtdiLyOX4kJ_qfpkkqfxms';


  userToken = '';

  // Crear nuevos usuarios
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  // Login

  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor( private http: HttpClient) {
    this.leerToken();
  }

  logaut() {

    localStorage.removeItem('token');

  }

  login( usuario: UsuarioModel) {

    const authData = {
      ...usuario,
      // email: usuario.email,
      // password: usuario.password,
      returnSecureToken: true

    };

    return this.http.post(
      `${ this.url }/accounts:signInWithPassword?key=${this.apikey}`,
      authData
        ).pipe(
          map( resp => {
            // tslint:disable-next-line: align
            this.guardarToken( resp['idToken']);
            // tslint:disable-next-line: align
            return resp;
          })
        );

  }

  usuarioNuevo( usuario: UsuarioModel) {

    const authData = {
      ...usuario,
      // email: usuario.email,
      // password: usuario.password,
      returnSecureToken: true

    };

    return this.http.post(
  `${ this.url }/accounts:signUp?key=${this.apikey}`,
  authData
    ).pipe(
      map( resp => {
        // tslint:disable-next-line: align
        this.guardarToken( resp['idToken']);
        // tslint:disable-next-line: align
        return resp;
      })
    );

  }

  private guardarToken( idToken: string ) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    // tslint:disable-next-line: prefer-const
    let hoy = new Date();
    hoy.setSeconds( 3600 );
    localStorage.setItem('expira', hoy.getTime().toString());

  }

  leerToken() {



    if ( localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');

    } else {

      // tslint:disable-next-line: no-unused-expression
      this.userToken;
    }

    return this.userToken;

  }

  estaAutenticado(): boolean {

    if ( this.userToken.length < 2 ) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expriaDate = new Date();
    expriaDate.setTime(expira);

   // tslint:disable-next-line: align
   if (expriaDate > new Date() ) {
    return true;
   } else {
     return false;
   }

  }


}
