import { Component, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/Models/Products';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { OrderService } from 'src/app/Services/order.service';
import { OrdenModel } from 'src/app/Models/Orden';
import { MenuService } from 'src/app/Services/menu.service';
import * as config from '../../../../config/config.js';
import { CategoriaModel } from 'src/app/Models/Categorias.js';

@Component({
  selector: 'app-menu-products',
  templateUrl: './menu-products.component.html',
  styleUrls: ['./menu-products.component.css']
})
export class MenuProductsComponent implements OnInit {

  faChevronLeft = faChevronLeft;
  productsData: ProductModel[];
  orderData: OrdenModel[];
  modal: boolean;
  currentCategory = new CategoriaModel();
  constructor(private order: OrderService, private menu: MenuService) {
    order.openModal$.subscribe((newBool: boolean[]) => {
      this.orderData = order.getOrder(this.order.mesaId);
      this.llenaProducts();
    });
  }

  ngOnInit(): void {
    this.modal = false;
    if (history.state.modal != null) {
      this.modal = history.state.modal;
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
  }

  llenaProducts() {
    if (this.menu.menuData != null) {
      this.productsData = new Array();
      let categoryId = history.state.category;
      const items = this.menu.menuData.filter(item => item.categoria == categoryId);
      this.productsData = items;
    } else {
      this.menu.getAllMenu().subscribe(res => {
        this.productsData = new Array();
        let categoryId = history.state.category;
        const items = this.menu.menuData.filter(item => item.categoria == categoryId);
        this.productsData = items;
      });
    }
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
  closeModal() {
    this.order.openModal([false, true]);
  }
}
