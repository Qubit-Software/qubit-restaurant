import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { OrdenModel } from 'src/app/Models/Orden';
import { OrderService } from 'src/app/Services/order.service';
import { PosService } from 'src/app/Services/pos.service';
import { SucursalService } from 'src/app/Services/sucursal.service';
import { HelperFunctions } from 'src/app/helpers/functions';
import Swal from 'sweetalert2';
import { from } from 'rxjs';
import { VentaService } from 'src/app/Services/venta.service';
import { MesaModel } from 'src/app/Models/Mesas';

@Component({
  selector: 'app-factura-producto',
  templateUrl: './factura-producto.component.html',
  styleUrls: ['./factura-producto.component.css']
})
export class FacturaProductoComponent implements OnInit {

  widthModal = '0px';
  orderModalOpen: boolean;
  dataArray: OrdenModel[];
  seleccionado: string;
  faPlus = faPlus;
  mesas: MesaModel[] = new Array();
  subtotal: number = 0;
  baseLiquidacion: number = 0;
  impoConsumo: number = 0;
  propina: number = 0;
  total: number = 0;
  propinaBool: boolean = false;
  recibeInput: string = "0";
  cambioCalcule: number = 0;
  consumidorId;

  constructor(private router: Router, private route: ActivatedRoute, private order: OrderService, private sucursal: SucursalService,
    private pos: PosService, private venta: VentaService) {
    order.openModal$.subscribe((newBool: boolean[]) => {
      this.orderModalOpen = newBool[0];
      this.openModalOrder();
      this.dataArray = order.getOrder(this.mesas[0].id);
      if (this.dataArray == null) {
        this.dataArray = new Array();
      }
      this.llenaValores();
      if (newBool[1] == false) {
        this.closeModal();
      }
    });
    order.consumidorId$.subscribe((newId: number) => {
      this.consumidorId = newId;
    });
  }

