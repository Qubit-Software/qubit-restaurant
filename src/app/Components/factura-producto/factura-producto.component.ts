import { Component, OnInit, Input } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { OrdenModel } from 'src/app/Models/Orden';

@Component({
  selector: 'app-factura-producto',
  templateUrl: './factura-producto.component.html',
  styleUrls: ['./factura-producto.component.css']
})
export class FacturaProductoComponent implements OnInit {

  active = 0;
  dataArray: OrdenModel[];
  seleccionado:string;
  faPlus = faPlus;
  mesas: string[];

  constructor() { }

  ngOnInit(): void {
    this.mesas = new Array();
    this.mesas[0]="Mesa 1";
    this.mesas[1]="Mesa 2";
    this.dataArray = new Array();
    let firstOrden=new OrdenModel();
    this.dataArray.push(firstOrden);
  }

  CreateInventario(index) {
    
  }
  
  change(i:number){

  }
}
