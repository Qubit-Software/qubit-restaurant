import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../Models/User';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = `${environment.apiUrl}/user`;

  userToken: string;
  expiresAt: string;
  constructor(private http: HttpClient) {
    this.readToken();
  }
  login(usuario: UserModel) {
    console.log(usuario);
    const authData = {
      ...usuario
    };
    console.log( `${this.url}/login`);
    console.log(authData);
    return this.http.post(
      `${this.url}/login`, authData).pipe(
        map(resp => {
          // tslint:disable-next-line: no-string-literal
          this.saveToken(resp['token'], 'date');
          return resp;
        })
      );

  }
  // LOGOUT*************************************
  logout() {
    localStorage.removeItem('token');
  }
  // SAVETOKEN*************************************
  private saveToken(idToken: string, expiresAt: string): void {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
    const today = new Date(expiresAt);
    localStorage.setItem('expires', today.getTime().toString());
  }
  // READTOKEN*************************************
  readToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
      return this.userToken;
    } else {
      this.userToken = '';
      return false;
    }
  }

}
