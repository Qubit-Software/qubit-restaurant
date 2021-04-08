import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ConsumidorModel } from '../Models/Consumidor';
import { OrdenModel } from '../Models/Orden';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  openModal$: Observable<boolean[]>;
  consumidor$: Observable<ConsumidorModel>;
  mesaId: number;
  orderMesas = new Map<number, OrdenModel[]>();

  private boolSubject: Subject<boolean[]>;
  private consumidor: Subject<ConsumidorModel>;

  constructor() {
    this.boolSubject = new Subject<boolean[]>();
    this.consumidor = new Subject<ConsumidorModel>();
    this.openModal$ = this.boolSubject.asObservable();
    this.consumidor$ = this.consumidor.asObservable();
  }
  openModal(value: boolean[]) {
    this.boolSubject.next(value);
  }
  UpdateConsumidor(value: ConsumidorModel) {
    this.consumidor.next(value);
  }
  updateOrder(order: OrdenModel[], idMesa) {
    this.orderMesas.set(idMesa, order);
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
