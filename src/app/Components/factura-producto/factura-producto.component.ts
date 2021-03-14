import { Component, OnInit, Input } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-factura-producto',
  templateUrl: './factura-producto.component.html',
  styleUrls: ['./factura-producto.component.css']
})
export class FacturaProductoComponent implements OnInit {
  @Input() templateFactura: boolean;

  active = 0;
  dataArray: number[];
  seleccionado:string;
  faPlus = faPlus;

  constructor() { }

  ngOnInit(): void {
    this.dataArray = new Array()
    console.log(this.templateFactura);
  }

  addForm() {
    let s = 1;
    this.dataArray.push(s);
  }
  deleteProduct(element) {
    this.dataArray.splice(element, 1);
    alert('test');
  }
}
