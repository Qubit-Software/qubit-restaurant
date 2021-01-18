import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private http: HttpClient, private firestore: AngularFirestore) { }

  getFirebaseInventario() {
    let inventarioNames = this.firestore.collection('/inventario_names').doc('1')
    return inventarioNames.snapshotChanges().pipe(
      map((changes) => {
        return changes.payload.data()
      })
    );
  }

}