  ngOnInit(): void {
    this.mesas.push(new MesaModel());
    this.dataArray = this.order.getOrder(this.mesas[0].id);
    $(".recibeInput").on({
      "focus": function (event) {
        $(event.target).select();
      },
      "keyup": function (event) {
        $(event.target).val(function (index, value) {
          return "$" + value.replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ".");
        });
      }
    });
    this.llenaMesas();
  }
  llenaMesas() {
    this.mesas = new Array();
    if (this.sucursal.mesas != null) {
      this.mesas = this.sucursal.mesas;
      this.order.mesaId = this.mesas[0].id;
    } else {
      this.sucursal.getSucursalInfo().subscribe(res => {
        this.mesas = new Array();
        this.mesas = this.sucursal.mesas;
        this.order.mesaId = this.mesas[0].id;
      });
    }
  }

  CreateOrden() {
    this.openModal();
  }

  change(i: number) {
    [this.mesas[0], this.mesas[i]] = [this.mesas[i], this.mesas[0]];
    this.order.mesaId = this.mesas[0].id;
    this.dataArray = this.order.getOrder(this.order.mesaId);
  }

  llenaValores() {
    if (this.dataArray.length > 0 || this.dataArray != null) {
      this.subtotal = 0;
      this.dataArray.forEach(element => {
        this.subtotal = this.subtotal + (element.cantidad * +element.precio);
      });
      if (this.propinaBool) {
        console.log(typeof this.propina);
        if ((typeof this.propina) == "string") {
          this.propina = +(String(this.propina).replace("$", "").replace(".", ""));
        } else {
          this.propina = this.subtotal * 0.1;
        }
      } else {
        this.propina = 0;
      }
      this.total = this.subtotal + this.propina;
      this.calculaCambio();
    } else {
      this.subtotal = 0;
      this.total = this.subtotal + this.propina;
      this.calculaCambio();
    }
  }

  openModalOrder() {
    if (this.orderModalOpen != null) {
      if (this.orderModalOpen) {
        this.widthModal = "35%";
        document.getElementById('modalDialog').style.maxWidth = "60%"
        document.getElementById('modalDialog').style.width = "60%"
        document.getElementById('modalDialog').style.float = "left"
        let productName = document.getElementsByClassName('productName');
        let categoryName = document.getElementsByClassName('categoryName');
        let imgName = document.getElementsByClassName('imgCategory');
        for (let i = 0; i < productName.length; i++) {
          let element = <HTMLElement>productName.item(i);
          element.style.fontSize = "13px";
        }
        for (let i = 0; i < categoryName.length; i++) {
          let element = <HTMLElement>categoryName.item(i);
          let elementImg = <HTMLElement>imgName.item(i);
          element.style.fontSize = "12px";
          element.style.width = "70%";
          elementImg.style.width = "70px"
        }
      } else {
        this.widthModal = "0px";
        if (document.getElementById('modalDialog') != null) {
          document.getElementById('modalDialog').style.maxWidth = "95%"
          document.getElementById('modalDialog').style.width = "95%"
          document.getElementById('modalDialog').style.float = "none"
          let productName = document.getElementsByClassName('productName');
          let categoryName = document.getElementsByClassName('categoryName');
          let imgName = document.getElementsByClassName('imgCategory');
          for (let i = 0; i < productName.length; i++) {
            let element = <HTMLElement>productName.item(i);
            element.style.fontSize = "16px";
          }
          for (let i = 0; i < categoryName.length; i++) {
            let element = <HTMLElement>categoryName.item(i);
            let elementImg = <HTMLElement>imgName.item(i);
            element.style.fontSize = "16px";
            element.style.width = "79%";
            elementImg.style.width = "95px"
          }
        }
      }
    }
  }

  cancelOrder() {
    Swal.fire({
      title: '¿Desea cancelar la orden?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataArray = new Array();
        this.order.updateOrder(this.dataArray, this.mesas[0].id);
        this.recibeInput = '0';
        this.llenaValores();
      }
    })
  }

  deleteConsumidor(index: number) {
    this.dataArray.splice(index, 1);
    this.order.updateOrder(this.dataArray, this.mesas[0].id);
    this.llenaValores();
  }
  closeModalOrder() {
    this.order.openModal([false, true]);
  }
  openModal() {
    document.getElementById("backdrop").style.display = "block"
    document.getElementById("menuModal").style.display = "block"
    document.getElementById("menuModal").className += "show"
  }
  closeModal() {
    document.getElementById("backdrop").style.display = "none"
    document.getElementById("menuModal").style.display = "none"
    document.getElementById("menuModal").className += document.getElementById("menuModal").className.replace("show", "")
    this.order.openModal([false, true]);
    this.router.navigate(['./'], { relativeTo: this.route });
  }
  propinaChange(event) {
    this.propinaBool = event.target.checked
    this.llenaValores();
  }
  calculaCambio() {
    let numberRecibe: number;
    numberRecibe = +(this.recibeInput.replace("$", "").replace(".", ""));
    this.cambioCalcule = numberRecibe - this.total;
  }
  pagarOrden() {
    if (this.consumidorId == 0 || this.consumidorId == null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor ingrese el cliente',
        confirmButtonText: 'Ok',
      });
      return
    }
    if (this.dataArray.length == 0 || this.dataArray == null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor ingrese una orden',
        confirmButtonText: 'Ok',
      });
      return
    }
    if (this.seleccionado == null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor ingrese la forma de pago',
        confirmButtonText: 'Ok',
      });
      return
    }
    if (this.sucursal.empresa == null) {
      this.sucursal.getSucursalInfo().subscribe(res => {
        this.enviaPos();
      });
    } else {
      this.enviaPos();
    }
  }
  enviaPos() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor'
    });
    Swal.showLoading();
    this.pos.getFactura(this.sucursal.empresa.id).subscribe(res => {
      let factura = res['factura'];
      factura = factura + 1;
      const date = new Date();
      let fecha = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      let products: ProductsPosModel[];
      products = new Array();
      this.dataArray.forEach(element => {
        let prod = new ProductsPosModel();
        prod.nombre = element.descripcion;
        prod.cantidad = String(element.cantidad);
        prod.precio = HelperFunctions.formatter.format(+element.precio);
        products.push(prod);
      });
      let menuArray: Object[];
      menuArray = new Array();
      this.dataArray.forEach(element => {
        let menu = {
          "cantidad": element.cantidad,
          "menuId": element.id_product
        };
        menuArray.push(menu);
      });
      let propinaLoc = +(String(this.propina).replace("$", "").replace(".", ""));
      let recibe = +(this.recibeInput.replace("$", "").replace(".", ""));
      if (this.cambioCalcule < 0) {
        this.cambioCalcule = 0;
      }
      this.pos.posVenta(this.sucursal.empresa.nit, this.sucursal.empresa.telefono, this.sucursal.sucursal.direccion,
        this.sucursal.sucursal.ciudad, factura, fecha, products, HelperFunctions.formatter.format(this.subtotal), HelperFunctions.formatter.format(propinaLoc),
        HelperFunctions.formatter.format(this.total), HelperFunctions.formatter.format(recibe),
        HelperFunctions.formatter.format(this.cambioCalcule), factura).subscribe(res => {
          this.venta.createVenta(this.sucursal.empresa.id, this.total, date, this.seleccionado, this.sucursal.sucursal.id,
            this.consumidorId, this.mesas[0].id, menuArray).subscribe(res => {
              this.dataArray = new Array();
              this.order.updateOrder(this.dataArray, this.mesas[0].id)
              Swal.close();
              Swal.fire('Ticket impreso',
                'El ticket se ha dispensado con exito',
                'success');
            }, (err) => {
              Swal.close();
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Vuelve a intentarlo'
              });
              console.log(err);
            });
        }, (err) => {
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encuentra la impresora conectada'
          });
          console.log(err);
        });
    })
  }
}
export class ProductsPosModel {
  nombre: string;
  cantidad: string;
  precio: string;
}
