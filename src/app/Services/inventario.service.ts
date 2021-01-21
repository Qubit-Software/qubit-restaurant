import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private url = `${environment.apiUrl}/inventario`;
  constructor(private http: HttpClient, private firestore: AngularFirestore) { }

  getFirebaseInventario() {
    let inventarioNames = this.firestore.collection('/inventario_names').doc('1')
    return inventarioNames.snapshotChanges().pipe(
      map((changes) => {
        return changes.payload.data()
      })
    );
  }
  createInventario(inventario: Object) {
    const authData = {
      ...inventario,
    };
    console.log(authData);
    return this.http.post(
      `${this.url}/new`, authData).pipe(
        map(resp => {
          return resp;
        })
      );
  }
  getAllInventario() {
    return this.http.get(
      `${this.url}/getAll`).pipe(
        map(resp => {
          return resp;
        })
      );
  }
  updateInventario(inventario: Object) {
    const authData = {
      ...inventario
    };
    console.log(authData);
    return this.http.put(
      `${this.url}/update/${inventario['id']}`, authData).pipe(
        map(resp => {
          return resp;
        })
      );
  }

  deleteOne(id) {
    return this.http.delete(
      `${this.url}/delete/${id}`).pipe(
        map(resp => {
          return resp;
        })
      );
  }
}
