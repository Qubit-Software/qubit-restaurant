import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PosService {

  private url = `${environment.apiUrl}/venta`;
  private urlPos = `${environment.apiPos}/pos`;

  constructor(private http: HttpClient) { }

  getFactura(id) {
    return this.http.get(
      `${this.url}/getFactura/${id}`).pipe(
        map(resp => {
          return resp;
        })
      );
  }
  posVenta(nit, tel, direccion, ciudad, factura, fecha, products, subtotal, servVol, total, efectivo, cambio, idF) {
    const authData = {
      nit,
      tel,
      direccion,
      ciudad,
      factura,
      fecha,
      products,
      subtotal,
      servVol,
      total,
      efectivo,
      cambio,
      idF
    };
    // console.log(authData);
    return this.http.post(
      `${this.urlPos}/venta`, authData).pipe(
        map(resp => {
          return resp;
        })
      );
  }
  posReport(nit, tel, direccion, ciudad, report, fecha, efectivo, tarjeta, otro, total) {
    const authData = {
      nit,
      tel,
      direccion,
      ciudad,
      report,
      fecha,
      efectivo,
      tarjeta,
      otro,
      total
    };
    return this.http.post(
      `${this.urlPos}/report`, authData).pipe(
        map(resp => {
          return resp;
        })
      );
  }
}
