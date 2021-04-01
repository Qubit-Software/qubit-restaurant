import { Component, OnInit } from '@angular/core';
import { faPlus, faMinus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { OrdenModel } from 'src/app/Models/Orden';
import { OrderService } from 'src/app/Services/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nav-order',
  templateUrl: './nav-order.component.html',
  styleUrls: ['./nav-order.component.scss']
})
export class NavOrderComponent implements OnInit {

  faPlus = faPlus;
  faMinus = faMinus;
  faTimes = faTimes;
  orderData: OrdenModel[];
  constructor(private order: OrderService) {
    this.orderData = this.order.getOrder(this.order.mesaId);
    order.openModal$.subscribe((newBool: boolean[]) => {
      this.orderData = order.getOrder(this.order.mesaId);
    });
  }

  ngOnInit(): void {
  }

  sumCant(index: number, suma: boolean) {
    if (suma) {
      this.orderData[index].cantidad++
    } else {
      this.orderData[index].cantidad--
      if (this.orderData[index].cantidad <= 0) {
        this.deleteOrder(index);
      }
    }
    this.order.updateOrder(this.orderData, this.order.mesaId);
  }

  deleteOrder(id: number) {
    this.orderData.splice(id, 1);
    this.order.updateOrder(this.orderData, this.order.mesaId);
  }
  cancelOrder() {
    Swal.fire({
      title: '¿Desea cancelar la orden?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderData = new Array();
        this.order.updateOrder(this.orderData, this.order.mesaId);
        this.order.openModal([false, false]);
      }
    })
  }
  acceptOrder() {
    this.order.openModal([false, false]);
  }
}
