import { Component, Input, OnInit } from '@angular/core';
import { faPlus, faMinus, faTimes, faComment } from '@fortawesome/free-solid-svg-icons';
import { OrdenModel } from 'src/app/Models/Orden';
import { OrderService } from 'src/app/Services/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nav-order',
  templateUrl: './nav-order.component.html',
  styleUrls: ['./nav-order.component.scss']
})
export class NavOrderComponent implements OnInit {

  @Input() orderTemplate: boolean;

  faPlus = faPlus;
  faMinus = faMinus;
  faTimes = faTimes;
  faComment = faComment
  commentId: number;
  orderData: OrdenModel[];
  comentario: string;
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
  addComment() {
    if (this.comentario == "") {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor verifica los datos',
        confirmButtonText: 'Ok',
      });
      return
    }
    this.orderData[this.commentId].comentario = this.comentario;
    this.order.updateOrder(this.orderData, this.order.mesaId);
    this.comentario = "";
    this.closeModal();
  }
  openModal(idProduct) {
    this.commentId = idProduct
    document.getElementById("backdrop").style.display = "block"
    document.getElementById("commentModal").style.display = "block"
    document.getElementById("commentModal").className += "show"
  }
  closeModal() {
    document.getElementById("commentModal").style.display = "none"
    document.getElementById("commentModal").className += document.getElementById("commentModal").className.replace("show", "")
  }
}
