import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductModel } from '../Models/Products';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  menuData$: Observable<ProductModel[]>;
  private menuSubject: Subject<ProductModel[]>;
  private url = `${environment.apiUrl}/menu`;

  constructor(private http: HttpClient) {
    this.menuSubject = new Subject<ProductModel[]>();
    this.menuData$ = this.menuSubject.asObservable();
   }
  getAllMenu() {
    let dataArray = new Array();
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
            product.visible = prod['visible'];
            product.categoria = prod['categoriaId'];
            product.segmentacionId = prod['segmentacionId'];
            dataArray.push(product);
            i++;
          });
          this.menuSubject.next(dataArray);
          return dataArray;
        })
      );
  }
  createMenu(categoriaId: number, descripcion: string, precio: string, visible: boolean) {
    let sucursaleId = localStorage.getItem('sucursalId');
    const authData = {
      sucursaleId,
      categoriaId,
      descripcion,
      precio,
      visible
    };
    return this.http.post(
      `${this.url}/new`, authData).pipe(
        map(resp => {
          return resp;
        })
      );
  }
  updateMenu(id: number, categoriaId: number, descripcion: string, precio: string, visible: boolean) {
    const authData = {
      categoriaId,
      descripcion,
      precio,
      visible
    };
    return this.http.put(
      `${this.url}/update/${id}`, authData).pipe(
        map(resp => {
          return resp;
        })
      );
  }
  deleteOne(idMenu,idEmpresa) {
    return this.http.delete(
      `${this.url}/delete/${idMenu}/${idEmpresa}`).pipe(
        map(resp => {
          return resp;
        })
      );
  }
}
