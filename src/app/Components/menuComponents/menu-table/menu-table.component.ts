import { Component, OnInit } from '@angular/core';
import { CategoriaModel } from 'src/app/Models/Categorias.js';
import * as config from '../../../../config/config.js';

@Component({
  selector: 'app-menu-table',
  templateUrl: './menu-table.component.html',
  styleUrls: ['./menu-table.component.css']
})
export class MenuTableComponent implements OnInit {

  searchText: string;
  categoriasData: CategoriaModel[];
  constructor() { }

  ngOnInit(): void {
    this.llenaCategorias();

  }
  llenaCategorias() {
    this.categoriasData = new Array();
    let res = config['configValue']['categorias']
    Object.keys(res).map(key => {
      let categoria = new CategoriaModel();
      categoria.nombre = key;
      categoria.imagen = res[key];
      this.categoriasData.push(categoria);
    });
  }
}
