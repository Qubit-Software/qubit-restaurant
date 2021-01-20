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
        console.log(changes.payload.data());
        return changes.payload.data()
      })
    );
  }

  getAllInventario(){
    return this.http.get(
      `${this.url}/getAll`).pipe(
        map(resp => {
          return resp;
        })
      );
  }

}
