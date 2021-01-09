import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-factura-producto',
  templateUrl: './factura-producto.component.html',
  styleUrls: ['./factura-producto.component.css']
})
export class FacturaProductoComponent implements OnInit {

  active = 0;
  dataArray: number[];
  faPlus = faPlus;
  constructor() { }

  ngOnInit(): void {
    this.dataArray = new Array()
  }

  addForm() {
    let s = 1;
    this.dataArray.push(s);
  }
  deleteProduct(element) {
    console.log('herre');
    this.dataArray.splice(element, 1);
    alert('test');
  }
}
