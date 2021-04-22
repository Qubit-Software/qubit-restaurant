import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { OrdenModel } from 'src/app/Models/Orden';
import { OrderService } from 'src/app/Services/order.service';
import { PosService } from 'src/app/Services/pos.service';
import { SucursalService } from 'src/app/Services/sucursal.service';
import { HelperFunctions } from 'src/app/helpers/functions';
import Swal from 'sweetalert2';
import { VentaService } from 'src/app/Services/venta.service';
import { MesaModel } from 'src/app/Models/Mesas';
import { ConsumidorModel } from 'src/app/Models/Consumidor';
import { ValidatorsFunctions } from 'src/app/helpers/validators';
import { PrinterService } from 'src/app/Services/printer.service';
import * as jQuery from 'jquery';

@Component({
  selector: 'app-factura-producto',
  templateUrl: './factura-producto.component.html',
  styleUrls: ['./factura-producto.component.css']
})
export class FacturaProductoComponent implements OnInit {
  @Input() orderTemplate: boolean;

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
  consumidor: ConsumidorModel;
  segmentaciones: object[];
  constructor(private router: Router, private route: ActivatedRoute, private order: OrderService, private sucursal: SucursalService,
    private pos: PosService, private venta: VentaService, private printer: PrinterService) {
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
    order.consumidor$.subscribe((newConsumidor: ConsumidorModel) => {
      this.consumidor = newConsumidor;
    });
  }

  ngOnInit(): void {

    this.mesas.push(new MesaModel());
    this.dataArray = this.order.getOrder(this.mesas[0].id);
    this.llenaMesas();
    this.getSegmentacion();
  }
  ngAfterViewChecked() {
    jQuery(".recibeInput").on({
      "focus": function (event) {
        console.log('Hola')
        $(event.target).select();
      },
      "keyup": function (event) {
        $(event.target).val(function (index, value) {
          return "$" + value.replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ".");
        });
      }
    });
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
    this.llenaValores()
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
    if (this.consumidor.id == null) {
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
  printerPreVenta() {
    if (this.consumidor.id == null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor ingrese el cliente',
        confirmButtonText: 'Ok',
      });
      return
    }
    if (this.dataArray == null || this.dataArray.length == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor ingrese una orden',
        confirmButtonText: 'Ok',
      });
      return
    }
    Swal.showLoading();
    const date = new Date();
    let fecha = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    let products: ProductsPosModel[];
    products = new Array();
    this.dataArray.forEach(element => {
      let prod = new ProductsPosModel();
      prod.nombre = element.descripcion;
      prod.cantidad = String(element.cantidad);
      prod.precio = HelperFunctions.formatter.format((+element.precio) * element.cantidad);
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
    let totalServicio = this.subtotal + (this.subtotal * 0.1);
    let servicio = this.subtotal * 0.1;
    this.pos.preVenta(this.sucursal.empresa.nit, this.sucursal.empresa.telefono, this.sucursal.sucursal.direccion,
      this.sucursal.sucursal.ciudad, fecha, products, HelperFunctions.formatter.format(this.subtotal), HelperFunctions.formatter.format(servicio), HelperFunctions.formatter.format(totalServicio),
      HelperFunctions.formatter.format(this.total), this.consumidor.nombre, this.mesas[0].mesa).subscribe(res => {
        Swal.close();
        Swal.fire('Ticket impreso',
          'El ticket se ha dispensado con exito',
          'success');
      }, (err) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se encuentra la impresora conectada'
        });
        console.log(err);
      });
  }
  getSegmentacion() {
    this.segmentaciones = new Array();
    if (ValidatorsFunctions.validateIdEmpresa()) {
      let idSucursal = localStorage.getItem('sucursalId');
      this.printer.getSegmentaciones(idSucursal).subscribe(res => {
        res['segmentacion'].forEach(element => {
          let segmentacion = {
            'id': element['id'],
            'impresora': element['impresora']
          };
          this.segmentaciones.push(segmentacion);
        });
      }, (err) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Se ha presentado un error inesperado'
        });
        console.log(err);
        return null
      });
    } else {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Se ha presentado un error inesperado'
      });
      return null
    }
  }
  async ordenar() {
    if (this.dataArray == null || this.dataArray.length == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Realiza una orden para poder continuar',
        confirmButtonText: 'Ok',
      });
      return
    }
    const time = new Date();
    const hour = `${time.getHours()}:${time.getMinutes()}`;
    let hourFormat = HelperFunctions.formatAMPM(hour);
    if (this.segmentaciones != null) {
      console.log(this.segmentaciones.length);
      this.segmentaciones.forEach(seg => {
        let prodBySeg
        const items = this.dataArray.filter(item => item.segmentacionId == seg['id']);
        prodBySeg = items;
        console.log(prodBySeg);
        let menuArray: Object[] = new Array();
        prodBySeg.forEach(element => {
          let commentProd = "";
          if (element.comentario != null) {
            commentProd = element.comentario
          }
          let menu = {
            "nombre": element.descripcion,
            "cantidad": element.cantidad,
            "comentario": commentProd,
          };
          menuArray.push(menu);
        });
        if (menuArray.length > 0 || menuArray != null) {
          Swal.fire({
            allowOutsideClick: false,
            icon: 'info',
            text: 'Espere por favor'
          });
          Swal.showLoading();
          this.pos.posOrder(hourFormat, this.mesas[0].mesa, menuArray, seg['impresora']).subscribe(res => {
            if (res['ok']) {
              Swal.close();
              Swal.fire('Ticket impreso',
                'Orden enviada',
                'success');
            } else {
              Swal.close();
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: res['msg']
              });
            }
          }, (err) => {
            Swal.close();
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se encuentra la impresora conectada'
            });
            console.log(err);
          });
        }
      });
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
        prod.precio = HelperFunctions.formatter.format((+element.precio) * element.cantidad);
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
      let totalVenta = this.total - propinaLoc;
      this.pos.posVenta(this.sucursal.empresa.nit, this.sucursal.empresa.telefono, this.sucursal.sucursal.direccion,
        this.sucursal.sucursal.ciudad, factura, fecha, products, HelperFunctions.formatter.format(this.subtotal), HelperFunctions.formatter.format(propinaLoc),
        HelperFunctions.formatter.format(this.total), HelperFunctions.formatter.format(recibe),
        HelperFunctions.formatter.format(this.cambioCalcule), factura, this.consumidor.nombre, this.mesas[0].mesa).subscribe(res => {
          this.venta.createVenta(this.sucursal.empresa.id, totalVenta, date, this.seleccionado, propinaLoc, this.sucursal.sucursal.id,
            this.consumidor.id, this.mesas[0].id, menuArray).subscribe(res => {
              this.order.UpdateConsumidor(new ConsumidorModel());
              this.dataArray = new Array();
              this.order.updateOrder(this.dataArray, this.mesas[0].id)
              this.llenaValores();
              this.recibeInput = '';
              this.cambioCalcule = 0;
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
