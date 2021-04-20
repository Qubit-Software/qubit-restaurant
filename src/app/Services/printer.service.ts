import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {
  private url = `${environment.apiUrl}`;
  private urlPos = `${environment.apiPos}/printer`;

  constructor(private http: HttpClient) { }

  getPrinters() {
    return this.http.get(
      `${this.urlPos}/length`).pipe(
        map(resp => {
          return resp;
        })
      );
  }
  createPrinter(nombre, impresora, sucursaleId) {
    const authData = {
      nombre,
      impresora,
      sucursaleId
    };
    return this.http.post(
      `${this.url}/segmentacion/new`, authData).pipe(
        map(resp => {
          return resp;
        })
      );
  }
  getTest(idDevice) {
    return this.http.get(
      `${this.urlPos}/test/${idDevice}`).pipe(
        map(resp => {
          return resp;
        })
      );
  }
  getSegmentaciones(id) {
    return this.http.get(
      `${this.url}/segmentacion/getAll/${id}`).pipe(
        map(resp => {
          return resp;
        })
      );
  }
  asignarImpresora(idProducts, segmentacionId) {
    const authData = {
      idProducts, 
      segmentacionId
    };
    console.log(authData);
    return this.http.put(
      `${this.url}/segmentacion/updateMenu`, authData).pipe(
        map(resp => {
          return resp;
        })
      );
  }
}
