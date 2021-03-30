import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OrdenModel } from '../Models/Orden';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  openModal$: Observable<boolean[]>;
  consumidorId$: Observable<number>;
  orderData: OrdenModel[]

  private boolSubject: Subject<boolean[]>;
  private idConsumidor: Subject<number>;

  constructor() {
    this.orderData = new Array();
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
  updateOrder(orders: OrdenModel[]) {
    this.orderData = orders;
  }
  getOrder(): OrdenModel[] {
    return this.orderData;
  }
}
