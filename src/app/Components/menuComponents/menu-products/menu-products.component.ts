import { Component, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/Models/Products';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { OrderService } from 'src/app/Services/order.service';
import { OrdenModel } from 'src/app/Models/Orden';
import { MenuService } from 'src/app/Services/menu.service';
import * as config from '../../../../config/config.js';
import { CategoriaModel } from 'src/app/Models/Categorias.js';
import { ActivatedRoute, Router } from '@angular/router';
import { PrinterService } from 'src/app/Services/printer.service.js';
import Swal from 'sweetalert2';
import { ValidatorsFunctions } from 'src/app/helpers/validators';
import { element } from 'protractor';

@Component({
  selector: 'app-menu-products',
  templateUrl: './menu-products.component.html',
  styleUrls: ['./menu-products.component.css']
})
export class MenuProductsComponent implements OnInit {

  faChevronLeft = faChevronLeft;
  allProductsData: ProductModel[];
  productsData: ProductModel[];
  orderData: OrdenModel[];
  modal: boolean;
  modal2: boolean;
  checkedProd = new Map<number, boolean>();
  currentCategory = new CategoriaModel();
  btnDis = false;
  segmentaciones: object[] = new Array();
  constructor(private order: OrderService, private menu: MenuService, private router: Router, private route: ActivatedRoute,
    private printer: PrinterService) {
    order.openModal$.subscribe((newBool: boolean[]) => {
      this.orderData = order.getOrder(this.order.mesaId);
      this.llenaProducts();
    });
    menu.menuData$.subscribe((newMenu: ProductModel[]) => {
      this.allProductsData = newMenu;
    })
  }

  ngOnInit(): void {
    this.modal = false;
    if (history.state.modal != null) {
      this.modal = history.state.modal;
    }
    this.modal2 = false;
    if (history.state.modal2 != null) {
      this.modal2 = history.state.modal2;
    }
    let res = config['configValue']['categorias'];
    Object.keys(res).map(key => {
      let category = new CategoriaModel();
      let spliNombre = key.split('-');
      if (spliNombre[0] == history.state.category) {
        category.id = +spliNombre[0];
        category.nombre = spliNombre[1];
        category.imagen = res[key];
        this.currentCategory = category
      }
    });
    this.llenaProducts();
    this.llenaSegmentaciones();
  }
  llenaProducts() {
    if (this.allProductsData != null) {
      this.productsData = new Array();
      if (this.modal == true) {
        let categoryId = history.state.category;
        const items = this.allProductsData.filter(item => item.categoria == categoryId && item.visible == true);
        this.productsData = items;
        this.llenaChecks();
      } else {
        let categoryId = history.state.category;
        const items = this.allProductsData.filter(item => item.categoria == categoryId);
        this.productsData = items;
        this.llenaChecks();
      }
    } else {
      this.menu.getAllMenu().subscribe(res => {
        this.productsData = new Array();
        if (this.modal == true) {
          let categoryId = history.state.category;
          const items = this.allProductsData.filter(item => item.categoria == categoryId && item.visible == true);
          this.productsData = items;
          this.llenaChecks();
        } else {
          let categoryId = history.state.category;
          const items = this.allProductsData.filter(item => item.categoria == categoryId);
          this.productsData = items;
          this.llenaChecks();
        }
      });
    }
  }
  llenaChecks() {
    if (this.checkedProd.size <= 0) {
      this.productsData.forEach(element => {
        this.checkedProd.set(element.id, false);
      });
    }
  }
  llenaSegmentaciones() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor'
    });
    Swal.showLoading();
    if (ValidatorsFunctions.validateIdEmpresa()) {
      let idSucursal = localStorage.getItem('sucursalId');
      this.printer.getSegmentaciones(idSucursal).subscribe(res => {
        Swal.close();
        res['segmentacion'].forEach(element => {
          let object = {
            'id': element['id'],
            'nombre': element['nombre']
          }
          this.segmentaciones.push(object);
        });
      }, (err) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Se ha presentado un error inesperado'
        });
        console.log(err);
      });
    } else {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Se ha presentado un error inesperado'
      });
    }
  }
  change(i: number) {
    [this.segmentaciones[0], this.segmentaciones[i]] = [this.segmentaciones[i], this.segmentaciones[0]];
  }
  addOrder(prod: ProductModel) {
    this.orderData = this.order.getOrder(this.order.mesaId);
    let order = new OrdenModel();
    order.id = `${this.currentCategory.nombre.substr(0, 3).toUpperCase()}-${prod.index}`;
    order.id_product = prod.id;
    order.precio = prod.precio;
    order.descripcion = prod.nombre;
    order.cantidad = 1;
    if (this.orderData == null) {
      this.orderData = new Array();
    }
    this.orderData.push(order);
    this.order.updateOrder(this.orderData, this.order.mesaId);
    this.order.openModal([true, true]);
  }
  selectAll(event) {
    let bool = event.target.checked
    this.checkedProd.forEach((element, key) => {
      this.checkedProd.set(key, bool);
    });
    this.isChecked();
  }
  guardarSegmentacion() {
    if (this.segmentaciones.length == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes tener al menos una impresora registrada',
        confirmButtonText: 'Ok',
      });
      return
    }
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor'
    });
    let idProducts = new Array();
    this.checkedProd.forEach((element, key) => {
      if (element) {
        idProducts.push(key);
      }
    })
    this.printer.asignarImpresora(idProducts, this.segmentaciones[0]['id']).subscribe(res => {
      Swal.close();
      Swal.fire('Se ha actualizado el menu con exito', '', 'success');
      this.goBack()
    }, (err) => {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Se ha presentado un error inesperado'
      });
      console.log(err);
    })
  }
  isChecked() {
    let bool = false;
    this.checkedProd.forEach(element => {
      if (element) {
        bool = true;
      }
    })
    this.btnDis = bool;
  }
  checkedProduct(event, id) {
    let bool = event.target.checked
    this.checkedProd.set(id, bool);
    this.isChecked();
  }
  closeModal() {
    this.order.openModal([false, true]);
  }
  goBack() {
    this.router.navigate(['../menuTable'], { relativeTo: this.route, state: { 'modal2': this.modal2 } });
  }
  openUpdate(id) {
    this.router.navigate(['../settings', id], { relativeTo: this.route });
  }
}
