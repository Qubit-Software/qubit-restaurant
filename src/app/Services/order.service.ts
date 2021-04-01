import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OrdenModel } from '../Models/Orden';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  openModal$: Observable<boolean[]>;
  consumidorId$: Observable<number>;
  mesaId: number;
  orderMesas = new Map<number, OrdenModel[]>();

  private boolSubject: Subject<boolean[]>;
  private idConsumidor: Subject<number>;

  constructor() {
    this.boolSubject = new Subject<boolean[]>();
    this.idConsumidor = new Subject<number>();
    this.openModal$ = this.boolSubject.asObservable();
    this.consumidorId$ = this.idConsumidor.asObservable();
  }
  openModal(value: boolean[]) {
    this.boolSubject.next(value);
  }
  getConsumidor(value: number) {
    this.idConsumidor.next(value);
  }
  updateOrder(order: OrdenModel[], idMesa) {
    this.orderMesas.set(idMesa, order);
    console.log(this.orderMesas);
  }
  getOrder(idMesa) {
    if (idMesa != null) {
      if (this.orderMesas.get(idMesa) != null) {
        return this.orderMesas.get(idMesa);
      } else {
        return new Array();
      }
    } else {
      return null;
    }
  }
}
