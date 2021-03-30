import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private url = `${environment.apiUrl}/venta`;

  constructor(private http: HttpClient) { }

  createVenta(idEmpresa, preciototal, fecha, tipo, sucursaleId, consumidoreId, mesaId, menu) {
    const authData = {
      idEmpresa,
      preciototal,
      fecha,
      tipo,
      sucursaleId,
      consumidoreId,
      mesaId,
      menu
    };
    return this.http.post(
      `${this.url}/new`, authData).pipe(
        map(resp => {
          return resp;
        })
      );
  }
}
