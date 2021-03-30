import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProductModel } from '../Models/Products';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  menuData: ProductModel[];
  private url = `${environment.apiUrl}/menu`;
  constructor(private http: HttpClient) { }

  getAllMenu() {
    this.menuData = new Array();
    let idSucursal = localStorage.getItem('sucursalId');
    let i = 1;
    return this.http.get(
      `${this.url}/getMenu/${idSucursal}`).pipe(
        map((resp: any[]) => {
          let respMenu = resp['menu']
          respMenu.forEach(prod => {
            let product = new ProductModel();
            product.id = prod['id'];
            product.index = i;
            product.nombre = prod['descripcion'];
            product.precio = prod['precio'];
            product.categoria = prod['categoriaId'];
            this.menuData.push(product);
            i++;
          });
          return this.menuData;
        })
      );
  }
  createMenu(categoriaId: number, descripcion: string, precio: string) {
    let sucursaleId = localStorage.getItem('sucursalId');
    const authData = {
      sucursaleId,
      categoriaId,
      descripcion,
      precio
    };
    return this.http.post(
      `${this.url}/new`, authData).pipe(
        map(resp => {
          return resp;
        })
      );
  }
}
