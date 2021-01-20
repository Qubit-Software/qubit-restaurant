import { Component, OnInit } from '@angular/core';
import { InventarioService } from 'src/app/Services/inventario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  columns = new Array();
  columnsKey = new Array();
  searchText: string;
  inventario = new Array();
  page: number = 1;
  edit: number = -1;
  editIcon = '../../../../assets/images/iconos/edit-button.png';
  checkIcon = '../../../../assets/images/iconos/checked.png';
  constructor(private inventarioService: InventarioService) { }

  ngOnInit(): void {
    this.getColumns();
    this.getInventario();
  }
  getColumns() {
    this.inventarioService.getFirebaseInventario().subscribe((res: any[]) => {
      const ordered = Object.keys(res).sort().reduce(
        (obj, key) => {
          obj[key] = res[key];
          return obj;
        },
        {}
      );
      this.columns = Object.keys(ordered).map(key => ordered[key]);
      this.columnsKey = Object.keys(ordered).map(key => {
        let split = key.split("-");
        return split[1];
      });
      console.log(this.columns);
    }, err => {
      console.log(err);
    })
  }
  getInventario() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor'
    });
    Swal.showLoading();
    this.inventarioService.getAllInventario().subscribe((res: any[]) => {
      this.inventario = res['inventario'];
      Swal.close();
    }, err => {
      this.inventario = new Array();
      Swal.close();
      console.log(err);
    })
  }
  disabledEdit(index) {
    this.edit = index;
  }

  updateConsumidor(index) {

  }
  deleteConsumidor(index) {

  }
}
