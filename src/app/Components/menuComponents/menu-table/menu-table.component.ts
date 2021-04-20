import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaModel } from 'src/app/Models/Categorias.js';
import { OrderService } from 'src/app/Services/order.service';
import * as config from '../../../../config/config.js';

@Component({
  selector: 'app-menu-table',
  templateUrl: './menu-table.component.html',
  styleUrls: ['./menu-table.component.css']
})
export class MenuTableComponent implements OnInit {
  searchText: string;
  categoriasData: CategoriaModel[];
  modal: boolean;
  modal2: boolean;
  constructor(private order: OrderService, private router: Router, private route: ActivatedRoute) {
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
    console.log(this.modal2);
    this.llenaCategorias();

  }
  llenaCategorias() {
    this.categoriasData = new Array();
    let res = config['configValue']['categorias']
    Object.keys(res).map(key => {
      let categoria = new CategoriaModel();
      let spliNombre = key.split('-');
      categoria.id = +spliNombre[0];
      categoria.nombre = spliNombre[1];
      categoria.imagen = res[key];
      this.categoriasData.push(categoria);
    });
  }

  openModal() {
    this.order.openModal([true, true]);
  }

  settings() {
    this.router.navigate(['../settings', 'new'], { relativeTo: this.route });
  }
  closeModal() {
    document.getElementById("backdrop").style.display = "none"
    document.getElementById("menuModal").style.display = "none"
    document.getElementById("menuModal").className += document.getElementById("menuModal").className.replace("show", "")
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
