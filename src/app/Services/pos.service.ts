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
  posVenta(nit, tel, direccion, ciudad, factura, fecha, products, subtotal, servVol, total, efectivo,
    cambio, idF, cliente, mesa) {
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
      idF,
      cliente,
      mesa
    };
    // console.log(authData);
    return this.http.post(
      `${this.urlPos}/venta`, authData).pipe(
        map(resp => {
          return resp;
        })
      );
  }
  preVenta(nit, tel, direccion, ciudad, fecha, products, subtotal, valorServicio, totalServicio, total, cliente, mesa) {
    const authData = {
      nit,
      tel,
      direccion,
      ciudad,
      fecha,
      products,
      subtotal,
      valorServicio,
      totalServicio,
      total,
      cliente,
      mesa
    };
    // console.log(authData);
    return this.http.post(
      `${this.urlPos}/preventa`, authData).pipe(
        map(resp => {
          return resp;
        })
      );
  }
  posReport(nit, tel, direccion, ciudad, report, fecha, efectivo, tarjeta, otro, totalProp, total) {
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
      totalProp,
      total
    };
    return this.http.post(
      `${this.urlPos}/report`, authData).pipe(
        map(resp => {
          return resp;
        })
      );
  }
  posOrder(hora, mesa, products, idDevice) {
    const authData = {
      hora,
      mesa,
      products
    };
    return this.http.post(
      `${this.urlPos}/order/${idDevice}`, authData).pipe(
        map(resp => {
          return resp;
        })
      );
  }
  posDomicilio(cliente, direccion, telefono, comentario) {
    const authData = {
      cliente,
      direccion,
      telefono,
      comentario
    };
    return this.http.post(
      `${this.urlPos}/domicilio`, authData).pipe(
        map(resp => {
          return resp;
        })
      );
  }
}
